export type CountryCode = "KR" | "JP" | "CN";
export type Fuel = "petrol" | "diesel" | "hybrid" | "electric";

export const COUNTRY_NAME: Record<CountryCode, string> = {
  KR: "Южная Корея",
  JP: "Япония",
  CN: "Китай",
};
export const COUNTRY_SHORT: Record<CountryCode, string> = {
  KR: "Корея",
  JP: "Япония",
  CN: "Китай",
};
export const FUEL_NAME: Record<Fuel, string> = {
  petrol: "Бензин",
  diesel: "Дизель",
  hybrid: "Гибрид",
  electric: "Электро",
};

export type Car = {
  slug: string;
  country: CountryCode;
  brand: string;
  model: string;
  body: string;
  year: number;
  mileage: number;
  engine: string;
  volume: number;
  fuel: Fuel;
  trans: string;
  price: number;
};

// Демонстрационные данные: реальные предложения формируются под заявку.
export const CARS: Car[] = [
  { slug: "palisade", country: "KR", brand: "Hyundai", model: "Palisade", body: "Кроссовер", year: 2025, mileage: 8400, engine: "2.5 л · 281 л.с.", volume: 2497, fuel: "petrol", trans: "Автомат", price: 7150000 },
  { slug: "tucson", country: "KR", brand: "Hyundai", model: "Tucson Hybrid", body: "Кроссовер", year: 2022, mileage: 41200, engine: "1.6 л · 230 л.с.", volume: 1598, fuel: "hybrid", trans: "Автомат", price: 3150000 },
  { slug: "santafe", country: "KR", brand: "Hyundai", model: "Santa Fe", body: "Кроссовер", year: 2024, mileage: 12900, engine: "2.5 л · 281 л.с.", volume: 2497, fuel: "petrol", trans: "Автомат", price: 5380000 },
  { slug: "sorento", country: "KR", brand: "Kia", model: "Sorento Hybrid", body: "Кроссовер", year: 2022, mileage: 24100, engine: "1.6 л · 230 л.с.", volume: 1598, fuel: "hybrid", trans: "Автомат", price: 3980000 },
  { slug: "prado", country: "JP", brand: "Toyota", model: "Land Cruiser Prado", body: "Внедорожник", year: 2024, mileage: 6200, engine: "2.8 л · 204 л.с.", volume: 2755, fuel: "diesel", trans: "Автомат", price: 8450000 },
  { slug: "rx", country: "JP", brand: "Lexus", model: "RX 450h+", body: "Кроссовер", year: 2023, mileage: 15700, engine: "2.5 л · 304 л.с.", volume: 2487, fuel: "hybrid", trans: "Вариатор", price: 6950000 },
  { slug: "alphard", country: "JP", brand: "Toyota", model: "Alphard", body: "Минивэн", year: 2023, mileage: 14800, engine: "2.5 л · 250 л.с.", volume: 2487, fuel: "hybrid", trans: "Вариатор", price: 7480000 },
  { slug: "vezel", country: "JP", brand: "Honda", model: "Vezel e:HEV", body: "Кроссовер", year: 2022, mileage: 24500, engine: "1.5 л · 131 л.с.", volume: 1496, fuel: "hybrid", trans: "Вариатор", price: 2340000 },
  { slug: "cx5", country: "JP", brand: "Mazda", model: "CX-5", body: "Кроссовер", year: 2021, mileage: 39700, engine: "2.5 л · 190 л.с.", volume: 2488, fuel: "petrol", trans: "Автомат", price: 2860000 },
  { slug: "zeekr", country: "CN", brand: "Zeekr", model: "001", body: "Лифтбек", year: 2023, mileage: 12300, engine: "Электро · 544 л.с.", volume: 0, fuel: "electric", trans: "Редуктор", price: 4780000 },
  { slug: "monjaro", country: "CN", brand: "Geely", model: "Monjaro", body: "Кроссовер", year: 2023, mileage: 15900, engine: "2.0 л · 238 л.с.", volume: 1969, fuel: "petrol", trans: "Автомат", price: 3640000 },
  { slug: "song", country: "CN", brand: "BYD", model: "Song Plus DM-i", body: "Кроссовер", year: 2023, mileage: 9800, engine: "1.5 л · 218 л.с.", volume: 1498, fuel: "hybrid", trans: "Вариатор", price: 2980000 },
];

export const BRANDS = [...new Set(CARS.map((c) => c.brand))].sort();

