"use client";

import { motion, useReducedMotion } from "motion/react";

/** Two bars skewed −34°: the brand "vector" motif. */
export function Vector({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden
      width={size * 1.15}
      height={size}
      viewBox="0 0 23 20"
      className={className}
      fill="currentColor"
    >
      <path d="M7 20 13 0h3.8L10.8 20z" />
      <path d="M13.4 20l6-16h3.6l-6 16z" opacity=".78" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Vector className="text-accent" size={20} />
      <span className="font-display text-[17px] font-semibold tracking-[0.04em] text-ink">LI MOTORS</span>
    </span>
  );
}

/** Section heading: small index mark on the left, headline from column 3. */
export function SectionHead({
  index,
  label,
  title,
  lead,
  aside,
  stacked,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? "flex flex-col gap-5" : "grid gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,10fr)]"}>
      <Reveal className={`flex items-center gap-2.5 self-start text-[13px] font-semibold text-accent-ink ${stacked ? "" : "pt-2 lg:pt-4"}`}>
        <Vector size={12} />
        <span className="tabular-nums">{index}</span>
        <span className="text-ink-3">/</span>
        <span>{label}</span>
      </Reveal>
      <div className="flex flex-col gap-5">
        <Reveal delay={0.05}>
          <h2 className="h2 max-w-[20ch]">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.1}>
            <p className="lead">{lead}</p>
          </Reveal>
        )}
        {aside}
      </div>
    </div>
  );
}

/** Fade + short rise when scrolled into view. Disabled for reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </Comp>
  );
}

export function DemoBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-full bg-warn-soft px-3 text-[12px] font-bold text-warn">
      <span className="size-1.5 rounded-full bg-warn" />
      {children}
    </span>
  );
}
