"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Flame, MapPin, ShieldCheck, Users } from "lucide-react";
import { ease } from "@/lib/tokens";
import { Magnetic } from "@/components/ui/Magnetic";
import { useApp } from "@/components/AppProvider";
import { Roll } from "@/components/ui/Roll";

function useTypewriter(text: string, startDelayMs: number, reduce: boolean | null) {
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) {
      setN(text.length);
      return;
    }
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length && iv) clearInterval(iv);
      }, 90);
    }, startDelayMs);
    return () => {
      clearTimeout(t);
      if (iv) clearInterval(iv);
    };
  }, [text, startDelayMs, reduce]);
  return text.slice(0, n);
}

const lineVariants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: ease.expo, delay: 0.08 + i * 0.12 },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const { games, openBooking } = useApp();
  const bgY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 90]);
  const typed = useTypewriter("PEOPLE.", 850, reduce);
  const init = reduce ? "show" : "hidden";

  const tonightMatch = games[0];
  const spotsLeft = Math.max(0, tonightMatch.capacity - tonightMatch.filled);
  const fillPct = Math.round((tonightMatch.filled / tonightMatch.capacity) * 100);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden px-[clamp(1.25rem,4vw,4rem)] pb-10 pt-24 md:pb-12 md:pt-28">
      {/* Stadium Photography + Atmospheric Depth */}
      <motion.div style={{ y: bgY }} className="absolute -inset-x-0 -top-12 bottom-0 -z-20 bg-turf">
        <img
          src="/images/hero-pitch.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center opacity-85"
        />
      </motion.div>

      {/* Directional Contrast Scrim + Floodlight Glow */}
      <div className="floodlight absolute inset-0 -z-10" />
      <div className="pitch-lines absolute inset-0 -z-10 opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pitch/90 via-pitch/55 to-pitch/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pitch via-pitch/25 to-pitch/55" />

      {/* Main Above-the-Fold Split Grid */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left: Monumental Headline, CTAs & Structured Stats */}
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: ease.expo }}
            className="mb-4 flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-3.5 py-1.5 text-xs font-medium text-volt backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
              </span>
              SEASON 04 LIVE · DELHI NCR
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-chalk/15 bg-pitch/75 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-mute backdrop-blur-md">
              21°C · CLEAR NIGHT · FIFA PRO TURF
            </span>
          </motion.div>

          {/* 2-Line Monumental Headline — sized cleanly so it never wraps into 4 stacked lines */}
          <h1
            className="font-display text-[clamp(2.9rem,6.6vw,6.6rem)] uppercase leading-[0.88] tracking-tight"
            aria-label="Good football. Good people."
          >
            <span className="block overflow-hidden pb-[0.04em]" aria-hidden>
              <motion.span className="block sm:whitespace-nowrap" variants={lineVariants} initial={init} animate="show" custom={0}>
                GOOD FOOTBALL.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.05em] text-volt" aria-hidden>
              <motion.span className="block sm:whitespace-nowrap" variants={lineVariants} initial={init} animate="show" custom={1}>
                GOOD {typed}
                <span className="ml-1 inline-block h-[0.74em] w-[0.07em] animate-blink bg-volt" />
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: ease.expo }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-chalk/80 md:text-base"
          >
            Walk onto floodlit Delhi NCR pitches with balanced squads, zero flakes, bibs &amp; match balls ready. Book a solo spot in 15 seconds.
          </motion.p>

          {/* Primary Actions */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35, ease: ease.expo }}
            className="mt-6 flex flex-wrap items-center gap-3.5"
          >
            <Magnetic>
              <a
                href="#games"
                className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-volt px-7 py-3.5 text-sm font-bold text-pitch shadow-[0_0_35px_rgba(198,255,61,0.28)]"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-chalk transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                <span className="relative flex items-center gap-2">
                  Find your next game <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Magnetic>

            <a
              href="#penalty"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-chalk/25 bg-pitch/65 px-5 py-3 text-sm font-medium text-chalk backdrop-blur-md transition-colors hover:border-volt hover:text-volt"
            >
              <span>Penalty Shootout</span>
              <span className="rounded-full bg-volt/15 px-2 py-0.5 font-mono text-[10px] font-bold text-volt">WIN ₹50 OFF</span>
            </a>

            <a
              href="#tournaments"
              className="inline-flex min-h-11 items-center gap-1.5 px-2 py-2 text-sm text-mute transition-colors hover:text-chalk"
            >
              <span className="border-b border-transparent pb-0.5 transition-colors hover:border-volt">
                Tournaments
              </span>
              <ArrowDown className="h-4 w-4 text-volt" />
            </a>
          </motion.div>

          {/* Clean Structured Stadium Telemetry Strip (Zero Overlap) */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-chalk/15 pt-5"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-volt md:text-3xl">120+</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Games / Month</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-chalk md:text-3xl">2,400+</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Verified Players</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-chalk md:text-3xl">18</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Floodlit Turfs</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Interactive Tonight's Featured Kickoff Card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4, ease: ease.expo }}
          className="w-full lg:col-span-5 xl:col-span-4"
        >
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-chalk/20 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-volt/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-volt">
                <Flame className="h-3.5 w-3.5" /> Featured Tonight
              </span>
              <span className="font-mono text-xs text-mute">
                {tonightMatch.format} · {tonightMatch.durationMins}m
              </span>
            </div>

            <div className="mt-4">
              <h2 className="font-display text-2xl uppercase tracking-wide text-chalk md:text-3xl">
                {tonightMatch.title}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-mute md:text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-volt" />
                {tonightMatch.venue}
              </p>
            </div>

            {/* Live Capacity Progress */}
            <div className="mt-4 rounded-2xl border border-line bg-pitch/80 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-chalk">
                  <Users className="h-3.5 w-3.5 text-volt" />
                  <span className="inline-flex items-baseline font-mono">
                    <Roll value={tonightMatch.filled} pad={2} />/{tonightMatch.capacity}
                  </span>
                  <span>Locked</span>
                </span>
                <span className={`font-mono font-semibold ${spotsLeft <= 3 ? "text-flare" : "text-volt"}`}>
                  {spotsLeft === 0 ? "FULL" : `${spotsLeft} SPOTS LEFT`}
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-turf">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.9, ease: ease.expo, delay: 0.5 }}
                  className={`h-full rounded-full ${spotsLeft <= 3 ? "bg-flare" : "bg-volt"}`}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-1 text-xs text-mute">
                  <ShieldCheck className="h-3.5 w-3.5 text-volt" /> {tonightMatch.hostName}
                </p>
                <p className="font-mono text-lg font-bold text-chalk">
                  ₹{tonightMatch.price} <span className="text-xs font-normal text-mute">/ slot</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => openBooking(tonightMatch.id)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-volt px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-pitch transition-transform hover:scale-[1.03] active:scale-95"
              >
                {spotsLeft === 0 ? "Join Waitlist" : "Claim Slot"}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
