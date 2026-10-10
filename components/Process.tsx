"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { STEPS, TIMELINE } from "@/lib/data";
import { Reveal, SectionHead } from "./ui";
import { asset } from "@/lib/asset";

export function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-42% 0px -48% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="border-t border-line bg-bg-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[var(--page)] px-5 sm:px-8 lg:px-12 xl:px-20">
        <SectionHead title="Как проходит сделка" lead="Шесть этапов от заявки до передачи ключей. Прокрутите, чтобы увидеть, что происходит на каждом." />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* sticky stage */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] max-h-[640px] overflow-hidden rounded-[28px] border border-line">
                <Image fetchPriority="low"
                  src={asset("/photos/hero-ship.webp")}
                  alt="Автомобилевоз в порту"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,12,0.5),rgba(6,8,12,0.05)_45%,rgba(6,8,12,0.55))]" />
                <div className="absolute inset-x-0 top-0 p-4">
                  <div className="glass rounded-[22px] p-6 text-white [--glass-bg:rgba(14,18,26,0.42)] [--glass-edge:rgba(255,255,255,0.16)] [--glass-hi:rgba(255,255,255,0.3)] [--glass-lo:rgba(0,0,0,0.4)]">
                    <p className="text-[13px] font-semibold text-white/65">Этап</p>
                    <div className="flex items-end gap-4">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={active}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -14 }}
                          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
                          className="num text-[72px] leading-[0.9]"
                        >
                          {String(active + 1).padStart(2, "0")}
                        </motion.span>
                      </AnimatePresence>
                      <span className="num pb-1 text-[20px] text-white/50">/ 06</span>
                    </div>
                    <p className="font-display mt-3 text-[22px] tracking-tight">{STEPS[active].title}</p>
                    <div className="mt-5 flex gap-1.5" aria-hidden>
                      {STEPS.map((_, i) => (
                        <span
                          key={i}
                          className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                          style={{ background: i <= active ? "var(--accent)" : "rgba(255,255,255,0.22)" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* route line + steps */}
          <ol className="relative">
            <span aria-hidden className="absolute top-3 bottom-3 left-[4px] w-px bg-line-strong" />
            <motion.span
              aria-hidden
              className="absolute top-3 left-[4px] w-px origin-top bg-accent"
              animate={{ height: `${(active / (STEPS.length - 1)) * 100}%` }}
              style={{ maxHeight: "calc(100% - 24px)" }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            />
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative pb-14 pl-10 last:pb-0 lg:pb-24 lg:last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute top-2 left-0 size-[9px] border transition-colors duration-500"
                  style={{
                    background: i <= active ? "var(--accent)" : "var(--bg-2)",
                    borderColor: i <= active ? "var(--accent)" : "var(--line-strong)",
                  }}
                />
                <Reveal>
                  <p
                    aria-hidden
                    className="num text-[clamp(60px,7.4vw,112px)] leading-none transition-colors duration-500"
                    style={{
                      color: i <= active ? "var(--accent)" : "transparent",
                      WebkitTextStroke: i <= active ? "0" : "1px var(--line-strong)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <span className="sr-only">Этап {i + 1}</span>
                  <h3
                    className="font-display mt-2 text-[clamp(24px,2.6vw,34px)] leading-tight tracking-tight transition-colors duration-500"
                    style={{ color: i === active ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* typical timeline */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="rounded-[28px] border border-line bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[20px] tracking-tight text-ink">Как это выглядит по времени</p>
              <p className="text-[12.5px] text-ink-3">Ориентировочный график, точный — в вашем расчёте</p>
            </div>
            <ol className="mt-7 grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
              {TIMELINE.map((t, i) => (
                <li key={t.label} className="relative pr-4">
                  <span aria-hidden className="mb-3 block h-px w-full bg-line-strong">
                    <span className="-mt-[4px] block size-[9px] bg-accent" />
                  </span>
                  <p className="text-[14.5px] font-bold text-ink">{t.label}</p>
                  <p className="num mt-0.5 text-[12.5px] text-ink-3">{t.day}</p>
                  <span className="sr-only">Шаг {i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
