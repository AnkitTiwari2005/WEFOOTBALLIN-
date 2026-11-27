"use client";

import { useMemo, useState } from "react";
import { Quote, Award, Shield, Star } from "lucide-react";
import { COMMUNITY_VOICES, LEADERBOARD } from "@/lib/data";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

type Metric = "goals" | "cleanSheets" | "appearances";

export function CommunitySection() {
  const [metric, setMetric] = useState<Metric>("goals");

  const sorted = useMemo(() => {
    return [...LEADERBOARD].sort((a, b) => b[metric] - a[metric]);
  }, [metric]);

  return (
    <section
      id="community"
      className="relative scroll-mt-24 border-t border-line bg-pitch px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,7.5vw,7rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-volt">
              <Award className="h-3.5 w-3.5" /> Delhi NCR Player Pulse
            </p>
            <h2 className="font-display text-display uppercase leading-[0.88]">
              2,400+ ballers.<br />
              <span className="text-volt">Zero egos.</span>
            </h2>
          </div>

          <div className="inline-flex rounded-full border border-line bg-turf p-1">
            {[
              { id: "goals" as const, label: "Top Scorers" },
              { id: "cleanSheets" as const, label: "Clean Sheets" },
              { id: "appearances" as const, label: "Ironmen" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMetric(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  metric === tab.id ? "bg-volt text-pitch" : "text-mute hover:text-chalk"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid: Leaderboard + Community Dispatches */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Season Leaderboard */}
          <SpotlightCard className="p-6 lg:col-span-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-volt">
                Season 04 · Live Standings
              </span>
              <span className="font-mono text-[11px] text-mute">Updated post-match</span>
            </div>

            <div className="space-y-2.5">
              {sorted.map((player, index) => {
                const value = player[metric];
                return (
                  <div
                    key={player.handle}
                    className="flex items-center justify-between rounded-2xl border border-line bg-pitch/70 px-4 py-3 transition-colors hover:border-volt/30"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-6 font-mono text-sm font-bold ${
                          index === 0 ? "text-volt" : "text-mute"
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-turf font-mono text-xs font-bold text-volt">
                        {player.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-chalk">{player.name}</p>
                        <p className="font-mono text-[11px] text-mute">
                          {player.pos} · {player.zone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="hidden items-center gap-1 rounded-full bg-turf px-2.5 py-1 font-mono text-[11px] text-chalk sm:inline-flex">
                        <Star className="h-3 w-3 text-volt" /> {player.rating}
                      </span>
                      <span className="min-w-12 text-right font-display text-2xl text-volt">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Community Voices & Code of the Pitch */}
          <div className="flex flex-col gap-5 lg:col-span-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {COMMUNITY_VOICES.map((voice) => (
                <SpotlightCard key={voice.author} className="p-5">
                  <Quote className="h-5 w-5 text-volt opacity-80" />
                  <p className="mt-2.5 text-sm leading-relaxed text-chalk">
                    &ldquo;{voice.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-mute">
                    <span className="font-semibold text-chalk">{voice.author}</span>
                    <span className="font-mono text-[11px]">{voice.role}</span>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* Code of the Pitch Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-volt/25 bg-volt/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-volt" />
                <span className="font-display text-xl uppercase text-chalk">
                  The Pitch Code: Play hard. Pass early. Respect every player.
                </span>
              </div>
              <span className="font-mono text-xs text-volt">4.9/5 AVG MATCH RATING</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
