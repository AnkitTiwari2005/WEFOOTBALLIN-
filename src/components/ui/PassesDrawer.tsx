"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Ticket, MapPin, Calendar, Trash2, ArrowRight } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { ease } from "@/lib/tokens";

export function PassesDrawer() {
  const { isPassesOpen, closePasses, passes, cancelPass } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPassesOpen) closePasses();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPassesOpen, closePasses]);

  return (
    <AnimatePresence>
      {isPassesOpen && (
        <div className="fixed inset-0 z-[115] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePasses}
            className="fixed inset-0 bg-pitch/80 backdrop-blur-md"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="My match passes"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: ease.expo }}
            className="relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-line bg-pitch shadow-2xl"
          >
            <div className="shrink-0 flex items-center justify-between border-b border-line bg-pitch/95 px-6 py-4 backdrop-blur-xl">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-volt">
                  Player Wallet
                </span>
                <h2 className="font-display text-2xl uppercase text-chalk">
                  My Match Passes ({passes.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={closePasses}
                aria-label="Close passes drawer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-turf text-chalk hover:border-volt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div data-lenis-prevent className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6">
              {passes.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-turf/40 p-10 text-center">
                  <Ticket className="h-10 w-10 text-volt opacity-70" />
                  <h3 className="mt-4 font-display text-2xl uppercase text-chalk">No Active Passes Yet</h3>
                  <p className="mt-2 text-xs leading-relaxed text-mute">
                    Book a pickup game in Delhi NCR and your QR stadium pass will appear right here.
                  </p>
                  <a
                    href="#games"
                    onClick={closePasses}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-volt px-5 py-2.5 text-xs font-bold uppercase text-pitch"
                  >
                    Browse Matches <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                passes.map((pass) => (
                  <div
                    key={pass.id}
                    className="overflow-hidden rounded-2xl border border-chalk/15 bg-turf shadow-lg"
                  >
                    <div className="border-b border-dashed border-line p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-volt">{pass.ticketCode}</span>
                        <span className="rounded-full bg-pitch px-2.5 py-0.5 font-mono text-[10px] text-chalk">
                          {pass.format} · {pass.position}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl uppercase text-chalk">{pass.gameTitle}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-mute">
                        <MapPin className="h-3.5 w-3.5 text-volt" /> {pass.venue}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-mute">
                        <Calendar className="h-3.5 w-3.5 text-volt" /> {pass.dateLabel} · {pass.timeLabel}
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-pitch/60 px-4 py-3 text-xs">
                      <span className="font-mono text-mute">
                        {pass.playerName} · {pass.spots} slot{pass.spots > 1 ? "s" : ""} · ₹{pass.totalPaid}
                      </span>
                      <button
                        type="button"
                        onClick={() => cancelPass(pass.id)}
                        className="inline-flex items-center gap-1 text-flare hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Release
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
