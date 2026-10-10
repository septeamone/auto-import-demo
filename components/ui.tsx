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
      <span className="font-display text-[17px] font-semibold tracking-[0.04em] text-ink">ВАШ БРЕНД</span>
    </span>
  );
}

/** Heading whose words rise out from under a mask, line by line. */
export function Lines({
  text,
  className,
  as = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ staggerChildren: reduce ? 0 : 0.045, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: reduce ? 0 : "108%" }, show: { y: 0 } }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Section heading: headline from column 3, lead beneath it. */
export function SectionHead({
  title,
  lead,
  stacked,
}: {
  title: string;
  lead?: React.ReactNode;
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? "" : "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,10fr)] lg:gap-x-8"}>
      <div className={stacked ? "flex flex-col gap-5" : "col-start-2 flex flex-col gap-5"}>
        <Lines text={title} className="h2 max-w-[20ch]" />
        {lead && (
          <Reveal delay={0.1}>
            <p className="lead">{lead}</p>
          </Reveal>
        )}
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
