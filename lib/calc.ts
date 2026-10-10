import type { CountryCode } from "./data";

export type Delivery = "sea" | "rail" | "truck";
export type Engine = "petrol" | "diesel" | "hybrid" | "electric";

export type CalcInput = {
  country: CountryCode;
  price: number;
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

export type Part = { key: string; label: string; note: string; value: number | null };

/**
 * Считаем только то, что не зависит от законодательства.
 * Таможенные платежи (пошлина, таможенный сбор, утильсбор) устанавливает государство и они меняются,
 * поэтому их не считаем: value = null, итог их не включает, расчёт делает менеджер.
 * Суммы ниже — примеры для демонстрации.
 */
export function calculate(i: CalcInput) {
  const parts: Part[] = [
    { key: "car", label: "Стоимость автомобиля", note: "Цена в стране покупки", value: i.price },
    { key: "local", label: "Расходы в стране покупки", note: "3% от цены + фиксированная часть", value: i.price * 0.03 + 45000 },
    { key: "ship", label: "Доставка до России", note: `Доставка ${DELIVERY_NOTE[i.delivery]}`, value: SHIPPING[i.country][i.delivery] },
    { key: "docs", label: "Оформление и экспорт документов", note: "Фиксированная сумма", value: 35000 },
    { key: "service", label: "Услуги агентства", note: "Подбор, проверка и сопровождение сделки", value: 80000 },
    { key: "customs", label: "Таможенные платежи", note: "Устанавливает государство, меняются. Рассчитает менеджер", value: null },
  ];
  const total = parts.reduce((s, p) => s + (p.value ?? 0), 0);
  return { parts, total };
}
