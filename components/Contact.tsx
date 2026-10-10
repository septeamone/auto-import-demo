"use client";

import { ArrowUpRight, CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COUNTRY_NAME } from "@/lib/data";
import { Select } from "./Select";
import { Reveal, SectionHead } from "./ui";

type Form = { name: string; contact: string; country: string; budget: string; message: string; consent: boolean };
const F0: Form = { name: "", contact: "", country: "", budget: "", message: "", consent: false };

const BUDGETS = [
  { value: "", label: "Не определён" },
  { value: "до 2 млн ₽", label: "до 2 млн ₽" },
  { value: "2–3 млн ₽", label: "2–3 млн ₽" },
  { value: "3–5 млн ₽", label: "3–5 млн ₽" },
  { value: "5–8 млн ₽", label: "5–8 млн ₽" },
  { value: "от 8 млн ₽", label: "от 8 млн ₽" },
];
const COUNTRIES = [
  ...(["KR", "JP", "CN"] as const).map((c) => ({ value: c, label: COUNTRY_NAME[c] })),
  { value: "any", label: "Не важно, подскажите" },
];

const NEXT = [
  ["Связываемся", "Уточняем задачу, бюджет и сроки."],
  ["Готовим подборку", "Варианты с проверкой и расчётом стоимости по каждому."],
  ["Решаете вы", "Выкупаем автомобиль только после вашего согласия."],
];

function validate(f: Form) {
  const er: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) er.name = "Укажите имя";
  const c = f.contact.trim();
  if (!c) er.contact = "Укажите телефон или эл. почту";
  else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) || c.replace(/\D/g, "").length >= 10))
    er.contact = "Проверьте формат: +7 900 000-00-00 или name@mail.ru";
  if (!f.country) er.country = "Выберите страну";
  if (!f.consent) er.consent = "Нужно согласие на обработку данных";
  return er;
}

export function Contact() {
  const [f, setF] = useState<Form>(F0);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Car cards and the calculator can pre-fill the message.
  useEffect(() => {
    const h = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setStatus("idle");
      setF((p) => ({ ...p, message: text }));
    };
    window.addEventListener("lead-prefill", h);
    return () => {
      window.removeEventListener("lead-prefill", h);
      clearTimeout(timer.current);
    };
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er = validate(f);
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("loading");
    // Demo: nothing is sent anywhere yet.
    timer.current = setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-24 lg:py-32">
      <div aria-hidden className="absolute -bottom-1/3 left-1/2 -z-10 h-[80%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_22%,transparent),transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHead
              stacked
              title="Расскажите, какую машину ищете"
              lead="Опишите задачу, и мы подготовим подборку вариантов и предварительный расчёт."
            />
            <Reveal delay={0.1} className="mt-10">
              <ol className="grid gap-5 border-t border-line pt-8">
                {NEXT.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="num mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-[12px] text-accent-ink">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[15.5px] font-bold text-ink">{t}</span>
                      <span className="block text-[14px] text-ink-2">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="btn btn-ghost btn-sm cursor-default opacity-70" title="Ссылка появится">
                  <Send className="size-4" strokeWidth={1.75} /> Telegram
                </span>
                <span className="btn btn-ghost btn-sm cursor-default opacity-70" title="Ссылка появится">
                  <MessageCircle className="size-4" strokeWidth={1.75} /> WhatsApp
                </span>
              </div>
              <p className="mt-3 text-[12.5px] text-ink-3">Ссылки на мессенджеры появятся после запуска.</p>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <div className="glass overflow-hidden rounded-[28px] !bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-6 sm:p-9">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid place-items-center py-14 text-center"
                    role="status"
                  >
                    <CheckCircle2 className="size-14 text-[var(--ok)]" strokeWidth={1.25} />
                    <p className="font-display mt-6 text-[26px] tracking-tight text-ink">Заявка принята</p>
                    <p className="mt-3 max-w-[40ch] text-[15px] text-ink-2">
                      Это демонстрационная форма: данные никуда не отправлялись. В рабочей версии менеджер свяжется с вами
                      и уточнит детали.
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm mt-8"
                      onClick={() => {
                        setF(F0);
                        setStatus("idle");
                      }}
                    >
                      Отправить ещё одну
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="f-name" className="label">
                          Имя
                        </label>
                        <div className="field" data-invalid={!!errors.name}>
                          <input
                            id="f-name"
                            autoComplete="name"
                            value={f.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Как к вам обращаться"
                            aria-invalid={!!errors.name}
                          />
                        </div>
                        {errors.name && <p className="mt-2 text-[12.5px] text-[#ef5b5b]">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="f-contact" className="label">
                          Телефон или эл. почта
                        </label>
                        <div className="field" data-invalid={!!errors.contact}>
                          <input
                            id="f-contact"
                            autoComplete="tel"
                            value={f.contact}
                            onChange={(e) => set("contact", e.target.value)}
                            placeholder="+7 900 000-00-00"
                            aria-invalid={!!errors.contact}
                          />
                        </div>
                        {errors.contact && <p className="mt-2 text-[12.5px] text-[#ef5b5b]">{errors.contact}</p>}
                      </div>
                      <div>
                        <span className="label">Страна покупки</span>
                        <Select
                          aria-label="Страна покупки"
                          value={f.country}
                          onChange={(v) => set("country", v)}
                          placeholder="Выберите страну"
                          invalid={!!errors.country}
                          options={COUNTRIES}
                        />
                        {errors.country && <p className="mt-2 text-[12.5px] text-[#ef5b5b]">{errors.country}</p>}
                      </div>
                      <div>
                        <span className="label">Бюджет</span>
                        <Select aria-label="Бюджет" value={f.budget} onChange={(v) => set("budget", v)} options={BUDGETS} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="f-msg" className="label">
                        Сообщение <span className="font-medium text-ink-3">· необязательно</span>
                      </label>
                      <div className="field field-area">
                        <textarea
                          id="f-msg"
                          rows={4}
                          value={f.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Модель, комплектация, цвет, сроки — всё, что важно"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-snug text-ink-2">
                        <input
                          type="checkbox"
                          checked={f.consent}
                          onChange={(e) => set("consent", e.target.checked)}
                          className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[var(--accent)]"
                        />
                        <span>Согласен на обработку персональных данных и с политикой конфиденциальности</span>
                      </label>
                      {errors.consent && <p className="mt-2 text-[12.5px] text-[#ef5b5b]">{errors.consent}</p>}
                    </div>
                    <button type="submit" disabled={status === "loading"} className="btn btn-primary h-14 w-full">
                      {status === "loading" ? (
                        <>
                          <Loader2 className="size-[18px] animate-spin" strokeWidth={2} /> Отправляем
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <ArrowUpRight className="size-[18px]" strokeWidth={2} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[12px] text-ink-3">Демонстрационная форма: данные никуда не отправляются.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
