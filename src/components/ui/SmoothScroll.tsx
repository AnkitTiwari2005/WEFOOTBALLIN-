"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useApp } from "@/components/AppProvider";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { isBookingOpen, isPassesOpen, isCmdOpen } = useApp();
  const lenisRef = useRef<Lenis | null>(null);
  const overlayOpen = isBookingOpen || isPassesOpen || isCmdOpen;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (overlayOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [overlayOpen]);

  return <>{children}</>;
}
