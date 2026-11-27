"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

const PHRASES = [
  "PLAY MORE FOOTBALL",
  "FIND YOUR PEOPLE",
  "BUILT IN DELHI NCR",
  "NO SIDELINES. JUST GAME.",
];

const TELEMETRY_TAGS = [
  "5V5 CAGES",
  "7V7 FLOODLIT TURFS",
  "9V9 FULL WINGS",
  "SAKET",
  "DLF PHASE 4",
  "VASANT KUNJ",
  "NOIDA SEC 104",
  "HERPITCH WOMEN'S",
  "BALANCED SQUADS",
  "ZERO FLAKES",
];

/** Drifts constantly; scroll velocity speeds it up, scroll direction flips it, hover gently eases speed. */
export function Marquee() {
  const reduce = useReducedMotion();
  const pos = useMotionValue(0);
  const pos2 = useMotionValue(-12);
  const dir = useRef(1);
  const hovered = useRef(false);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const x = useTransform(pos, (v) => `${v}%`);
  const x2 = useTransform(pos2, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const v = vel.get();
    if (v > 40) dir.current = 1;
    else if (v < -40) dir.current = -1;
    const baseSpeed = hovered.current ? 0.45 : 1.5;
    const speed = baseSpeed + Math.min(Math.abs(v) / 240, 10);

    let next = pos.get() - dir.current * speed * (delta / 1000);
    if (next <= -25) next += 25;
    if (next > 0) next -= 25;
    pos.set(next);

    let next2 = pos2.get() + dir.current * (speed * 0.7) * (delta / 1000);
    if (next2 <= -25) next2 += 25;
    if (next2 > 0) next2 -= 25;
    pos2.set(next2);
  });

  const row = Array.from({ length: 4 }, () => PHRASES).flat();
  const tagRow = Array.from({ length: 4 }, () => TELEMETRY_TAGS).flat();

  return (
    <section
      aria-label="Play more football. Find your people. Built in Delhi NCR. No sidelines, just game."
      onMouseEnter={() => {
        hovered.current = true;
      }}
      onMouseLeave={() => {
        hovered.current = false;
      }}
      className="overflow-hidden border-y border-line bg-pitch"
    >
      {/* Top Telemetry Sub-band */}
      <div className="border-b border-line/70 bg-turf/50 py-2.5">
        <motion.div
          style={{ x: x2 }}
          className="flex w-max items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-mute"
          aria-hidden
        >
          {tagRow.map((tag, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className={i % 3 === 0 ? "text-volt" : ""}>{tag}</span>
              <span className="text-line">/</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main Monumental Kinetic Marquee */}
      <div className="py-6 md:py-8">
        <motion.div
          style={{ x }}
          className="flex w-max gap-10 whitespace-nowrap font-display text-[clamp(3rem,8.5vw,8.5rem)] uppercase leading-none"
          aria-hidden
        >
          {row.map((p, i) => (
            <span key={i} className={`flex items-center gap-10 ${i % 2 ? "outline-text" : "text-chalk"}`}>
              {p}
              <span className="text-volt">●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
