"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Fuel, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BRANDS,
  CARS,
  COUNTRY_NAME,
  COUNTRY_SHORT,
  FUEL_NAME,
  type Car,
  type CountryCode,
} from "@/lib/data";
import { fmt, km, plural, rub } from "@/lib/format";
import { Select } from "./Select";
import { DemoBadge, Reveal, SectionHead } from "./ui";

type Filters = {
  q: string;
  country: "all" | CountryCode;
  brand: string;
  model: string;
  priceFrom: string;
  priceTo: string;
  yearFrom: string;
  yearTo: string;
  mileage: string;
  fuel: string;
  trans: string;
  sort: string;
};

const F0: Filters = {
  q: "",
  country: "all",
  brand: "",
  model: "",
  priceFrom: "",
  priceTo: "",
  yearFrom: "",
  yearTo: "",
  mileage: "",
  fuel: "",
  trans: "",
  sort: "default",
};

const YEARS = Array.from({ length: 9 }, (_, i) => String(2026 - i));
const digits = (v: string) => v.replace(/\D/g, "").slice(0, 9);

const MILEAGE = [
  { value: "", label: "Любой" },
  { value: "10000", label: "до 10 000 км" },
  { value: "30000", label: "до 30 000 км" },
  { value: "50000", label: "до 50 000 км" },
];
const SORTS = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "year-desc", label: "Сначала новее" },
  { value: "mileage-asc", label: "Меньше пробег" },
];
const TRANS = ["Автомат", "Вариатор", "Редуктор"];

