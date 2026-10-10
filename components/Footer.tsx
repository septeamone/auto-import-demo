"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import credits from "@/lib/credits.json";
import { CARS } from "@/lib/data";
import { Wordmark } from "./ui";

const NAV = [
  ["catalog", "Автомобили"],
  ["calc", "Расчёт"],
  ["process", "Как мы работаем"],
  ["services", "Услуги"],
  ["faq", "Вопросы"],
  ["contact", "Контакты"],
];

const NAMES: Record<string, string> = {
  "city-jp": "Токио (карточка «Япония»)",
  "city-cn": "Шанхай (карточка «Китай»)",
  "city-kr": "Сеул (карточка «Корея»)",
  "hero-ship": "Автомобилевоз (блок «Этапы»)",
  ...Object.fromEntries(CARS.map((c) => [c.slug, `${c.brand} ${c.model}`])),
};

type Credit = { file: string; lic: string; artist: string; page: string };

export function Footer() {
  const rows = Object.entries(credits as Record<string, Credit>);
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="mx-auto max-w-[var(--page)] px-5 py-16 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,2fr))]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-[32ch] text-[14.5px] leading-relaxed text-ink-2">
              Подбор, проверка и доставка автомобилей из Кореи, Китая и Японии.
            </p>
            <p className="font-display mt-4 text-[12px] tracking-[0.02em] text-ink-3">KR · CN · JP → RU</p>
          </div>
          <nav aria-label="Разделы сайта">
            <p className="text-[13px] font-bold text-ink-3">Навигация</p>
            <ul className="mt-4 grid gap-3">
              {NAV.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-[15px] font-semibold text-ink transition-colors hover:text-accent-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[13px] font-bold text-ink-3">Контакты</p>
            <ul className="mt-4 grid gap-4 text-[15px]">
              {[
                ["Телефон", "+7 (000) 000-00-00"],
                ["Эл. почта", "hello@вашбренд.рф"],
                ["Офис", "Владивосток, ул. Портовая, 1"],
              ].map(([k, v]) => (
                <li key={k}>
                  <span className="block font-semibold text-ink">{k}</span>
                  <span className="block text-[13.5px] text-ink-3">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink-3">Соцсети</p>
            <ul className="mt-4 grid gap-3 text-[15px]">
              {[
                ["Telegram", "@yourbrand"],
                ["WhatsApp", "+7 000 000-00-00"],
                ["ВКонтакте", "vk.com/yourbrand"],
              ].map(([s, h]) => (
                <li key={s} className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-ink">{s}</span>
                  <span className="text-[12.5px] text-ink-3">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-[12.5px] text-ink-3 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[60ch] space-y-1.5">
            <p>© 2026 Ваш бренд. Здесь будут ваши юридические данные и реквизиты.</p>
            <p>Пример сайта. Автомобили, цены и расчёты — демонстрационные, под ваш бизнес всё заменим.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Политика конфиденциальности</span>
            <span>Пользовательское соглашение</span>
            <Dialog.Root>
              <Dialog.Trigger className="cursor-pointer font-semibold underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink">
                Источники фото
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
                <Dialog.Content className="glass fixed top-1/2 left-1/2 z-[81] max-h-[86svh] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] !bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-6 outline-none sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="font-display text-[24px] tracking-tight text-ink">Источники фото</Dialog.Title>
                      <Dialog.Description className="mt-2 max-w-[56ch] text-[14px] leading-relaxed text-ink-2">
                        Иллюстрации взяты из открытых материалов Wikimedia Commons, обработаны (вырезка фона, цветокоррекция) и
                        показывают модели в качестве примера. В рабочей версии их заменят фотографии реальных автомобилей.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close aria-label="Закрыть" className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 hover:text-ink">
                      <X className="size-[18px]" strokeWidth={1.75} />
                    </Dialog.Close>
                  </div>
                  <ul className="mt-6 divide-y divide-line">
                    {rows.map(([slug, c]) => (
                      <li key={slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-[13.5px]">
                        <span className="font-bold text-ink">{NAMES[slug] ?? slug}</span>
                        <a
                          href={c.page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-accent-ink"
                        >
                          {c.artist || "Автор не указан"} · {c.lic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </footer>
  );
}
