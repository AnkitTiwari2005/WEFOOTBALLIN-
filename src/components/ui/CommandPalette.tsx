"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight, MapPin, Ticket, Trophy, Target, PlusCircle, X } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { ease } from "@/lib/tokens";

export function CommandPalette() {
  const { isCmdOpen, setCmdOpen, games, openBooking, openPasses } = useApp();
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games.slice(0, 5);
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.venue.toLowerCase().includes(q) ||
        g.zone.toLowerCase().includes(q) ||
        g.format.toLowerCase().includes(q) ||
        g.skill.toLowerCase().includes(q)
    );
  }, [games, query]);

  const jumpTo = (selector: string) => {
    setCmdOpen(false);
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isCmdOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCmdOpen(false)}
            className="fixed inset-0 bg-pitch/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation and match finder"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: ease.expo }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-chalk/15 bg-turf shadow-[0_32px_90px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="h-5 w-5 text-volt" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Saket, Gurgaon, 7v7, Women's Only..."
                className="w-full bg-transparent text-base text-chalk placeholder:text-mute focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                aria-label="Close search"
                className="rounded-lg border border-line px-2 py-1 font-mono text-xs text-mute hover:text-chalk"
              >
                ESC
              </button>
            </div>

            <div data-lenis-prevent className="max-h-[60vh] overflow-y-auto overscroll-contain p-3">
              <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mute">
                Upcoming Kickoffs ({filteredGames.length})
              </p>

              <div className="space-y-1">
                {filteredGames.map((game) => {
                  const left = game.capacity - game.filled;
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => openBooking(game.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors hover:bg-pitch/80"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-chalk">{game.title}</span>
                          <span className="rounded-full border border-line bg-pitch px-2 py-0.5 font-mono text-[10px] text-volt">
                            {game.format}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-mute">
                          <MapPin className="h-3 w-3 text-mute" />
                          {game.venue} · {game.dateLabel}, {game.timeLabel}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`font-mono text-xs ${
                            left === 0 ? "text-flare" : left <= 3 ? "text-volt" : "text-mute"
                          }`}
                        >
                          {left === 0 ? "FULL" : `${left} left`}
                        </span>
                        <span className="font-mono text-sm font-semibold text-chalk">₹{game.price}</span>
                        <ArrowRight className="h-4 w-4 text-volt" />
                      </div>
                    </button>
                  );
                })}
                {filteredGames.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-mute">
                    No pitches matched &ldquo;{query}&rdquo;. Try Saket, Gurgaon, or 5v5.
                  </p>
                )}
              </div>

              <div className="mt-3 border-t border-line pt-3">
                <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mute">
                  Quick Jumps
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => jumpTo("#penalty")}
                    className="flex items-center gap-2 rounded-xl border border-line bg-pitch/60 px-3 py-2.5 text-xs text-chalk hover:border-volt/40"
                  >
                    <Target className="h-4 w-4 text-volt" /> Penalty Box
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpTo("#tournaments")}
                    className="flex items-center gap-2 rounded-xl border border-line bg-pitch/60 px-3 py-2.5 text-xs text-chalk hover:border-volt/40"
                  >
                    <Trophy className="h-4 w-4 text-volt" /> Tournaments
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpTo("#host")}
                    className="flex items-center gap-2 rounded-xl border border-line bg-pitch/60 px-3 py-2.5 text-xs text-chalk hover:border-volt/40"
                  >
                    <PlusCircle className="h-4 w-4 text-volt" /> Host a Game
                  </button>
                  <button
                    type="button"
                    onClick={openPasses}
                    className="flex items-center gap-2 rounded-xl border border-line bg-pitch/60 px-3 py-2.5 text-xs text-chalk hover:border-volt/40"
                  >
                    <Ticket className="h-4 w-4 text-volt" /> My Passes
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line bg-pitch/60 px-5 py-2.5 font-mono text-[11px] text-mute">
              <span>WEFOOTBALLIN&apos; MATCH FINDER</span>
              <button type="button" onClick={() => setCmdOpen(false)} className="inline-flex items-center gap-1 hover:text-chalk">
                <X className="h-3 w-3" /> Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
