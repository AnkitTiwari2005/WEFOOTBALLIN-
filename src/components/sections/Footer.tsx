"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useApp } from "@/components/AppProvider";

export function Footer() {
  const { openPasses, setCmdOpen } = useApp();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-pitch px-[clamp(1.25rem,4vw,4rem)] pt-16 pb-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl uppercase text-chalk">
              WEFOOTBALLIN&apos; <span className="text-volt">NCR</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
              Daily curated pickup football, floodlight leagues, and turf community across South Delhi, Gurgaon, Noida, and West Delhi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#games"
                className="inline-flex items-center gap-1.5 rounded-full bg-volt px-5 py-2.5 text-xs font-bold uppercase text-pitch hover:bg-chalk"
              >
                Book Next Match <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={openPasses}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-turf px-5 py-2.5 text-xs font-medium text-chalk hover:border-volt"
              >
                View My Passes
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-volt">Play</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mute">
              <li><a href="#games" className="hover:text-chalk">Pickup Games</a></li>
              <li><a href="#penalty" className="hover:text-chalk">Penalty Shootout</a></li>
              <li><a href="#tournaments" className="hover:text-chalk">Night Leagues</a></li>
              <li><a href="#host" className="hover:text-chalk">Host a Pitch</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-volt">NCR Hubs</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mute">
              <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-volt" /> Saket &amp; Siri Fort</li>
              <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-volt" /> DLF Phase 2 &amp; Phase 4</li>
              <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-volt" /> Chhatarpur &amp; Vasant Kunj</li>
              <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-volt" /> Noida Sec 104 &amp; Punjabi Bagh</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-volt">Platform</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mute">
              <li><Link href="/design" className="hover:text-chalk">Design System</Link></li>
              <li><button type="button" onClick={() => setCmdOpen(true)} className="hover:text-chalk">Search (⌘K)</button></li>
              <li><a href="#community" className="hover:text-chalk">Player Leaderboard</a></li>
              <li><span className="inline-flex items-center gap-1.5 text-volt"><span className="h-1.5 w-1.5 rounded-full bg-volt" /> All Pitches Dry</span></li>
            </ul>
          </div>
        </div>

        {/* Monumental Architectural Wordmark */}
        <div className="border-t border-line pt-6">
          <p
            aria-hidden
            className="select-none text-center font-display text-[clamp(2.5rem,13.2vw,13rem)] uppercase leading-[0.82] tracking-tight text-turfLight"
          >
            WEFOOTBALLIN&apos;
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-mute">
            <span>© 2026 WEFOOTBALLIN&apos; DELHI NCR. BUILT FOR GOOD FOOTBALL.</span>
            <span>SEASON 04 · FLOODLIT PICKUP &amp; LEAGUES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
