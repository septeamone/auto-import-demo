"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Real glass refraction (backdrop-filter: url()) only works in Chromium.
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } })
      .userAgentData?.brands;
    if (brands?.some((b) => b.brand === "Chromium")) {
      document.documentElement.classList.add("refract");
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -88 } });
    return () => lenis.destroy();
  }, []);

  return (
    <>
      {/* Displacement map used by .glass-refract */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="34" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {children}
    </>
  );
}
