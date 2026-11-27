"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, Sparkles, RotateCcw, Flame, Trophy } from "lucide-react";
import { Roll } from "@/components/ui/Roll";
import { useApp } from "@/components/AppProvider";

const W = 960;
const H = 540;
const GOAL = { x: 170, y: 74, w: 620, h: 266 };
const SPOT = { x: W / 2, y: 472 };
const VOLT = "#C6FF3D";
const CHALK = "#F2EEE3";
const FLARE = "#FF5A36";
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const ZONES = {
  "top-left": { x: GOAL.x + 76, y: GOAL.y + 60, label: "Top Left" },
  "bot-left": { x: GOAL.x + 92, y: GOAL.y + 205, label: "Low Left" },
  center: { x: GOAL.x + GOAL.w / 2, y: GOAL.y + 135, label: "Panenka" },
  "top-right": { x: GOAL.x + GOAL.w - 76, y: GOAL.y + 60, label: "Top Right" },
  "bot-right": { x: GOAL.x + GOAL.w - 92, y: GOAL.y + 205, label: "Low Right" },
};

type Part = { x: number; y: number; vx: number; vy: number; life: number; c: string; r: number };
type Result = "goal" | "topbins" | "saved" | "wide" | null;
type ShotOutcome = "pending" | "goal" | "miss";

type Sim = {
  phase: "idle" | "shot" | "result";
  t0: number;
  to: { x: number; y: number };
  ctrl: { x: number; y: number };
  trail: { x: number; y: number; s: number }[];
  keeperEnd: { x: number; y: number };
  keeperT0: number;
  ripples: { x: number; y: number; t0: number }[];
  parts: Part[];
  shake: number;
  result: Result;
  resultAt: number;
  saved: boolean;
  topBins: boolean;
  inGoal: boolean;
  ball: { x: number; y: number; s: number; rot: number };
  ricochet: { vx: number; vy: number } | null;
};

const fresh = (): Sim => ({
  phase: "idle",
  t0: 0,
  to: SPOT,
  ctrl: SPOT,
  trail: [],
  keeperEnd: { x: GOAL.x + GOAL.w / 2, y: GOAL.y + GOAL.h - 68 },
  keeperT0: 0,
  ripples: [],
  parts: [],
  shake: 0,
  result: null,
  resultAt: 0,
  saved: false,
  topBins: false,
  inGoal: false,
  ball: { ...SPOT, s: 1, rot: 0 },
  ricochet: null,
});

