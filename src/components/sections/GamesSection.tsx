"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Search,
  LayoutGrid,
  List,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { CityZone, DayGroup, MatchFormat, SkillTier } from "@/lib/data";
import { ease } from "@/lib/tokens";

const ZONES: ("All NCR" | CityZone)[] = ["All NCR", "South Delhi", "Gurgaon", "Noida", "West Delhi"];
const FORMATS: ("All" | MatchFormat)[] = ["All", "5v5", "6v6", "7v7", "9v9"];
const DAYS: ("All Days" | DayGroup)[] = ["All Days", "Tonight", "Tomorrow", "This Weekend"];
const SKILLS: ("All Levels" | SkillTier)[] = ["All Levels", "Casual", "Intermediate", "Competitive", "Women's Only"];

export function GamesSection() {
  const { games, openBooking } = useApp();
  const [zone, setZone] = useState<"All NCR" | CityZone>("All NCR");
  const [format, setFormat] = useState<"All" | MatchFormat>("All");
  const [day, setDay] = useState<"All Days" | DayGroup>("All Days");
  const [skill, setSkill] = useState<"All Levels" | SkillTier>("All Levels");
  const [search, setSearch] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return games.filter((g) => {
      if (zone !== "All NCR" && g.zone !== zone) return false;
      if (format !== "All" && g.format !== format) return false;
      if (day !== "All Days" && g.dayGroup !== day) return false;
      if (skill !== "All Levels" && g.skill !== skill) return false;
      if (onlyOpen && g.filled >= g.capacity) return false;
      if (q) {
        const hay = `${g.title} ${g.venue} ${g.neighborhood} ${g.zone} ${g.format} ${g.skill}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [games, zone, format, day, skill, search, onlyOpen]);

  const totalSpotsLeft = useMemo(
    () => games.reduce((sum, g) => sum + Math.max(0, g.capacity - g.filled), 0),
    [games]
  );

  const resetFilters = () => {
    setZone("All NCR");
    setFormat("All");
    setDay("All Days");
    setSkill("All Levels");
    setSearch("");
    setOnlyOpen(false);
  };

  const hasFilters =
    zone !== "All NCR" || format !== "All" || day !== "All Days" || skill !== "All Levels" || search !== "" || onlyOpen;

  return (
    <section
      id="games"
      className="relative scroll-mt-24 px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,7.5vw,7rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-volt">
              <span className="h-2 w-2 rounded-full bg-volt" />
              Live Matchday Board · {totalSpotsLeft} Open Spots Across Delhi NCR
            </p>
            <h2 className="font-display text-display uppercase leading-[0.88]">
              Pick your pitch.<br />
              <span className="text-volt">Show up &amp; play.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Saket, Gurgaon..."
                aria-label="Search games by venue or neighborhood"
                className="h-11 w-full rounded-full border border-line bg-turf pl-10 pr-4 text-sm text-chalk placeholder:text-mute focus:border-volt focus:outline-none"
              />
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={onlyOpen}
              onClick={() => setOnlyOpen((v) => !v)}
              className={`h-11 rounded-full border px-4 text-xs font-medium transition-colors ${
                onlyOpen
                  ? "border-volt bg-volt/15 text-volt"
                  : "border-line bg-turf text-mute hover:border-chalk/30 hover:text-chalk"
              }`}
            >
              Open spots only
            </button>

            <div className="inline-flex rounded-full border border-line bg-turf p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`rounded-full p-2 transition-colors ${
                  view === "grid" ? "bg-volt text-pitch" : "text-mute hover:text-chalk"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                className={`rounded-full p-2 transition-colors ${
                  view === "list" ? "bg-volt text-pitch" : "text-mute hover:text-chalk"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Axis Filter Ribbon */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {ZONES.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZone(z)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  zone === z
                    ? "border-volt bg-volt text-pitch"
                    : "border-line bg-turf/60 text-mute hover:border-chalk/30 hover:text-chalk"
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by day"
              value={day}
              onChange={(e) => setDay(e.target.value as "All Days" | DayGroup)}
              className="h-9 rounded-full border border-line bg-turf px-3.5 text-xs font-medium text-chalk focus:border-volt focus:outline-none"
            >
              {DAYS.map((d) => (
                <option key={d} value={d} className="bg-turf text-chalk">
                  {d}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by format"
              value={format}
              onChange={(e) => setFormat(e.target.value as "All" | MatchFormat)}
              className="h-9 rounded-full border border-line bg-turf px-3.5 text-xs font-medium text-chalk focus:border-volt focus:outline-none"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f} className="bg-turf text-chalk">
                  {f === "All" ? "All Formats" : f}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by skill level"
              value={skill}
              onChange={(e) => setSkill(e.target.value as "All Levels" | SkillTier)}
              className="h-9 rounded-full border border-line bg-turf px-3.5 text-xs font-medium text-chalk focus:border-volt focus:outline-none"
            >
              {SKILLS.map((s) => (
                <option key={s} value={s} className="bg-turf text-chalk">
                  {s}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-flare/40 bg-flare/10 px-3.5 text-xs font-medium text-flare hover:bg-flare/20"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Games Grid / List */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-line bg-turf/40 p-12 text-center">
            <p className="font-display text-3xl uppercase text-chalk">No kickoffs match those filters</p>
            <p className="mt-2 text-sm text-mute">Try clearing a zone or format filter to see all 8 upcoming matches.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-volt px-6 py-3 text-sm font-bold text-pitch"
            >
              Show All Games
            </button>
          </div>
        ) : view === "grid" ? (
          <motion.div layout className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((game) => {
                const spotsLeft = Math.max(0, game.capacity - game.filled);
                const isFull = spotsLeft === 0;
                const isUrgent = spotsLeft > 0 && spotsLeft <= 3;

                return (
                  <motion.div
                    layout
                    key={game.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: ease.expo }}
                  >
                    <SpotlightCard className="flex h-full flex-col justify-between p-6">
                      <div>
                        {/* Card Top Tags */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-pitch px-3 py-1 font-mono text-[11px] font-semibold uppercase text-chalk">
                              <Clock className="h-3 w-3 text-volt" />
                              {game.dateLabel} · {game.timeLabel}
                            </span>
                            <span className="rounded-full border border-line bg-pitch/70 px-2.5 py-1 font-mono text-[11px] font-bold text-volt">
                              {game.format}
                            </span>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                              game.skill === "Women's Only"
                                ? "bg-volt/15 text-volt"
                                : game.skill === "Competitive"
                                ? "bg-flare/15 text-flare"
                                : "border border-line bg-pitch/60 text-mute"
                            }`}
                          >
                            {game.skill}
                          </span>
                        </div>

                        {/* Title & Location */}
                        <div className="mt-5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-mute">
                              {game.zone} · {game.durationMins} MINS
                            </span>
                            {game.featured && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-volt">
                                <Sparkles className="h-3 w-3" /> Popular
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 font-display text-3xl uppercase leading-none tracking-tight text-chalk transition-colors group-hover:text-volt">
                            {game.title}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-mute">
                            <MapPin className="h-4 w-4 shrink-0 text-volt" />
                            <span className="truncate">{game.venue}</span>
                          </p>
                        </div>

                        {/* Visual Seat/Pitch Slot Pips */}
                        <div className="mt-5 rounded-2xl border border-line bg-pitch/75 p-3.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-mute">
                              <Users className="h-3.5 w-3.5 text-chalk" />
                              <span className="font-mono"><strong className="text-chalk">{game.filled}</strong>/{game.capacity}</span> on pitch
                            </span>
                            <span
                              className={`font-mono text-[11px] font-bold uppercase ${
                                isFull ? "text-flare" : isUrgent ? "text-flare" : "text-volt"
                              }`}
                            >
                              {isFull ? "FULL · WAITLIST" : isUrgent ? `ONLY ${spotsLeft} LEFT` : `${spotsLeft} SPOTS OPEN`}
                            </span>
                          </div>
                          <div
                            className="mt-2.5 grid gap-1"
                            style={{ gridTemplateColumns: `repeat(${game.capacity}, minmax(0, 1fr))` }}
                            aria-hidden
                          >
                            {Array.from({ length: game.capacity }).map((_, idx) => {
                              const filled = idx < game.filled;
                              return (
                                <span
                                  key={idx}
                                  className={`h-2 rounded-full transition-colors ${
                                    filled
                                      ? isFull
                                        ? "bg-flare/80"
                                        : "bg-volt"
                                      : "border border-line bg-turf"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Amenities & Host */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {game.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="rounded-md bg-pitch/80 px-2 py-1 text-[11px] text-mute">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Footer: Roster Preview + Price + Action */}
                      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-2">
                            {game.roster.slice(0, 4).map((p, idx) => (
                              <span
                                key={`${p.initials}-${idx}`}
                                title={`${p.name} (${p.pos})`}
                                className={`flex h-7 w-7 items-center justify-center rounded-full border border-pitch font-mono text-[10px] font-bold ${
                                  p.team === "Volt" ? "bg-volt text-pitch" : "bg-chalk text-pitch"
                                }`}
                              >
                                {p.initials}
                              </span>
                            ))}
                          </div>
                          <div className="leading-tight">
                            <p className="flex items-center gap-1 text-[11px] text-mute">
                              <ShieldCheck className="h-3 w-3 text-volt" /> {game.hostName}
                            </p>
                            <p className="font-mono text-base font-bold text-chalk">
                              ₹{game.price} <span className="text-[11px] font-normal text-mute">/ slot</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openBooking(game.id)}
                          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                            isFull
                              ? "border border-flare/50 bg-flare/15 text-flare hover:bg-flare hover:text-pitch"
                              : "bg-volt text-pitch hover:bg-chalk"
                          }`}
                        >
                          {isFull ? "Waitlist" : "Book Spot"}
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Compact Schedule List View */
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-turf/50">
            {filtered.map((game) => {
              const spotsLeft = Math.max(0, game.capacity - game.filled);
              const isFull = spotsLeft === 0;
              return (
                <div
                  key={game.id}
                  className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-turf sm:flex-row sm:items-center"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-32 shrink-0">
                      <p className="font-mono text-xs font-bold uppercase text-volt">{game.dateLabel}</p>
                      <p className="font-display text-2xl text-chalk">{game.timeLabel}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-2xl uppercase text-chalk">{game.title}</h3>
                        <span className="rounded-full border border-line bg-pitch px-2.5 py-0.5 font-mono text-[11px] text-volt">
                          {game.format}
                        </span>
                        <span className="rounded-full bg-pitch px-2.5 py-0.5 text-[11px] text-mute">{game.skill}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-mute">
                        <MapPin className="h-3.5 w-3.5 text-volt" /> {game.venue} · {game.zone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="text-right">
                      <p className={`font-mono text-xs font-bold ${isFull ? "text-flare" : "text-volt"}`}>
                        {isFull ? "FULL" : `${spotsLeft} of ${game.capacity} open`}
                      </p>
                      <p className="font-mono text-base font-bold text-chalk">₹{game.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openBooking(game.id)}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider ${
                        isFull
                          ? "border border-flare/40 bg-flare/15 text-flare hover:bg-flare hover:text-pitch"
                          : "bg-volt text-pitch hover:bg-chalk"
                      }`}
                    >
                      {isFull ? "Waitlist" : "Claim"} <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
