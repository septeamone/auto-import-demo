"use client";

import { ArrowRight, FileCheck2, Route, ScanSearch, UserRound } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Vector } from "./ui";

const FACTS = [
  { Icon: FileCheck2, title: "Цена до оплаты", text: "Все статьи расходов — в договоре" },
  { Icon: ScanSearch, title: "Осмотр без ретуши", text: "Фото и видео до выкупа" },
  { Icon: UserRound, title: "Один менеджер", text: "На связи на каждом этапе" },
  { Icon: Route, title: "Статус в пути", text: "Знаете, где автомобиль" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const carY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Mouse parallax: the car and the glow drift a few pixels in opposite directions.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const carX = useTransform(sx, [-1, 1], [-14, 14]);
  const carPY = useTransform(sy, [-1, 1], [-6, 6]);
  const glowX = useTransform(sx, [-1, 1], [26, -26]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="grain relative isolate overflow-hidden pt-[104px] sm:pt-[120px]"
    >
      <div aria-hidden className="grid-field absolute inset-0 -z-20" />
      <motion.div
        aria-hidden
        style={{ x: glowX }}
        className="absolute top-[18%] right-[-10%] -z-10 h-[78%] w-[78%] rounded-full opacity-90 blur-3xl"
      >
        <div className="size-full rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_34%,transparent),transparent)]" />
      </motion.div>

      <div className="mx-auto flex min-h-[calc(100svh-104px)] max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12 xl:px-20">
        <motion.div style={reduce ? undefined : { y: textY }} className="relative z-10 pt-6 sm:pt-10 lg:pt-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-ink-2"
          >
            <span className="inline-flex items-center gap-2.5">
              <Vector className="text-accent" size={13} />
              Импорт автомобилей
            </span>
            <span className="font-display text-[12px] tracking-[0.02em] text-ink">KR · JP · CN → RU</span>
          </motion.div>

          <h1 className="display text-[clamp(46px,9.4vw,152px)]">
            <motion.span
              className="block"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease: [0.2, 0, 0, 1] }}
            >
              Автомобили
            </motion.span>
            <motion.span
              className="block"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.18, ease: [0.2, 0, 0, 1] }}
            >
              без границ.
            </motion.span>
          </h1>
        </motion.div>

        {/* Stage: the car drives in over the headline */}
        <div className="relative mt-2 flex-1 sm:mt-0">
          <motion.div
            style={reduce ? undefined : { x: carX, y: carPY }}
            className="pointer-events-none relative z-[5] -mx-[8%] -mt-2 w-[116%] sm:mx-0 sm:w-[88%] sm:self-end lg:absolute lg:right-[-3%] lg:bottom-[5%] lg:mt-0 lg:w-[66%] xl:w-[62%]"
          >
            <motion.div
              style={reduce ? undefined : { y: carY, scale: carScale }}
              initial={reduce ? false : { opacity: 0, x: -160, filter: "blur(14px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Image
                src="/cars/prado.webp"
                alt="Toyota Land Cruiser Prado"
                width={2000}
                height={1181}
                priority
                className="relative z-10 h-auto w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]"
              />
              {/* floor reflection */}
              <Image
                src="/cars/prado.webp"
                alt=""
                aria-hidden
                width={2000}
                height={1181}
                className="absolute top-[96%] left-0 hidden h-auto w-full -scale-y-100 opacity-30 sm:block [mask-image:linear-gradient(to_top,transparent_55%,#000_100%)] [-webkit-mask-image:linear-gradient(to_top,transparent_55%,#000_100%)]"
              />
              {/* light sweep across the paint, once */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-[6%] left-0 z-20 w-[18%] bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light"
                style={{ animation: reduce ? "none" : "sweep 2.4s 1.4s cubic-bezier(.2,0,0,1) 1 both" }}
              />
            </motion.div>
          {/* glass: live route card, sits over the car so the refraction is visible */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.2, 0, 0, 1] }}
            className="glass glass-refract pointer-events-auto absolute right-[2%] bottom-[6%] z-20 hidden w-[280px] rounded-[26px] p-5 text-white [--glass-bg:rgba(10,13,19,0.5)] [--glass-edge:rgba(255,255,255,0.16)] [--glass-hi:rgba(255,255,255,0.3)] sm:block lg:right-[6%] lg:bottom-[10%] lg:w-[300px]"
          >
            <div className="flex items-center justify-between text-[12.5px] font-bold text-white/75">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-[var(--ok)]" style={{ animation: "pulse-ring 1.8s infinite" }} />
                В пути
              </span>
              <span className="font-display text-[12px] text-white">JP → RU</span>
            </div>
            <p className="mt-3 font-display text-[19px] leading-tight tracking-tight text-white">Land Cruiser Prado</p>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={reduce ? false : { width: 0 }}
                animate={{ width: "52%" }}
                transition={{ duration: 1.6, delay: 1.6, ease: [0.2, 0, 0, 1] }}
                className="h-full rounded-full bg-accent"
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[12px] font-semibold text-white/60">
              <span>Иокогама</span>
              <span className="text-white/90">день 12 из 23</span>
              <span>Владивосток</span>
            </div>
            <p className="mt-3 border-t border-white/15 pt-3 text-[11.5px] text-white/55">Пример отображения статуса сделки</p>
          </motion.div>
          </motion.div>

          {/* headline helper: lead + actions */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.2, 0, 0, 1] }}
            className="relative z-20 mt-4 flex max-w-[460px] flex-col gap-7 pb-10 lg:absolute lg:bottom-[14%] lg:left-0 lg:mt-0 lg:pb-0"
          >
            <p className="lead">
              Подбор, проверка и доставка автомобилей из Кореи, Китая и Японии. Вы видите цену и каждый этап сделки до
              оплаты.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="btn btn-primary">
                Подобрать автомобиль
                <ArrowRight className="size-[18px]" strokeWidth={2} />
              </a>
              <a href="#process" className="btn btn-ghost">
                Как это работает
              </a>
            </div>
          </motion.div>
        </div>

        {/* facts */}
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.2, 0, 0, 1] }}
          className="relative z-20 mt-2 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line py-7 lg:grid-cols-4"
        >
          {FACTS.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-accent-ink">
                <Icon className="size-[17px]" strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[14.5px] font-bold text-ink">{title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{text}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
