// Single source of truth for the WEFOOTBALLIN' design system (Tunnel Crimson).
export const colors = {
  pitch: "#09090B",      // carbon asphalt base
  turf: "#141418",       // matte charcoal slate surface
  turfLight: "#1D1E24",  // elevated hover surface
  line: "#262730",       // hairlines / pitch markings
  volt: "#FF463A",       // Tunnel Crimson primary accent
  voltDim: "#D9352A",    // crimson pressed
  chalk: "#F7F5F0",      // warm off-white text
  mute: "#9396A3",       // secondary text
  flare: "#FBBF24",      // status only: Full / Waitlist / Card alert
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
