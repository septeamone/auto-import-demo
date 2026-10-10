import type { CountryCode } from "./data";

export type Delivery = "sea" | "rail" | "truck";
export type Engine = "petrol" | "diesel" | "hybrid" | "electric";

export type CalcInput = {
  country: CountryCode;
  price: number;
  year: number;
  volume: number;
  engine: Engine;
  delivery: Delivery;
};

export const DELIVERY_NAME: Record<Delivery, string> = {
  sea: "Морем",
  rail: "Ж/Д",
  truck: "Автовоз",
};

const SHIPPING: Record<CountryCode, Record<Delivery, number>> = {
  KR: { sea: 180000, rail: 240000, truck: 260000 },
  CN: { sea: 220000, rail: 170000, truck: 150000 },
  JP: { sea: 160000, rail: 230000, truck: 250000 },
};

const DELIVERY_NOTE: Record<Delivery, string> = {
  sea: "морем",
  rail: "по железной дороге",
  truck: "автовозом",
};

// Иллюстративный расчёт: коэффициенты условные, это не официальные ставки.
export function calculate(i: CalcInput) {
  const age = 2026 - (i.year || 2026);
  const local = i.price * 0.03 + 45000;
  const shipping = SHIPPING[i.country][i.delivery];
  const rate = age < 3 ? 0.48 : age <= 5 ? 0.38 : 0.55;
  const volumeFactor = i.volume <= 1500 ? 0.85 : i.volume <= 2500 ? 1 : 1.25;
  let customs = i.price * rate * volumeFactor;
  if (i.engine === "electric") customs = i.price * 0.18;
  else if (i.engine === "hybrid") customs *= 0.95;

  const parts = [
    { key: "car", label: "Стоимость автомобиля", note: "Цена в стране покупки", value: i.price },
    { key: "local", label: "Расходы в стране покупки", note: "Пример: 3% + фиксированная часть", value: local },
    { key: "ship", label: "Доставка до России", note: `Пример тарифа: ${DELIVERY_NOTE[i.delivery]}`, value: shipping },
    { key: "customs", label: "Таможенные платежи", note: "Условный коэффициент, не официальная ставка", value: customs },
    { key: "fees", label: "Оформление и сборы", note: "Фиксированная сумма для примера", value: 35000 },
    { key: "service", label: "Услуги агентства", note: "Пример", value: 80000 },
  ];
  const total = parts.reduce((s, p) => s + p.value, 0);
  return { parts, total, age };
}
