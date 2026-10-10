"use client";

import { ArrowUpRight, Clock, Ship } from "lucide-react";
import Image from "next/image";
import { CARS, COUNTRIES, COUNTRY_NAME, type CountryCode } from "@/lib/data";
import { plural } from "@/lib/format";
import { Reveal, SectionHead } from "./ui";

export function Countries() {
  const pick = (code: CountryCode) =>
    window.dispatchEvent(new CustomEvent<CountryCode>("catalog-country", { detail: code }));

  return (
    <section id="countries" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-20">
      <SectionHead
        index="01"
        label="Рынки"
        title="Три рынка, один процесс."
        lead="Выберите страну, с которой хотите начать. Порядок проверки, расчёта и сопровождения одинаков для каждого направления."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
        {COUNTRIES.map((c, i) => {
          const n = CARS.filter((x) => x.country === c.code).length;
          return (
            <Reveal key={c.code} delay={i * 0.08}>
              <article className="group relative flex aspect-[3/4] min-h-[460px] flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-surface">
                <Image
                  src={c.photo}
                  alt={`${c.city} — ${COUNTRY_NAME[c.code]}`}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="photo object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,12,0.55)_0%,rgba(6,8,12,0.05)_32%,rgba(6,8,12,0.35)_58%,rgba(6,8,12,0.92)_100%)]"
                />

                <div className="relative z-10 flex items-start justify-between p-6 text-white">
                  <span className="font-display text-[clamp(56px,6vw,88px)] leading-none font-medium tracking-[-0.04em]">
                    {c.code}
                  </span>
                  <span className="mt-2 text-right text-[12px] leading-snug font-semibold text-white/75">
                    {c.city}
                    <br />
                    <span className="tabular-nums">{c.coords}</span>
                  </span>
                </div>

                <div className="glass relative z-10 m-3 rounded-[22px] p-5 text-white [--glass-bg:rgba(14,18,26,0.38)] [--glass-edge:rgba(255,255,255,0.16)] [--glass-hi:rgba(255,255,255,0.3)] [--glass-lo:rgba(0,0,0,0.4)]">
                  <h3 className="font-display text-[22px] font-medium tracking-tight">{COUNTRY_NAME[c.code]}</h3>
                  <p className="mt-1 text-[13px] font-bold text-white/70">{c.lead}</p>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mt-3 text-[14px] leading-relaxed text-white/80">{c.text}</p>
                      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-[12.5px]">
                        <div>
                          <dt className="flex items-center gap-1.5 font-semibold text-white/60">
                            <Clock className="size-3.5" strokeWidth={1.75} /> Срок в пути
                          </dt>
                          <dd className="mt-1 font-bold tabular-nums">{c.days}</dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 font-semibold text-white/60">
                            <Ship className="size-3.5" strokeWidth={1.75} /> Маршрут
                          </dt>
                          <dd className="mt-1 font-bold">{c.port}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <a
                    href="#catalog"
                    onClick={() => pick(c.code)}
                    className="mt-4 flex h-12 items-center justify-between rounded-full bg-white/12 px-5 text-[14px] font-bold transition-colors hover:bg-white/22"
                  >
                    <span>Смотреть автомобили</span>
                    <span className="flex items-center gap-2 font-semibold text-white/70">
                      {n} {plural(n, ["пример", "примера", "примеров"])}
                      <ArrowUpRight className="size-4" strokeWidth={2} />
                    </span>
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-5 text-[12.5px] text-ink-3">Сроки указаны ориентировочно и уточняются в расчёте под вашу сделку.</p>
    </section>
  );
}
