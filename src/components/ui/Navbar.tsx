"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Ticket, Search, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { ease } from "@/lib/tokens";

const NAV_LINKS = [
  { label: "Games", href: "#games", id: "games" },
  { label: "Penalty Box", href: "#penalty", id: "penalty" },
  { label: "Tournaments", href: "#tournaments", id: "tournaments" },
  { label: "Host", href: "#host", id: "host" },
  { label: "Community", href: "#community", id: "community" },
];

export function Navbar() {
  const { passes, openPasses, openBooking, games, setCmdOpen, unlockedPromo } = useApp();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32, restDelta: 0.001 });

  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countdown, setCountdown] = useState("02:14:38");

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      setScrolled(v > 48);
      if (v < 260) setActiveId("");
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px" }
    );
    for (const item of NAV_LINKS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Ticking live match kickoff countdown
  useEffect(() => {
    let secs = 2 * 3600 + 14 * 60 + 38;
    const iv = setInterval(() => {
      secs = secs > 0 ? secs - 1 : 2 * 3600 + 45 * 60;
      const h = String(Math.floor(secs / 3600)).padStart(2, "0");
      const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
      const s = String(secs % 60).padStart(2, "0");
      setCountdown(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const featuredGame = games.find((g) => g.filled < g.capacity) ?? games[0];

  return (
    <>
      {/* Razor-thin top scroll progress telemetry line */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-volt"
        aria-hidden
      />

      <header className="fixed left-0 right-0 top-0 z-50 px-[clamp(1rem,3.5vw,3.5rem)] pt-4 transition-all duration-500">
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-500 ease-expo md:px-5 ${
            scrolled
              ? "border-chalk/15 bg-pitch/85 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl"
              : "border-chalk/10 bg-pitch/45 backdrop-blur-md"
          }`}
        >
          {/* Left: Brand Lockup */}
          <a href="#" className="group flex items-center gap-2.5 focus-visible:outline-none">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-volt/40 bg-turf text-volt transition-transform duration-300 group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="M12 6.5L16.5 9.8L14.8 15H9.2L7.5 9.8L12 6.5Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
                <path d="M12 2.5V6.5M20.5 9L16.5 9.8M17.5 19.5L14.8 15M6.5 19.5L9.2 15M3.5 9L7.5 9.8" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-wide text-chalk md:text-xl">
                WEFOOTBALLIN&apos;
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-mute sm:text-[10px] sm:tracking-widest">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                DELHI NCR · {countdown}
              </span>
            </div>
          </a>

          {/* Center: Floating Pill Nav */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-full border border-line/80 bg-turf/70 p-1 lg:flex">
            {NAV_LINKS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveId(item.id)}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-pitch" : "text-mute hover:text-chalk"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-volt"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {unlockedPromo && (
              <span
                title="Reward code TOPBINS50 unlocked (₹50 off)"
                className="hidden items-center gap-1 rounded-full border border-volt/40 bg-volt/10 px-3 py-1.5 font-mono text-[11px] font-medium text-volt xl:inline-flex"
              >
                <Sparkles className="h-3 w-3" />
                TOPBINS50
              </span>
            )}

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Quick search and jump (Cmd+K)"
              className="hidden h-10 items-center gap-2 rounded-full border border-line bg-turf/70 px-3.5 text-xs text-mute transition-colors hover:border-volt/40 hover:text-chalk sm:inline-flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Find venue</span>
              <kbd className="rounded bg-pitch px-1.5 py-0.5 font-mono text-[10px] text-mute">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={openPasses}
              className="relative inline-flex h-10 items-center gap-2 rounded-full border border-chalk/20 bg-turf/80 px-3.5 text-xs font-medium text-chalk transition-colors hover:border-volt hover:text-volt"
            >
              <Ticket className="h-4 w-4 text-volt" />
              <span className="hidden sm:inline">Passes</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-volt px-1.5 font-mono text-[11px] font-bold text-pitch">
                {passes.length}
              </span>
            </button>

            <div className="hidden sm:block">
              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={() => featuredGame && openBooking(featuredGame.id)}
                  className="group relative inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-full bg-volt px-4 text-xs font-bold uppercase tracking-wider text-pitch transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 -translate-x-full bg-chalk transition-transform duration-500 ease-expo group-hover:translate-x-0" />
                  <span className="relative z-10 flex items-center gap-1">
                    Book Spot <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </Magnetic>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-turf text-chalk lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: ease.expo }}
              className="mt-2 rounded-3xl border border-line bg-pitch/95 p-5 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-2xl uppercase tracking-wide text-chalk transition-colors hover:bg-turf hover:text-volt"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-5 w-5 text-volt" />
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setCmdOpen(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-turf py-3 text-sm text-chalk"
                >
                  <Search className="h-4 w-4 text-volt" /> Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (featuredGame) openBooking(featuredGame.id);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-volt py-3 text-sm font-bold text-pitch"
                >
                  Book Tonight <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
