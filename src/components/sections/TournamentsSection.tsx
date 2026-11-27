"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, MapPin, Award, ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import { TOURNAMENTS } from "@/lib/data";
import { useApp } from "@/components/AppProvider";
import { ease } from "@/lib/tokens";

export function TournamentsSection() {
  const { notify } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);
  const [squadModalOpen, setSquadModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const active = TOURNAMENTS[activeIdx];

  const submitTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !captainPhone.trim()) return;
    notify(
      `Squad Inquiry Sent: ${teamName}`,
      `League commissioner will WhatsApp ${captainPhone} for ${active.name}.`
    );
    setTeamName("");
    setCaptainPhone("");
    setSquadModalOpen(false);
  };

  return (
    <section
      id="tournaments"
      className="relative scroll-mt-24 border-t border-line bg-pitch px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,7.5vw,7rem)]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-volt">
              <Trophy className="h-3.5 w-3.5" /> Leagues &amp; Floodlight Cups
            </p>
            <h2 className="font-display text-display uppercase leading-[0.88]">
              Play for silver.<br />
              <span className="text-volt">Own the night.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-mute">
            Organized leagues with 4K match recordings, live standings, Golden Boot races, and official referees across South Delhi, Gurgaon &amp; Noida.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Selector Column */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {TOURNAMENTS.map((item, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveIdx(idx);
                    setSquadModalOpen(false);
                  }}
                  className={`group relative rounded-2xl border p-5 text-left transition-all ${
                    isSelected
                      ? "border-volt bg-turf shadow-[0_12px_40px_rgba(198,255,61,0.08)]"
                      : "border-line bg-pitch/60 hover:border-chalk/30 hover:bg-turf/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-mute">
                      {item.season} · {item.zone}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        item.status === "Registration Open" || item.status === "Entries Closing"
                          ? "bg-volt/15 text-volt"
                          : "bg-chalk/10 text-chalk"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3
                    className={`mt-2 font-display text-2xl uppercase tracking-wide transition-colors md:text-3xl ${
                      isSelected ? "text-volt" : "text-chalk group-hover:text-volt"
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-mute">{item.tagline}</p>
                </button>
              );
            })}
          </div>

          {/* Right Editorial Matchday Dossier */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: ease.expo }}
                className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-chalk/15 bg-turf/80 p-6 md:p-8"
              >
                <div>
                  {/* Top Info Row */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-volt">
                        {active.format}
                      </span>
                      <h3 className="mt-1 font-display text-4xl uppercase leading-none text-chalk md:text-5xl">
                        {active.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-mute">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-volt" /> {active.venue}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-volt" /> {active.dates}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-volt" /> {active.teamsCount} Teams
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-volt/30 bg-pitch px-4 py-3 text-right">
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-mute">
                        Prize Pool
                      </span>
                      <span className="font-display text-3xl text-volt">{active.prizePool}</span>
                    </div>
                  </div>

                  {/* Standings & Golden Boot Grid */}
                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-12">
                    <div className="rounded-2xl border border-line bg-pitch/70 p-4 md:col-span-7">
                      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
                        <span>League Table Preview</span>
                        <span>PTS</span>
                      </div>
                      <div className="space-y-2.5">
                        {active.standings.map((row) => (
                          <div
                            key={row.pos}
                            className="flex items-center justify-between rounded-xl bg-turf/60 px-3 py-2 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`font-mono font-bold ${
                                  row.pos === 1 ? "text-volt" : "text-mute"
                                }`}
                              >
                                0{row.pos}
                              </span>
                              <span className="font-medium text-chalk">{row.team}</span>
                            </div>
                            <div className="flex items-center gap-4 font-mono">
                              <span className="text-mute">GD {row.gd}</span>
                              <span className="font-bold text-volt">{row.pts}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:col-span-5">
                      <div className="rounded-2xl border border-line bg-pitch/70 p-4">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-volt">
                          <Award className="h-3.5 w-3.5" /> Golden Boot Leader
                        </span>
                        <p className="mt-2 font-display text-2xl uppercase text-chalk">
                          {active.topScorer.name}
                        </p>
                        <p className="text-xs text-mute">
                          {active.topScorer.team} ·{" "}
                          <strong className="font-mono text-volt">{active.topScorer.goals} Goals</strong>
                        </p>
                      </div>

                      <div className="flex-1 rounded-2xl border border-line bg-pitch/70 p-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                          {active.highlightStat.label}
                        </span>
                        <p className="mt-1 font-display text-4xl text-volt">{active.highlightStat.value}</p>
                        <ul className="mt-3 space-y-1.5">
                          {active.perks.slice(0, 3).map((p) => (
                            <li key={p} className="flex items-center gap-1.5 text-[11px] text-mute">
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-volt" /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action / Quick Squad Inquiry */}
                <div className="mt-6 border-t border-line pt-6">
                  {squadModalOpen ? (
                    <form onSubmit={submitTeam} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Squad / Company Name"
                        className="h-11 flex-1 rounded-full border border-line bg-pitch px-4 text-sm text-chalk focus:border-volt focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        value={captainPhone}
                        onChange={(e) => setCaptainPhone(e.target.value)}
                        placeholder="Captain WhatsApp"
                        className="h-11 flex-1 rounded-full border border-line bg-pitch px-4 text-sm text-chalk focus:border-volt focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="h-11 shrink-0 rounded-full bg-volt px-6 text-xs font-bold uppercase text-pitch hover:bg-chalk"
                      >
                        Send Entry
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs text-mute">
                        Don&apos;t have a full squad? Free agents can enter solo draft pools.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSquadModalOpen(true)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-volt px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-pitch transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        Register Squad / Free Agent <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