function apply(cars: Car[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const out = cars.filter((c) => {
    if (q && !`${c.brand} ${c.model} ${c.engine} ${c.body}`.toLowerCase().includes(q)) return false;
    if (f.country !== "all" && c.country !== f.country) return false;
    if (f.brand && c.brand !== f.brand) return false;
    if (f.model && c.model !== f.model) return false;
    if (f.priceFrom && c.price < +f.priceFrom) return false;
    if (f.priceTo && c.price > +f.priceTo) return false;
    if (f.yearFrom && c.year < +f.yearFrom) return false;
    if (f.yearTo && c.year > +f.yearTo) return false;
    if (f.mileage && c.mileage > +f.mileage) return false;
    if (f.fuel && c.fuel !== f.fuel) return false;
    if (f.trans && c.trans !== f.trans) return false;
    return true;
  });
  const s = f.sort;
  if (s === "price-asc") out.sort((a, b) => a.price - b.price);
  if (s === "price-desc") out.sort((a, b) => b.price - a.price);
  if (s === "year-desc") out.sort((a, b) => b.year - a.year);
  if (s === "mileage-asc") out.sort((a, b) => a.mileage - b.mileage);
  return out;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

export function Catalog() {
  const [f, setF] = useState<Filters>(F0);
  const [open, setOpen] = useState<Car | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setF((p) => {
      const n = { ...p, [k]: v };
      if (k === "brand") n.model = "";
      return n;
    });

  // "Смотреть автомобили" on a country card sets the country filter here.
  useEffect(() => {
    const h = (e: Event) => setF({ ...F0, country: (e as CustomEvent<CountryCode>).detail });
    window.addEventListener("catalog-country", h);
    return () => window.removeEventListener("catalog-country", h);
  }, []);

  const list = useMemo(() => apply(CARS, f), [f]);
  const models = useMemo(
    () => [...new Set(CARS.filter((c) => c.brand === f.brand).map((c) => c.model))].sort(),
    [f.brand],
  );
  const active = Object.entries(f).filter(([k, v]) => v !== F0[k as keyof Filters]).length;

  const filters = (
    <div className="grid gap-5">
      <Field label="Марка">
        <Select
          value={f.brand}
          onChange={(v) => set("brand", v)}
          options={[{ value: "", label: "Все марки" }, ...BRANDS.map((b) => ({ value: b, label: b }))]}
        />
      </Field>
      <Field label="Модель">
        <Select
          value={f.model}
          disabled={!f.brand}
          placeholder="Сначала выберите марку"
          onChange={(v) => set("model", v)}
          options={[{ value: "", label: "Все модели" }, ...models.map((m) => ({ value: m, label: m }))]}
        />
      </Field>
      <Field label="Цена, ₽">
        <div className="grid grid-cols-2 gap-2">
          <label className="field">
            <input
              inputMode="numeric"
              placeholder="от"
              value={f.priceFrom ? fmt(+f.priceFrom) : ""}
              onChange={(e) => set("priceFrom", digits(e.target.value))}
              aria-label="Цена от"
            />
          </label>
          <label className="field">
            <input
              inputMode="numeric"
              placeholder="до"
              value={f.priceTo ? fmt(+f.priceTo) : ""}
              onChange={(e) => set("priceTo", digits(e.target.value))}
              aria-label="Цена до"
            />
          </label>
        </div>
      </Field>
      <Field label="Год выпуска">
        <div className="grid grid-cols-2 gap-2">
          <Select
            aria-label="Год от"
            value={f.yearFrom}
            placeholder="от"
            onChange={(v) => set("yearFrom", v)}
            options={[{ value: "", label: "С любого" }, ...YEARS.map((y) => ({ value: y, label: `с ${y}` }))]}
          />
          <Select
            aria-label="Год до"
            value={f.yearTo}
            placeholder="до"
            onChange={(v) => set("yearTo", v)}
            options={[{ value: "", label: "По любой" }, ...YEARS.map((y) => ({ value: y, label: `по ${y}` }))]}
          />
        </div>
      </Field>
      <Field label="Пробег">
        <Select value={f.mileage} onChange={(v) => set("mileage", v)} options={MILEAGE} />
      </Field>
      <Field label="Тип топлива">
        <Select
          value={f.fuel}
          onChange={(v) => set("fuel", v)}
          options={[{ value: "", label: "Любой" }, ...Object.entries(FUEL_NAME).map(([value, label]) => ({ value, label }))]}
        />
      </Field>
      <Field label="Коробка передач">
        <Select
          value={f.trans}
          onChange={(v) => set("trans", v)}
          options={[{ value: "", label: "Любая" }, ...TRANS.map((t) => ({ value: t, label: t }))]}
        />
      </Field>
      <button
        type="button"
        onClick={() => setF({ ...F0, country: f.country, q: f.q, sort: f.sort })}
        className="flex h-11 items-center justify-center gap-2 rounded-full text-[14px] font-bold text-ink-3 transition-colors hover:text-ink"
      >
        <RotateCcw className="size-4" strokeWidth={1.75} />
        Сбросить фильтры
      </button>
    </div>
  );

  return (
    <section id="catalog" className="relative border-t border-line bg-bg-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <SectionHead
          title="Что можно привезти"
          lead={
            <>
              Примеры автомобилей, которые мы подбираем. Цены ориентировочные, итог с таможней считает менеджер.{" "}
              <DemoBadge>Данные демонстрационные.</DemoBadge>
            </>
          }
        />

        <Reveal className="mt-12 flex flex-col gap-3 lg:mt-16 lg:flex-row lg:items-center">
          <label className="field glass min-w-0 flex-1 !bg-[var(--glass-bg)]">
            <Search className="size-[18px] shrink-0 text-ink-3" strokeWidth={1.75} />
            <input
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Марка, модель или двигатель"
              aria-label="Поиск по каталогу"
            />
          </label>
          <div role="radiogroup" aria-label="Страна" className="flex flex-wrap gap-2">
            {(["all", "KR", "JP", "CN"] as const).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={f.country === c}
                onClick={() => set("country", c)}
                className="pill"
              >
                {c === "all" ? (
                  "Все страны"
                ) : (
                  <>
                    <span className="font-display mr-2 text-[11px] tracking-wide">{c}</span>
                    {COUNTRY_SHORT[c]}
                  </>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-10">
          {/* Filters */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="btn btn-ghost w-full lg:hidden"
            >
              <SlidersHorizontal className="size-[18px]" strokeWidth={1.75} />
              Фильтры{active ? ` · ${active}` : ""}
            </button>
            <div
              className={`${filtersOpen ? "mt-3 block" : "hidden"} rounded-[24px] border border-line bg-surface p-5 lg:mt-0 lg:block`}
            >
              <p className="mb-5 hidden text-[15px] font-bold text-ink lg:block">Фильтры</p>
              {filters}
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-[14px] font-semibold text-ink-3">
                Найдено{" "}
                <span className="font-display ml-1 text-[18px] text-ink">
                  {list.length} {plural(list.length, ["автомобиль", "автомобиля", "автомобилей"])}
                </span>
              </p>
              <div className="w-[190px] sm:w-[220px]">
                <Select aria-label="Сортировка" value={f.sort} onChange={(v) => set("sort", v)} options={SORTS} />
              </div>
            </div>

            {list.length === 0 ? (
              <div className="grid place-items-center rounded-[24px] border border-dashed border-line-strong px-6 py-20 text-center">
                <p className="font-display text-[22px] text-ink">Ничего не найдено</p>
                <p className="mt-2 max-w-[40ch] text-[15px] text-ink-2">
                  Расширьте условия поиска или опишите, что нужно, в заявке — мы подберём варианты под вас.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setF(F0)}>
                    Сбросить фильтры
                  </button>
                  <a href="#contact" className="btn btn-primary btn-sm">
                    Оставить заявку
                  </a>
                </div>
              </div>
            ) : (
              <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {list.map((c) => (
                    <motion.li
                      key={c.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                    >
                      <CarCard car={c} onOpen={() => setOpen(c)} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </div>
      </div>

      <CarDialog car={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function CarCard({ car, onOpen }: { car: Car; onOpen: () => void }) {
  return (
    <article className="card-hover group relative overflow-hidden rounded-[24px] border border-line bg-surface transition-[border-color,transform] duration-300 hover:border-line-strong">
      <div className="stage aspect-[4/3]">
        <Image
          className="car"
          src={`/cars/${car.slug}.webp`}
          alt={`${car.brand} ${car.model}`}
          width={1400}
          height={800}
          sizes="(min-width:1280px) 28vw, (min-width:640px) 45vw, 100vw"
        />
        <span className="glass absolute top-3 left-3 z-10 inline-flex h-8 items-center gap-2 rounded-full px-3 text-[12.5px] font-bold text-ink">
          <span className="font-display text-[10.5px] tracking-wide">{car.country}</span>
          {COUNTRY_SHORT[car.country]}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[12.5px] font-bold text-ink-3">{car.brand}</p>
        <h3 className="font-display mt-0.5 text-[20px] leading-tight tracking-tight text-ink">{car.model}</h3>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <dt className="text-ink-3">Год</dt>
            <dd className="mt-0.5 font-bold text-ink">{car.year}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Пробег</dt>
            <dd className="mt-0.5 font-bold text-ink">{km(car.mileage)}</dd>
          </div>
        </dl>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-2">
          <Fuel className="size-4 shrink-0 text-ink-3" strokeWidth={1.5} />
          {car.engine} · {car.trans}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[12px] text-ink-3">Ориентировочно</p>
            <p className="font-display text-[20px] leading-tight tracking-tight text-ink">{rub(car.price)}</p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Подробнее: ${car.brand} ${car.model}`}
            className="btn btn-ghost btn-sm after:absolute after:inset-0 after:content-['']"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}

function CarDialog({ car, onClose }: { car: Car | null; onClose: () => void }) {
  const ask = (c: Car) => {
    window.dispatchEvent(new CustomEvent<string>("lead-prefill", { detail: `${c.brand} ${c.model}, ${c.year} г.` }));
    onClose();
  };
  return (
    <Dialog.Root open={!!car} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm data-[state=open]:animate-[pop_240ms_ease-out]" />
        <Dialog.Content className="glass fixed top-1/2 left-1/2 z-[81] max-h-[92svh] w-[min(1040px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] !bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] outline-none data-[state=open]:animate-[pop_260ms_cubic-bezier(.2,0,0,1)]">
          {car && (
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="stage min-h-[260px] md:min-h-[520px]">
                <Image
                  className="car !bottom-[18%] !w-[92%]"
                  src={`/cars/${car.slug}.webp`}
                  alt={`${car.brand} ${car.model}`}
                  width={1400}
                  height={800}
                  sizes="(min-width:768px) 560px, 100vw"
                />
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-ink-3">
                      {car.brand} · {COUNTRY_NAME[car.country]}
                    </p>
                    <Dialog.Title className="font-display mt-1 text-[clamp(26px,3vw,36px)] leading-tight tracking-tight text-ink">
                      {car.model}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close
                    aria-label="Закрыть"
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink"
                  >
                    <X className="size-[18px]" strokeWidth={1.75} />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Характеристики и ориентировочная цена автомобиля</Dialog.Description>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
                  {[
                    ["Год выпуска", String(car.year)],
                    ["Пробег", km(car.mileage)],
                    ["Двигатель", car.engine],
                    ["Топливо", FUEL_NAME[car.fuel]],
                    ["Коробка", car.trans],
                    ["Кузов", car.body],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-line pb-3">
                      <dt className="text-[12.5px] text-ink-3">{k}</dt>
                      <dd className="mt-0.5 font-bold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 rounded-[20px] bg-accent-soft p-5">
                  <p className="text-[12.5px] font-semibold text-accent-ink">Ориентировочная цена «под ключ»</p>
                  <p className="num mt-1 text-[clamp(28px,3.2vw,38px)] text-ink">{rub(car.price)}</p>
                  <p className="mt-2 text-[12.5px] text-ink-2">
                    Точную стоимость, включая таможню, назовёт менеджер после проверки автомобиля.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="#contact" onClick={() => ask(car)} className="btn btn-primary flex-1">
                    Запросить этот автомобиль
                    <ArrowUpRight className="size-[18px]" strokeWidth={2} />
                  </a>
                  <a href="#calc" onClick={onClose} className="btn btn-ghost">
                    Рассчитать
                  </a>
                </div>
                <p className="mt-4 text-[12px] text-ink-3">Демонстрационные данные: это пример, а не действующее предложение.</p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
