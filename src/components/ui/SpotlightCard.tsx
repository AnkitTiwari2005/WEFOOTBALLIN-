"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
}

/**
 * Interactive floodlight-lit card surface: tracks cursor position with GPU-light
 * radial spotlight and subtle border sheen. Disabled gracefully on touch/reduced motion.
 */
export function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(255, 70, 58, 0.14)",
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  const onPointerLeave = () => {
    setPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-turf/70 transition-colors duration-300 hover:border-volt/35 ${className}`}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
