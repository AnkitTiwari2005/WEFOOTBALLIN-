import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { colors, fontSize } from "@/lib/tokens";

export const metadata = { title: "Design System | WEFOOTBALLIN'" };

export default function DesignSystem() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-turf px-4 py-2 text-xs font-medium text-chalk hover:border-volt hover:text-volt"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Pitch
      </Link>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-volt">WEFOOTBALLIN&apos; UI KIT</p>
      <h1 className="mt-2 font-display text-display uppercase">Design System</h1>
      <p className="mt-3 max-w-2xl text-base text-mute">
        Floodlit stadium dark aesthetic built on near-black turf surfaces, crisp hairlines, warm chalk typography, and one electric volt accent.
      </p>

      <h2 className="mb-4 mt-16 font-display text-h2 uppercase">Colour Tokens</h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Object.entries(colors).map(([k, v]) => (
          <li key={k} className="overflow-hidden rounded-2xl border border-line bg-turf/60">
            <div className="h-24" style={{ background: v }} />
            <p className="p-3.5 text-sm">
              <b className="font-mono uppercase">{k}</b>
              <br />
              <span className="font-mono text-xs text-mute">{v}</span>
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mb-4 mt-16 font-display text-h2 uppercase">Typography Scale</h2>
      {Object.entries(fontSize).map(([k, v]) => (
        <p key={k} className="mb-4 border-b border-line pb-4">
          <span className="font-mono text-xs text-mute">
            {k} · {v}
          </span>
          <br />
          <span className={k === "lead" ? "text-lead" : `font-display uppercase text-${k}`}>
            Good football.
          </span>
        </p>
      ))}

      <h2 className="mb-4 mt-16 font-display text-h2 uppercase">Motion &amp; Controls</h2>
      <p className="text-lead text-mute">
        One expo curve everywhere: <code className="font-mono text-volt">cubic-bezier(0.22, 1, 0.36, 1)</code>. GPU transform and opacity only. Reduced motion swaps movement for crisp fades.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <span className="rounded-full bg-volt px-6 py-3 text-sm font-bold uppercase text-pitch">
          Primary Action
        </span>
        <span className="rounded-full border border-chalk/30 px-6 py-3 text-sm">Secondary</span>
        <span className="rounded-full bg-flare/15 px-4 py-2 font-mono text-xs font-bold uppercase text-flare">
          Full / Waitlist
        </span>
        <span className="relative inline-flex items-center rounded-full bg-volt/15 px-4 py-2 font-mono text-xs text-volt">
          <i className="mr-2 h-2 w-2 rounded-full bg-volt" />
          Registration open
        </span>
      </div>
    </main>
  );
}
