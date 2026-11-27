"use client";

import { useMemo, useState } from "react";
import { Check, Video, Droplets, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Roll } from "@/components/ui/Roll";
import type { CityZone, MatchFormat } from "@/lib/data";

const FORMAT_META: Record<MatchFormat, { players: number; basePerHr: number }> = {
  "5v5": { players: 10, basePerHr: 2800 },
  "6v6": { players: 12, basePerHr: 3200 },
  "7v7": { players: 14, basePerHr: 3900 },
  "9v9": { players: 18, basePerHr: 5200 },
};

const ZONES: CityZone[] = ["South Delhi", "Gurgaon", "Noida", "West Delhi"];

export function HostGameSection() {
  const { notify } = useApp();
  const [format, setFormat] = useState<MatchFormat>("7v7");
  const [duration, setDuration] = useState<60 | 90 | 120>(90);
  const [zone, setZone] = useState<CityZone>("South Delhi");
  const [addons, setAddons] = useState<{ film: boolean; ref: boolean; drinks: boolean }>({
    film: true,
    ref: false,
    drinks: true,
  });
  const [captainContact, setCaptainContact] = useState("");

  const { totalCost, perPlayer, players } = useMemo(() => {
    const meta = FORMAT_META[format];
    const turf = Math.round(meta.basePerHr * (duration / 60));
    const extras = (addons.film ? 600 : 0) + (addons.ref ? 500 : 0) + (addons.drinks ? 350 : 0);
    const total = turf + extras;
    return {
      totalCost: total,
      perPlayer: Math.round(total / meta.players),
      players: meta.players,
    };
  }, [format, duration, addons]);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captainContact.trim()) return;
    notify(
      "Turf Proposal Locked!",
      `Our ops lead will message ${captainContact} with 3 open ${format} floodlit slots in ${zone}.`
    );
    setCaptainContact("");
  };

  return (
    <section
      id="host"
      className="relative scroll-mt-24 border-t border-line bg-pitch px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,7.5vw,7rem)]"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Copy */}
        <div className="lg:col-span-5">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-volt">
            <Sparkles className="h-3.5 w-3.5" /> Private Bookings &amp; Turf Hosting
          </p>
          <h2 className="font-display text-display uppercase leading-[0.88]">
            Got a crew?<br />
            <span className="text-volt">We handle the rest.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mute">
            Skip calling 6 turf managers and chasing UPI splits. Pick your format, zone, and pro add-ons—we lock the turf, bring bibs &amp; match balls, and even fill your last 2-3 missing spots from our community pool.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-chalk">
            {[
              "Auto-split payment links so captains never front ₹5,000 alone",
              "Instant community fill if your squad is 2–4 players short",
              "Verified FIFA Pro turfs with guaranteed floodlights & parking",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-volt text-pitch">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Interactive Match Configurator */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleRequest}
            className="rounded-3xl border border-chalk/15 bg-turf/80 p-6 shadow-2xl md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-5">
              <span className="font-display text-2xl uppercase text-chalk">Custom Kickoff Builder</span>
              <span className="rounded-full bg-pitch px-3 py-1 font-mono text-xs text-volt">
                {players} Players Total
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {/* Format & Duration */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-mute">
                    Match Format
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(FORMAT_META) as MatchFormat[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFormat(f)}
                        className={`h-11 rounded-xl font-mono text-xs font-bold transition-colors ${
                          format === f
                            ? "bg-volt text-pitch"
                            : "border border-line bg-pitch text-mute hover:text-chalk"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-mute">
                    Pitch Duration
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {([60, 90, 120] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`h-11 rounded-xl font-mono text-xs font-bold transition-colors ${
                          duration === d
                            ? "bg-volt text-pitch"
                            : "border border-line bg-pitch text-mute hover:text-chalk"
                        }`}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zone */}
              <div>
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-mute">
                  Preferred Delhi NCR Hub
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ZONES.map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZone(z)}
                      className={`h-10 rounded-xl text-xs font-medium transition-colors ${
                        zone === z
                          ? "border border-volt bg-volt/15 font-bold text-volt"
                          : "border border-line bg-pitch text-mute hover:text-chalk"
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-mute">
                  Matchday Upgrades
                </span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setAddons((a) => ({ ...a, film: !a.film }))}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-left text-xs transition-colors ${
                      addons.film ? "border-volt bg-volt/10 text-chalk" : "border-line bg-pitch text-mute"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Video className="h-4 w-4 text-volt" /> 4K Highlights
                    </span>
                    <span className="font-mono text-[10px] text-volt">+₹600</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddons((a) => ({ ...a, ref: !a.ref }))}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-left text-xs transition-colors ${
                      addons.ref ? "border-volt bg-volt/10 text-chalk" : "border-line bg-pitch text-mute"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-volt" aria-hidden>
                        <path d="M5 10a7 7 0 1 0 14 0H5Z" />
                        <path d="M12 3v7" />
                      </svg>
                      Referee
                    </span>
                    <span className="font-mono text-[10px] text-volt">+₹500</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddons((a) => ({ ...a, drinks: !a.drinks }))}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-left text-xs transition-colors ${
                      addons.drinks ? "border-volt bg-volt/10 text-chalk" : "border-line bg-pitch text-mute"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Droplets className="h-4 w-4 text-volt" /> Hydration
                    </span>
                    <span className="font-mono text-[10px] text-volt">+₹350</span>
                  </button>
                </div>
              </div>

              {/* Live Cost Estimate & Submit */}
              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-pitch p-5 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                    Estimated Split Per Player
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-4xl text-volt">
                      ₹<Roll value={perPlayer} pad={3} />
                    </span>
                    <span className="font-mono text-xs text-mute">
                      / player · Total ₹{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 gap-2 sm:max-w-xs">
                  <input
                    type="text"
                    required
                    value={captainContact}
                    onChange={(e) => setCaptainContact(e.target.value)}
                    placeholder="Captain WhatsApp"
                    aria-label="Captain WhatsApp number"
                    className="h-11 w-full rounded-full border border-line bg-turf px-4 text-xs text-chalk placeholder:text-mute focus:border-volt focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Request turf slot"
                    className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-volt px-5 text-xs font-bold uppercase text-pitch hover:bg-chalk"
                  >
                    Book <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
