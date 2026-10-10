"use client";

import { ArrowUpRight, Info, UserRoundCheck } from "lucide-react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { calculate, DELIVERY_NAME, type Delivery, type Engine } from "@/lib/calc";
import { COUNTRY_SHORT, FUEL_NAME, type CountryCode } from "@/lib/data";
import { fmt, rub } from "@/lib/format";
import { Select } from "./Select";
import { DemoBadge, Reveal, SectionHead } from "./ui";

const YEARS = Array.from({ length: 12 }, (_, i) => String(2026 - i));
const SHOWCASE: Record<CountryCode, { slug: string; name: string }> = {
  KR: { slug: "palisade", name: "Hyundai Palisade" },
  JP: { slug: "rx", name: "Lexus RX 450h+" },
  CN: { slug: "zeekr", name: "Zeekr 001" },
};
const COLORS = [
  "var(--accent)",
  "color-mix(in srgb, var(--accent) 55%, var(--ink))",
  "color-mix(in srgb, var(--ink) 70%, transparent)",
  "color-mix(in srgb, var(--ink) 48%, transparent)",
  "color-mix(in srgb, var(--ink) 28%, transparent)",
];

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className="pill"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Counts smoothly to the new value instead of jumping. */
function useCountTo(target: number) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(target);
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (reduce) {
      mv.set(target);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(target);
      return;
    }
    const c = animate(mv, target, { duration: 0.7, ease: [0.2, 0, 0, 1], onUpdate: (v) => setShown(v) });
    return () => c.stop();
  }, [target, reduce, mv]);
  return shown;
}

