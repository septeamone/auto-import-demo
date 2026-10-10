"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./ui";

const NAV = [
  { id: "catalog", label: "Автомобили" },
  { id: "calc", label: "Расчёт" },
  { id: "process", label: "Как мы работаем" },
  { id: "faq", label: "Вопросы" },
  { id: "contact", label: "Контакты" },
];

export function Header() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? "" : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
      <nav
        aria-label="Основная навигация"
        className="glass glass-refract relative mx-auto flex h-[60px] max-w-[1180px] items-center gap-3 overflow-hidden rounded-full pr-2 pl-5 sm:h-[64px]"
      >
        <a href="#top" aria-label="LI MOTORS — на главную" className="shrink-0">
          <Wordmark />
        </a>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                className="relative rounded-full px-4 py-2 text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-ink aria-[current=true]:text-ink"
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-ink/[0.09]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <a href="#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Рассчитать стоимость
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </a>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full text-ink lg:hidden"
          >
            {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
          </button>
        </div>

        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-6 bottom-0 h-px origin-left bg-accent"
        />
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-[1180px] rounded-[28px] p-3 lg:hidden">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="flex h-14 items-center justify-between rounded-2xl px-4 text-[17px] font-semibold text-ink hover:bg-ink/[0.06]"
                >
                  {n.label}
                  <ArrowUpRight className="size-4 text-ink-3" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-line p-3 pt-4">
            <ThemeToggle />
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">
              Рассчитать
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