export const COUNTRIES: {
  code: CountryCode;
  city: string;
  coords: string;
  photo: string;
  lead: string;
  text: string;
  days: string;
  port: string;
}[] = [
  {
    code: "KR",
    city: "Сеул",
    coords: "37.5665° N · 126.9780° E",
    photo: "/photos/city-kr.webp",
    lead: "Hyundai, Kia, Genesis",
    text: "Подбираем автомобили на внутреннем рынке Кореи. Проверяем историю обслуживания и состояние до покупки.",
    days: "18–25 дней",
    port: "Пусан → Владивосток",
  },
  {
    code: "JP",
    city: "Токио",
    coords: "35.6762° N · 139.6503° E",
    photo: "/photos/city-jp.webp",
    lead: "Toyota, Lexus, Honda, Mazda",
    text: "Автомобили с внутреннего рынка Японии. Изучаем аукционные листы и независимую оценку состояния.",
    days: "20–28 дней",
    port: "Иокогама → Владивосток",
  },
  {
    code: "CN",
    city: "Шанхай",
    coords: "31.2304° N · 121.4737° E",
    photo: "/photos/city-cn.webp",
    lead: "Zeekr, Geely, BYD",
    text: "Электромобили и гибриды китайских марок. Сверяем комплектацию и документы с продавцом.",
    days: "15–25 дней",
    port: "Шанхай → Владивосток",
  },
];

export const STEPS = [
  { title: "Заявка", text: "Вы описываете задачу: модель, бюджет, сроки, обязательные опции. Мы уточняем детали и фиксируем требования." },
  { title: "Подбор автомобиля", text: "Ищем варианты на рынках Кореи, Китая и Японии и присылаем подборку с расчётом стоимости по каждому." },
  { title: "Проверка", text: "Изучаем историю, организуем осмотр, присылаем фото- и видеоотчёт. Решение о покупке принимаете вы." },
  { title: "Покупка", text: "Выкупаем автомобиль по согласованной цене и готовим документы для экспорта." },
  { title: "Доставка", text: "Организуем перевозку и таможенное оформление. Сообщаем о смене статуса на каждом этапе пути." },
  { title: "Передача клиенту", text: "Передаём автомобиль и полный комплект документов в согласованном месте." },
];

export const SERVICES = [
  { icon: "search-check", title: "Проверка истории автомобиля", text: "Сверяем пробег, историю обслуживания и записи о ДТП по доступным источникам до того, как вы примете решение." },
  { icon: "camera", title: "Фото- и видеоотчёты", text: "Показываем кузов, салон, подкапотное пространство и ходовую часть. Без ретуши и выбора удачных ракурсов." },
  { icon: "calculator", title: "Прозрачный расчёт стоимости", text: "Каждая статья расходов указана отдельно: цена автомобиля, доставка, оформление и наши услуги." },
  { icon: "file-check-2", title: "Сопровождение сделки", text: "Один менеджер ведёт сделку от заявки до передачи автомобиля и отвечает на вопросы на каждом этапе." },
  { icon: "route", title: "Контроль доставки", text: "Сообщаем о каждом изменении статуса: выкуп, отправка, прибытие в порт, таможня, выдача." },
];

export const FAQ = [
  { q: "Из чего складывается итоговая цена?", a: "Из стоимости автомобиля в стране покупки, расходов на месте, доставки, таможенных платежей, оформления и услуг агентства. Каждая статья указывается отдельно и фиксируется в договоре до оплаты." },
  { q: "Можно ли увидеть автомобиль до покупки?", a: "Да. Мы присылаем подробный фото- и видеоотчёт, проверяем историю и состояние. Решение о покупке принимаете вы, после того как увидели всё, что знаем мы." },
  { q: "Сколько занимает путь до России?", a: "В среднем от 15 до 28 дней в зависимости от страны и способа доставки. Точный срок называем в расчёте и сообщаем о каждом изменении статуса." },
  { q: "Как проходит оплата?", a: "Оплата разбита на этапы сделки и привязана к конкретным результатам: выкуп, отправка, таможенное оформление. Порядок и суммы прописываются в договоре." },
  { q: "Что если автомобиль окажется не таким, как в описании?", a: "Именно поэтому до выкупа мы проверяем историю и состояние и показываем всё без ретуши. Условия на случай расхождений фиксируются в договоре заранее." },
  { q: "Можно ли заказать автомобиль, которого нет в каталоге?", a: "Да, каталог — лишь примеры. Опишите модель, бюджет и пожелания, и мы подберём варианты под вашу задачу." },
];

export const TIMELINE = [
  { label: "Заявка", day: "День 0" },
  { label: "Подбор", day: "Дни 1–4" },
  { label: "Выкуп", day: "Дни 5–9" },
  { label: "Порт", day: "Дни 10–12" },
  { label: "Море", day: "Дни 13–25" },
  { label: "Таможня", day: "Дни 26–30" },
];