export function Calculator() {
  const [country, setCountry] = useState<CountryCode>("KR");
  const [price, setPrice] = useState("2500000");
  const [delivery, setDelivery] = useState<Delivery>("sea");
  // Эти параметры не меняют сумму: нужны менеджеру для расчёта таможни и уходят в заявку.
  const [year, setYear] = useState("2022");
  const [engine, setEngine] = useState<Engine>("petrol");
  const [volume, setVolume] = useState("2000");

  const priceNum = +price || 0;
  const { parts, total } = useMemo(
    () => calculate({ country, price: priceNum, delivery }),
    [country, priceNum, delivery],
  );
  const shown = useCountTo(priceNum ? total : 0);

  const request = () =>
    window.dispatchEvent(
      new CustomEvent<string>("lead-prefill", {
        detail:
          `Расчёт: ${COUNTRY_SHORT[country]}, автомобиль за ${rub(priceNum)}, ${year} г., ` +
          `${FUEL_NAME[engine].toLowerCase()}${engine === "electric" ? "" : `, ${volume} см³`}, ` +
          `доставка ${DELIVERY_NAME[delivery].toLowerCase()}. Без таможни ориентир ${rub(total)}.`,
      }),
    );

  return (
    <section id="calc" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-20">
      <SectionHead
        title="Сколько это стоит"
        lead="Считаем всё, что не зависит от законов. Таможню менеджер посчитает по действующим ставкам, а итоговая цена фиксируется в договоре."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Reveal className="flex flex-col rounded-[28px] border border-line bg-surface p-6 sm:p-8">
          <div className="grid gap-7">
            <Segmented
              label="Страна покупки"
              value={country}
              onChange={setCountry}
              options={(["KR", "CN", "JP"] as const).map((c) => ({ value: c, label: COUNTRY_SHORT[c] }))}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-price" className="label">
                  Стоимость автомобиля
                </label>
                <div className="field">
                  <input
                    id="c-price"
                    inputMode="numeric"
                    value={price ? fmt(+price) : ""}
                    onChange={(e) => setPrice(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="0"
                  />
                  <span className="text-ink-3">₽</span>
                </div>
                <p className="hint">Цена в стране покупки, в рублях</p>
              </div>
              <Segmented
                label="Доставка"
                value={delivery}
                onChange={setDelivery}
                options={(["sea", "rail", "truck"] as const).map((d) => ({ value: d, label: DELIVERY_NAME[d] }))}
              />
            </div>

            <div className="border-t border-line pt-7">
              <p className="text-[15px] font-bold text-ink">Для расчёта таможни</p>
              <p className="mt-1 max-w-[58ch] text-[13.5px] leading-relaxed text-ink-3">
                Эти параметры не меняют сумму справа: таможню считает менеджер. Они уйдут в заявку, чтобы он назвал точную
                цену.
              </p>
              <div className="mt-5 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <span className="label">Год выпуска</span>
                    <Select
                      aria-label="Год выпуска"
                      value={year}
                      onChange={setYear}
                      options={YEARS.map((y) => ({ value: y, label: y }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-vol" className="label">
                      Объём двигателя
                    </label>
                    <div className="field" data-disabled={engine === "electric"}>
                      <input
                        id="c-vol"
                        inputMode="numeric"
                        disabled={engine === "electric"}
                        value={engine === "electric" ? "—" : volume}
                        onChange={(e) => setVolume(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      />
                      <span className="text-[13px] text-ink-3">см³</span>
                    </div>
                  </div>
                </div>
                <Segmented
                  label="Тип двигателя"
                  value={engine}
                  onChange={setEngine}
                  options={(["petrol", "diesel", "hybrid", "electric"] as const).map((e) => ({ value: e, label: FUEL_NAME[e] }))}
                />
              </div>
            </div>
          </div>

          <div className="stage mt-8 min-h-[190px] flex-1 rounded-[20px] border border-line" aria-hidden>
            <AnimatePresence mode="wait">
              <motion.div
                key={country}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
                className="absolute inset-0"
              >
                <Image
                  className="car !bottom-[16%] !w-[62%]"
                  src={`/cars/${SHOWCASE[country].slug}.webp`}
                  alt=""
                  width={1400}
                  height={800}
                />
              </motion.div>
            </AnimatePresence>
            <p className="absolute bottom-3 left-4 z-10 text-[12px] font-semibold text-ink-3">
              {SHOWCASE[country].name} · пример из каталога
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass overflow-hidden rounded-[28px] !bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-bold text-ink-2">Итого без таможни, ориентировочно</p>
              <DemoBadge>Демо</DemoBadge>
            </div>
            <p className="num mt-3 text-[clamp(34px,4.2vw,54px)] leading-none text-ink" aria-live="polite">
              {priceNum ? rub(shown) : "—"}
            </p>
            <p className="mt-2 text-[13px] text-ink-3">
              {country} → RU · {DELIVERY_NAME[delivery].toLowerCase()} · плюс таможня
            </p>

            <div className="mt-6 flex h-2.5 gap-[3px] overflow-hidden rounded-full" aria-hidden>
              {parts
                .filter((p) => p.value !== null)
                .map((p, i) => (
                  <div
                    key={p.key}
                    className="h-full rounded-[2px] transition-[flex-grow] duration-700 ease-out"
                    style={{ flexGrow: Math.max(p.value ?? 0, 0.0001), flexBasis: 0, background: COLORS[i] }}
                  />
                ))}
            </div>

            <ul className="mt-5 divide-y divide-line">
              {parts.map((p, i) => (
                <li key={p.key} className="flex items-start justify-between gap-4 py-3">
                  <span className="flex items-start gap-3">
                    <span
                      className={`mt-[7px] size-2.5 shrink-0 rounded-[3px] ${p.value === null ? "border border-dashed border-ink-3" : ""}`}
                      style={p.value === null ? undefined : { background: COLORS[i] }}
                    />
                    <span>
                      <span className="block text-[14.5px] font-bold text-ink">{p.label}</span>
                      <span className="block text-[12px] text-ink-3">{p.note}</span>
                    </span>
                  </span>
                  {p.value === null ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap text-accent-ink">
                      <UserRoundCheck className="size-4" strokeWidth={1.75} />
                      менеджер
                    </span>
                  ) : (
                    <span className="text-[14.5px] font-bold whitespace-nowrap text-ink">{rub(p.value)}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-3 rounded-2xl bg-warn-soft p-4 text-[12.5px] leading-relaxed text-ink-2">
              <Info className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={1.75} />
              <p>
                Пошлина, таможенный сбор и утилизационный сбор устанавливает государство, и они меняются. Поэтому мы не
                показываем их приблизительно, а считаем по действующим ставкам на дату сделки. Суммы выше — примеры.
              </p>
            </div>

            <a href="#contact" onClick={request} className="btn btn-primary mt-5 w-full">
              Получить точный расчёт
              <ArrowUpRight className="size-[18px]" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
