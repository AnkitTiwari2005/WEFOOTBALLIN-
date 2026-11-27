# WEFOOTBALLIN' redesign (Phase 1)

Phase 1 ships the design system, hero, marquee and penalty game. Games, registration, host-a-game, tournaments, community, footer and admin come next.

## Run
    npm install
    npm run dev      # http://localhost:3000   (design system at /design)

## Structure
- `src/lib/tokens.ts`: colours, type scale, spacing, easing (feeds Tailwind)
- `src/components/sections/`: Hero, Marquee, PenaltyGame
- `src/components/ui/`: Magnetic, Roll (number roll), SmoothScroll (Lenis)

## Placeholder media (replace)
- `public/placeholder/pitch.mp4` and `pitch-poster.jpg` (hero video + poster)

## Env (used from Phase 2)
See `.env.example`.