export function PenaltyGame() {
  const reduce = useReducedMotion();
  const { unlockPromo, unlockedPromo } = useApp();
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const sim = useRef<Sim>(fresh());
  const audio = useRef<AudioContext | null>(null);
  const pointer = useRef<{ x: number; y: number; active: boolean }>({ x: W / 2, y: 180, active: false });

  const [goals, setGoals] = useState(0);
  const [shots, setShots] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState<ShotOutcome[]>(["pending", "pending", "pending", "pending", "pending"]);
  const [sound, setSound] = useState(true);
  const [msg, setMsg] = useState("Aim anywhere inside the goal and fire.");
  const soundRef = useRef(true);
  const displayFont = useRef("Impact, sans-serif");
  soundRef.current = sound;

  useEffect(() => {
    try {
      const savedBest = Number(localStorage.getItem("wf_penalty_best") || "0");
      if (savedBest > 0) setBestStreak(savedBest);
    } catch {
      // ignore
    }
  }, []);

  const ensureAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = (audio.current ??= new AudioCtx());
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const playFx = useCallback(
    (kind: "kick" | "goal" | "topbins" | "save" | "wide" | "whistle", force = false) => {
      if (!soundRef.current && !force) return;
      const ctx = ensureAudio();
      if (!ctx) return;

      const startFx = () => {
        const now = ctx.currentTime;

        if (kind === "whistle") {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(2650, now);
          o.frequency.linearRampToValueAtTime(2950, now + 0.06);
          o.frequency.linearRampToValueAtTime(2700, now + 0.14);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.14, now + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
          o.connect(g).connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.17);
          return;
        }

        if (kind === "kick") {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(175, now);
          o.frequency.exponentialRampToValueAtTime(44, now + 0.12);
          g.gain.setValueAtTime(0.42, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
          o.connect(g).connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.15);
          return;
        }

        if (kind === "save") {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(220, now);
          o.frequency.exponentialRampToValueAtTime(82, now + 0.18);
          g.gain.setValueAtTime(0.32, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
          o.connect(g).connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.21);
          return;
        }

        if (kind === "wide") {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(135, now);
          o.frequency.exponentialRampToValueAtTime(68, now + 0.26);
          g.gain.setValueAtTime(0.18, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          o.connect(g).connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.3);
          return;
        }

        // Goal / Top-bins celebration fanfare + crowd roar swell
        const notes = kind === "topbins" ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          const t0 = now + idx * 0.065;
          o.frequency.setValueAtTime(freq, t0);
          g.gain.setValueAtTime(0.001, t0);
          g.gain.linearRampToValueAtTime(0.2, t0 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.36);
          o.connect(g).connect(ctx.destination);
          o.start(t0);
          o.stop(t0 + 0.38);
        });

        // Filtered noise crowd roar
        const len = Math.floor(ctx.sampleRate * 0.65);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 720;
        filter.Q.value = 0.8;
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0.001, now);
        cg.gain.linearRampToValueAtTime(0.22, now + 0.12);
        cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
        src.connect(filter).connect(cg).connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.65);
      };

      if (ctx.state === "suspended") {
        void ctx.resume().then(startFx);
      } else {
        startFx();
      }
    },
    [ensureAudio]
  );

  const toggleSound = () => {
    setSound((prev) => {
      const next = !prev;
      soundRef.current = next;
      if (next) {
        ensureAudio();
        playFx("whistle", true);
      }
      return next;
    });
  };

  const shoot = useCallback(
    (px: number, py: number) => {
      const s = sim.current;
      if (s.phase !== "idle") return;
      const inGoal = px > GOAL.x + 8 && px < GOAL.x + GOAL.w - 8 && py > GOAL.y + 8 && py < GOAL.y + GOAL.h - 4;
      const to = { x: px, y: Math.min(py, GOAL.y + GOAL.h + 44) };
      const sideCurve = (px - SPOT.x) * -0.18 + (Math.random() - 0.5) * 70;
      const now = performance.now();

      // Top corners are hardest for the keeper to reach
      const nearSide = Math.min(px - GOAL.x, GOAL.x + GOAL.w - px);
      const nearTop = py - GOAL.y;
      const isTopBins = inGoal && nearSide < 115 && nearTop < 92;
      const reach = isTopBins ? 46 : nearSide < 70 ? 58 : 86;

      // Keeper reads direction with realistic human error
      const noiseX = (Math.random() - 0.5) * 320;
      const noiseY = (Math.random() - 0.5) * 160;
      const end = {
        x: Math.max(GOAL.x + 48, Math.min(GOAL.x + GOAL.w - 48, to.x + noiseX)),
        y: Math.max(GOAL.y + 52, Math.min(GOAL.y + GOAL.h - 32, to.y + noiseY)),
      };
      const willSave = inGoal && Math.hypot(end.x - to.x, end.y - to.y) < reach;

      Object.assign(s, {
        phase: "shot",
        t0: now,
        to,
        ctrl: { x: (SPOT.x + to.x) / 2 + sideCurve, y: (SPOT.y + to.y) / 2 - 48 },
        trail: [],
        keeperEnd: end,
        keeperT0: now + 125,
        saved: willSave,
        topBins: isTopBins,
        inGoal,
        result: null,
        ricochet: willSave ? { vx: (to.x > end.x ? 1 : -1) * (240 + Math.random() * 140), vy: 180 + Math.random() * 120 } : null,
      });

      setShots((n) => n + 1);
      setMsg("Shot away...");
      ensureAudio();
      playFx("kick");
    },
    [ensureAudio, playFx]
  );

  const aimKey = (zone: keyof typeof ZONES) => {
    const z = ZONES[zone];
    shoot(z.x + (Math.random() * 26 - 13), z.y + (Math.random() * 22 - 11));
  };

  const resetShootout = () => {
    setRound(["pending", "pending", "pending", "pending", "pending"]);
    setStreak(0);
    setMsg("Fresh 5-kick shootout. Aim for the corners.");
  };

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);

    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
    if (fam) {
      displayFont.current = `${fam}, Impact, sans-serif`;
      document.fonts.load(`140px ${fam}`, "GOAL!TOPBINSSAVEDWIDE");
    }

    let raf = 0;
    let last = performance.now();

    const finish = (now: number) => {
      const s = sim.current;
      s.phase = "result";
      s.resultAt = now;

      const recordOutcome = (scored: boolean) => {
        setRound((prev) => {
          const idx = prev.findIndex((x) => x === "pending");
          const next = idx === -1 ? (["pending", "pending", "pending", "pending", "pending"] as ShotOutcome[]) : [...prev];
          const writeIdx = idx === -1 ? 0 : idx;
          next[writeIdx] = scored ? "goal" : "miss";
          const roundGoals = next.filter((x) => x === "goal").length;
          if (roundGoals >= 4) unlockPromo();
          return next;
        });

        setStreak((cur) => {
          const next = scored ? cur + 1 : 0;
          if (next >= 3) unlockPromo();
          setBestStreak((b) => {
            const updated = Math.max(b, next);
            try {
              localStorage.setItem("wf_penalty_best", String(updated));
            } catch {
              // ignore
            }
            return updated;
          });
          return next;
        });
      };

      if (!s.inGoal) {
        s.result = "wide";
        setMsg("Wide of the post! Adjust your aim.");
        playFx("wide");
        recordOutcome(false);
      } else if (s.saved) {
        s.result = "saved";
        setMsg("Denied by the keeper!");
        playFx("save");
        recordOutcome(false);
        if (!reduce) {
          for (let i = 0; i < 24; i++) {
            s.parts.push({
              x: s.to.x,
              y: s.to.y,
              vx: (Math.random() - 0.5) * 380,
              vy: (Math.random() - 0.5) * 320,
              life: 0.7,
              c: CHALK,
              r: 2 + Math.random() * 2,
            });
          }
        }
      } else {
        s.result = s.topBins ? "topbins" : "goal";
        setGoals((g) => g + 1);
        setMsg(s.topBins ? "TOP BINS! Unstoppable finish!" : "BACK OF THE NET!");
        playFx(s.topBins ? "topbins" : "goal");
        s.ripples.push({ x: s.to.x, y: s.to.y, t0: now });
        recordOutcome(true);

        if (!reduce) {
          s.shake = s.topBins ? 1.35 : 0.9;
          const count = s.topBins ? 120 : 80;
          for (let i = 0; i < count; i++) {
            s.parts.push({
              x: s.to.x,
              y: s.to.y,
              vx: (Math.random() - 0.5) * 950,
              vy: -Math.random() * 750 - 90,
              life: 1,
              c: [VOLT, CHALK, "#ffffff"][i % 3],
              r: 2 + Math.random() * 3.5,
            });
          }
        }
      }
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = sim.current;
      ctx.clearRect(0, 0, W, H);

      // Stadium night sky + striped turf
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#080d0a");
      bg.addColorStop(0.62, "#0d1710");
      bg.addColorStop(1, "#132417");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle turf mowing bands below goal line
      for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(198,255,61,0.025)";
          ctx.fillRect(0, GOAL.y + GOAL.h + i * 35, W, 35);
        }
      }

      // Twin stadium floodlights
      const flLeft = ctx.createRadialGradient(180, 0, 10, 180, 0, 460);
      flLeft.addColorStop(0, "rgba(198,255,61,0.16)");
      flLeft.addColorStop(1, "rgba(198,255,61,0)");
      ctx.fillStyle = flLeft;
      ctx.fillRect(0, 0, W, H);

      const flRight = ctx.createRadialGradient(W - 180, 0, 10, W - 180, 0, 460);
      flRight.addColorStop(0, "rgba(242,238,227,0.11)");
      flRight.addColorStop(1, "rgba(242,238,227,0)");
      ctx.fillStyle = flRight;
      ctx.fillRect(0, 0, W, H);

      // Penalty area chalk markings
      ctx.strokeStyle = "rgba(242,238,227,0.22)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, GOAL.y + GOAL.h);
      ctx.lineTo(W - 40, GOAL.y + GOAL.h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(GOAL.x - 130, GOAL.y + GOAL.h);
      ctx.lineTo(GOAL.x - 165, H);
      ctx.moveTo(GOAL.x + GOAL.w + 130, GOAL.y + GOAL.h);
      ctx.lineTo(GOAL.x + GOAL.w + 165, H);
      ctx.stroke();

      // Penalty spot + D-arc
      ctx.beginPath();
      ctx.ellipse(SPOT.x, SPOT.y + 6, 8, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = CHALK;
      ctx.fill();

      // Top-Bins Bonus Zone Indicators (subtle corners)
      ctx.save();
      ctx.strokeStyle = "rgba(198,255,61,0.22)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(GOAL.x + 8, GOAL.y + 8, 104, 82);
      ctx.strokeRect(GOAL.x + GOAL.w - 112, GOAL.y + 8, 104, 82);
      ctx.restore();

      // 3D Net Back Depth & Spring Ripple Mesh
      ctx.strokeStyle = "rgba(242,238,227,0.2)";
      ctx.lineWidth = 1;
      const disp = (x: number, y: number) => {
        let d = 0;
        for (const r of s.ripples) {
          const a = (now - r.t0) / 1000;
          const dist = Math.hypot(x - r.x, y - r.y);
          d += (18 * Math.exp(-a * 2.5) * Math.sin(a * 17 - dist * 0.032)) / (1 + dist * 0.01);
        }
        return d;
      };
      for (let gx = 0; gx <= GOAL.w; gx += 24) {
        ctx.beginPath();
        for (let gy = 0; gy <= GOAL.h; gy += 16) {
          const x = GOAL.x + gx;
          const y = GOAL.y + gy;
          const d = disp(x, y);
          gy ? ctx.lineTo(x + d * 0.45, y + d) : ctx.moveTo(x + d * 0.45, y + d);
        }
        ctx.stroke();
      }
      for (let gy = 0; gy <= GOAL.h; gy += 24) {
        ctx.beginPath();
        for (let gx = 0; gx <= GOAL.w; gx += 16) {
          const x = GOAL.x + gx;
          const y = GOAL.y + gy;
          const d = disp(x, y);
          gx ? ctx.lineTo(x + d * 0.45, y + d) : ctx.moveTo(x + d * 0.45, y + d);
        }
        ctx.stroke();
      }
      s.ripples = s.ripples.filter((r) => now - r.t0 < 2500);

      // Goalposts with subtle inner glow
      ctx.strokeStyle = CHALK;
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(GOAL.x, GOAL.y + GOAL.h);
      ctx.lineTo(GOAL.x, GOAL.y);
      ctx.lineTo(GOAL.x + GOAL.w, GOAL.y);
      ctx.lineTo(GOAL.x + GOAL.w, GOAL.y + GOAL.h);
      ctx.stroke();

      // Interactive Aim Reticle & Curve Preview when idle
      if (s.phase === "idle" && pointer.current.active) {
        const px = pointer.current.x;
        const py = pointer.current.y;
        const isValid = px > GOAL.x && px < GOAL.x + GOAL.w && py > GOAL.y && py < GOAL.y + GOAL.h;

        ctx.save();
        ctx.strokeStyle = isValid ? "rgba(198,255,61,0.5)" : "rgba(255,90,54,0.45)";
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(SPOT.x, SPOT.y);
        ctx.quadraticCurveTo((SPOT.x + px) / 2, (SPOT.y + py) / 2 - 42, px, py);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = isValid ? VOLT : FLARE;
        ctx.fill();
        ctx.restore();
      }

      // Articulated Diving Goalkeeper
      const kt = s.phase === "idle" ? 0 : easeOut(Math.max(0, Math.min(1, (now - s.keeperT0) / 500)));
      const idleBreath = s.phase === "idle" ? Math.sin(now * 0.005) * 4 : 0;
      const startX = GOAL.x + GOAL.w / 2;
      const startY = GOAL.y + GOAL.h - 68;
      const kx = startX + (s.keeperEnd.x - startX) * kt + idleBreath;
      const ky = startY + (s.keeperEnd.y - startY) * kt;
      const tilt = ((s.keeperEnd.x - startX) / 280) * kt * 1.15;

      // Keeper turf shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(kx, GOAL.y + GOAL.h - 4, 28 + kt * 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(tilt);

      // Legs
      ctx.strokeStyle = "#080b09";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-9, 26);
      ctx.lineTo(-14 - kt * 10, 60);
      ctx.moveTo(9, 26);
      ctx.lineTo(14 + kt * 10, 60);
      ctx.stroke();

      // Jersey torso
      ctx.fillStyle = VOLT;
      ctx.beginPath();
      ctx.roundRect(-19, -28, 38, 56, 8);
      ctx.fill();

      // Keeper Head
      ctx.fillStyle = "#080b09";
      ctx.beginPath();
      ctx.arc(0, -42, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = VOLT;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outstretched Gloves
      const reachArm = 24 + kt * 34;
      ctx.strokeStyle = VOLT;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-18, -18);
      ctx.lineTo(-18 - reachArm * 0.65, -24 - kt * 18);
      ctx.moveTo(18, -18);
      ctx.lineTo(18 + reachArm * 0.65, -24 - kt * 18);
      ctx.stroke();

      ctx.fillStyle = CHALK;
      ctx.beginPath();
      ctx.arc(-18 - reachArm * 0.65, -24 - kt * 18, 9.5, 0, Math.PI * 2);
      ctx.arc(18 + reachArm * 0.65, -24 - kt * 18, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Ball Flight & Save Ricochet
      if (s.phase === "shot") {
        const t = Math.min((now - s.t0) / 590, 1);
        const e = easeOut(t);
        const u = 1 - e;
        const x = u * u * SPOT.x + 2 * u * e * s.ctrl.x + e * e * s.to.x;
        const y = u * u * SPOT.y + 2 * u * e * s.ctrl.y + e * e * s.to.y;
        s.ball = { x, y, s: 1 - 0.52 * e, rot: s.ball.rot + dt * 16 };
        s.trail.push({ x, y, s: s.ball.s });
        if (s.trail.length > 15) s.trail.shift();
        if (t >= 1) finish(now);
      } else if (s.phase === "result" && s.saved && s.ricochet) {
        s.ball.x += s.ricochet.vx * dt;
        s.ball.y += s.ricochet.vy * dt;
        s.ball.s = Math.min(0.85, s.ball.s + dt * 0.3);
        s.ball.rot += dt * 12;
      }

      // Glowing Ball Trail
      s.trail.forEach((p, i) => {
        ctx.globalAlpha = (i / s.trail.length) * 0.36;
        ctx.fillStyle = VOLT;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15 * p.s * (i / s.trail.length), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Ball Shadow + Spinning Pentagon Football
      const b = s.ball;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(b.x, b.y + 16 * b.s, 15 * b.s, 5 * b.s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = CHALK;
      ctx.beginPath();
      ctx.arc(0, 0, 17 * b.s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#080b09";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5;
        const px = Math.cos(ang) * 7 * b.s;
        const py = Math.sin(ang) * 7 * b.s;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Confetti / Turf Sparks
      s.parts = s.parts.filter((p) => p.life > 0);
      for (const p of s.parts) {
        p.vy += 1400 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 0.65;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.r * 2, p.r);
      }
      ctx.globalAlpha = 1;

      // Result Stamp Overlay
      if (s.phase === "result" && s.result) {
        const a = Math.min((now - s.resultAt) / 220, 1);
        const label =
          s.result === "topbins"
            ? "TOP BINS!"
            : s.result === "goal"
            ? "GOAL!"
            : s.result === "saved"
            ? "SAVED"
            : "WIDE";
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = `128px ${displayFont.current}`;
        ctx.textAlign = "center";
        ctx.fillStyle = s.result === "goal" || s.result === "topbins" ? VOLT : FLARE;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 24;
        ctx.fillText(label, W / 2, 260 + (1 - a) * 26);
        ctx.restore();

        if (now - s.resultAt > 1550) {
          const g = sim.current.parts;
          sim.current = { ...fresh(), parts: g };
          setMsg("Aim anywhere inside the goal and fire.");
        }
      }

      if (frame.current) {
        s.shake = Math.max(0, s.shake - dt * 3);
        frame.current.style.transform = s.shake
          ? `translate3d(${(Math.random() - 0.5) * 18 * s.shake}px, ${(Math.random() - 0.5) * 18 * s.shake}px, 0)`
          : "";
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reduce, playFx, unlockPromo]);

  const toCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const pct = shots > 0 ? Math.round((goals / shots) * 100) : 0;

  return (
    <section
      id="penalty"
      className="relative scroll-mt-24 border-t border-line bg-pitch px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,7.5vw,7rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header & Scoreboard */}
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-volt">
              <Flame className="h-3.5 w-3.5" /> Interactive Floodlight Penalty Box
            </p>
            <h2 className="font-display text-display uppercase leading-[0.88]">
              One shot.<br />
              <span className="text-volt">Beat the keeper.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <dl className="flex gap-6 font-display text-4xl sm:gap-8 sm:text-6xl">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Goals</dt>
                <dd className="text-volt">
                  <Roll value={goals} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Shots</dt>
                <dd>
                  <Roll value={shots} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Conv %</dt>
                <dd className="text-chalk">{pct}%</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Streak</dt>
                <dd className="text-volt">{streak}</dd>
              </div>
            </dl>

            <button
              type="button"
              role="switch"
              aria-checked={sound}
              onClick={toggleSound}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors ${
                sound ? "border-volt bg-volt/15 text-volt" : "border-chalk/25 bg-turf text-chalk hover:border-volt"
              }`}
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound {sound ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* 5-Kick Shootout Progress + Promo Challenge Banner */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-turf/60 px-5 py-3.5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-mute">5-Kick Challenge</span>
            <div className="flex items-center gap-2" aria-label="Shootout round status">
              {round.map((res, idx) => (
                <span
                  key={idx}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-bold transition-all ${
                    res === "goal"
                      ? "border-volt bg-volt text-pitch"
                      : res === "miss"
                      ? "border-flare bg-flare/20 text-flare"
                      : "border-line bg-pitch text-mute"
                  }`}
                >
                  {res === "goal" ? "✓" : res === "miss" ? "✕" : idx + 1}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={resetShootout}
              title="Reset 5-kick challenge"
              className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute hover:border-volt hover:text-chalk"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-mono text-mute">
              <Trophy className="h-3.5 w-3.5 text-volt" /> Best Streak: <strong className="text-chalk">{bestStreak}</strong>
            </span>
            {unlockedPromo ? (
              <a
                href="#games"
                className="inline-flex items-center gap-1.5 rounded-full bg-volt px-3.5 py-1.5 font-mono text-[11px] font-bold text-pitch"
              >
                <Sparkles className="h-3.5 w-3.5" /> TOPBINS50 Unlocked (-₹50)
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-volt/30 bg-volt/10 px-3.5 py-1.5 font-mono text-[11px] text-volt">
                <Sparkles className="h-3.5 w-3.5" /> Score 4/5 or 3 streak to unlock ₹50 off
              </span>
            )}
          </div>
        </div>

        {/* Interactive Canvas Stadium Frame */}
        <div
          ref={frame}
          className="overflow-hidden rounded-3xl border border-chalk/15 bg-pitch shadow-[0_30px_90px_rgba(0,0,0,0.65)] will-change-transform"
        >
          <canvas
            ref={canvas}
            onPointerMove={(e) => {
              const p = toCanvasCoords(e);
              pointer.current = { ...p, active: true };
            }}
            onPointerLeave={() => {
              pointer.current.active = false;
            }}
            onPointerDown={(e) => {
              const p = toCanvasCoords(e);
              shoot(p.x, p.y);
              if (e.pointerType !== "mouse") pointer.current.active = false;
            }}
            onPointerUp={(e) => {
              if (e.pointerType !== "mouse") pointer.current.active = false;
            }}
            onPointerCancel={() => {
              pointer.current.active = false;
            }}
            className="block aspect-[16/9] w-full cursor-crosshair touch-manipulation"
            role="img"
            aria-label="Penalty goal. Aim and click or tap a spot inside the goal to shoot."
          />
        </div>

        {/* Bottom HUD & Precision Aim Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="font-display text-2xl uppercase tracking-wide text-chalk">
            {msg}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Precision shot controls">
            {(Object.keys(ZONES) as Array<keyof typeof ZONES>).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => aimKey(z)}
                className="min-h-11 rounded-full border border-line bg-turf px-4 text-xs font-semibold uppercase tracking-wider text-chalk transition-colors hover:border-volt hover:bg-volt hover:text-pitch"
              >
                {ZONES[z].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
