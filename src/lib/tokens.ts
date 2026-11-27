// Single source of truth for the WEFOOTBALLIN' design system.
export const colors = {
  pitch: "#080b09",      // near-black green: base
  turf: "#101a13",       // raised surface
  turfLight: "#16241a",  // elevated hover surface
  line: "#1f2d23",       // hairlines / pitch markings
  volt: "#C6FF3D",       // the one electric accent
  voltDim: "#8fb82a",    // volt pressed
  chalk: "#F2EEE3",      // warm off-white text
  mute: "#9aa597",       // secondary text
  flare: "#FF5A36",      // status only: Full / Cancelled / Miss
} as const;

export const fontSize = {
  mega: "clamp(3.15rem, 7.6vw, 7.25rem)",
  display: "clamp(2.25rem, 5.2vw, 4.75rem)",
  h2: "clamp(1.75rem, 3.2vw, 3.25rem)",
  lead: "clamp(1rem, 1.3vw, 1.25rem)",
} as const;

export const spacing = {
  section: "clamp(4rem, 7.5vw, 7rem)",
  gutter: "clamp(1.25rem, 4vw, 4rem)",
} as const;

// Every reveal, hover and drawer uses this curve.
export const ease = {
  expo: [0.22, 1, 0.36, 1] as [number, number, number, number],
  css: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export const duration = { fast: 0.25, base: 0.6, slow: 1.1 };
