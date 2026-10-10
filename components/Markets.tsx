"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { CARS, COUNTRIES, COUNTRY_NAME, type CountryCode } from "@/lib/data";
import { plural } from "@/lib/format";
import { Lines } from "./ui";
import { asset } from "@/lib/asset";

type Market = (typeof COUNTRIES)[number];

const pick = (code: CountryCode) =>
  window.dispatchEvent(new CustomEvent<CountryCode>("catalog-country", { detail: code }));

/** Brands of one country running endlessly, ending with "any other brand": the choice is wider than the list. */
function BrandRow({ brands, className = "" }: { brands: string[]; className?: string }) {
  const set = [...brands, ...brands, ...brands];
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center gap-[0.55em] pr-[0.55em]" aria-hidden>
      {set.map((b, i) => (
        <span key={`${b}-${i}`} className="flex items-center gap-[0.55em]">
          <span className="text-white/85">{b}</span>
          <span className="text-accent-ink">/</span>
        </span>
      ))}
      <span className="text-accent-ink">и любой другой бренд</span>
      <span className="text-accent-ink">/</span>
    </div>
  );
  return (
    <div
      role="img"
      aria-label={`Бренды: ${brands.join(", ")} и любой другой`}
      className={`overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`}
    >
      <div className="display flex w-max text-[clamp(32px,4.4vw,64px)] !leading-[1.1]" style={{ animation: "marquee 70s linear infinite" }}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

function Facts({ c }: { c: Market }) {
  const n = CARS.filter((x) => x.country === c.code).length;
  return (
    <>
      <p className="mt-3 text-[15px] font-bold text-white/70">{c.lead}</p>
      <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/85">{c.text}</p>
      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-[14px]">
        <div>
          <dt className="text-white/55">Срок в пути</dt>
          <dd className="mt-0.5 font-bold text-white">{c.days}</dd>
        </div>
        <div>
          <dt className="text-white/55">Маршрут</dt>
          <dd className="mt-0.5 font-bold text-white">{c.port}</dd>
        </div>
      </dl>
      <a
        href="#catalog"
        onClick={() => pick(c.code)}
        className="btn btn-primary mt-8 self-start"
      >
        Смотреть {n} {plural(n, ["автомобиль", "автомобиля", "автомобилей"])}
        <ArrowUpRight className="size-[18px]" strokeWidth={2} />
      </a>
    </>
  );
}

function Panel({ c, i, p }: { c: Market; i: number; p: MotionValue<number> }) {
  // the photo drifts slower than the panel: depth
  const shift = useTransform(p, [(i - 1) / 2, (i + 1) / 2], ["-9%", "9%"]);
  const codeX = useTransform(p, [(i - 1) / 2, (i + 1) / 2], ["14vw", "-14vw"]);
  return (
    <div className="relative h-full w-screen shrink-0 overflow-hidden">
      <motion.div style={{ x: shift }} className="absolute inset-y-0 -inset-x-[12%]">
        <Image fetchPriority="low"
          src={asset(c.photo)}
          alt={`${c.city}, ${COUNTRY_NAME[c.code]}`}
          fill
          sizes="120vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,9,14,0.88),rgba(6,9,14,0.45)_55%,rgba(6,9,14,0.25))]" />
      <motion.span
        aria-hidden
        style={{ x: codeX }}
        className="display pointer-events-none absolute right-[4vw] bottom-[-3vw] text-[clamp(220px,34vw,560px)] !leading-none text-white/[0.09]"
      >
        {c.code}
      </motion.span>
      <div className="relative mx-auto flex h-full max-w-[var(--page)] flex-col justify-end px-12 pb-[25svh] xl:px-20">
        <p className="text-[13px] font-semibold text-white/60">
          {c.city} · {c.coords}
        </p>
        <h3 className="display mt-3 text-[clamp(52px,7.4vw,120px)] text-white">{COUNTRY_NAME[c.code]}</h3>
        <Facts c={c} />
      </div>
      <BrandRow brands={c.brands} className="absolute inset-x-0 bottom-[9svh]" />
    </div>
  );
}

export function Markets() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(p, [0, 1], ["0%", "-66.6667%"]);
  const bar = useTransform(p, [0, 1], [0.0001, 1]);

  return (
    <section id="countries" ref={ref} className="relative">
      {/* wide screens: three scenes in a pinned horizontal scroll */}
      <div className="relative hidden h-[330svh] lg:block">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-[120px] z-10">
            <div className="mx-auto max-w-[var(--page)] px-12 xl:px-20">
              <Lines text="Откуда привозим" className="h2 text-white" />
            </div>
          </div>
          <motion.div style={{ x }} className="flex h-full w-[300vw] will-change-transform">
            {COUNTRIES.map((c, i) => (
              <Panel key={c.code} c={c} i={i} p={p} />
            ))}
          </motion.div>
          <div className="absolute inset-x-0 bottom-[6svh] z-10">
            <div className="mx-auto flex max-w-[var(--page)] items-center gap-5 px-12 xl:px-20">
              {COUNTRIES.map((c) => (
                <span key={c.code} className="text-[13px] font-semibold text-white/70">
                  {c.code}
                </span>
              ))}
              <span className="relative h-px flex-1 bg-white/25">
                <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-accent" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* phones and tablets: the same three scenes, one under another */}
      <div className="lg:hidden">
        <div className="px-5 pt-24 pb-10 sm:px-8">
          <Lines text="Откуда привозим" className="h2" />
        </div>
        {COUNTRIES.map((c) => (
          <div key={c.code} className="relative flex min-h-[88svh] items-end overflow-hidden">
            <Image fetchPriority="low" src={asset(c.photo)} alt={`${c.city}, ${COUNTRY_NAME[c.code]}`} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,14,0.5),rgba(6,9,14,0.3)_30%,rgba(6,9,14,0.9))]" />
            <div className="relative flex w-full flex-col px-5 pb-28 sm:px-8">
              <BrandRow brands={c.brands} className="-mx-5 mb-9 sm:-mx-8 [&>div]:!text-[clamp(26px,7vw,40px)]" />
              <p className="text-[13px] font-semibold text-white/60">
                {c.city} · {c.coords}
              </p>
              <h3 className="display mt-2 text-[clamp(44px,13vw,80px)] text-white">{COUNTRY_NAME[c.code]}</h3>
              <Facts c={c} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
