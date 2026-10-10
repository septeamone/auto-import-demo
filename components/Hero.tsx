"use client";

import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const STORY = [
  "Забираем автомобиль в порту отправления.",
  "Оформляем экспорт и грузим на судно.",
  "Следим за ним до вашего города.",
];

function StoryLine({ p, from, children }: { p: MotionValue<number>; from: number; children: string }) {
  const o = useTransform(p, [from, from + 0.12], [0, 1]);
  const y = useTransform(p, [from, from + 0.12], [36, 0]);
  return (
    <motion.p style={{ opacity: o, y }} className="display text-[clamp(24px,4.2vw,62px)] !leading-[1.1] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]">
      {children}
    </motion.p>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // 1. the headline falls apart, the lead and facts leave
  const l1x = useTransform(p, [0.02, 0.42], ["0vw", "-62vw"]);
  const l2x = useTransform(p, [0.02, 0.42], ["0vw", "62vw"]);
  const headO = useTransform(p, [0.12, 0.4], [1, 0]);
  const uiO = useTransform(p, [0, 0.12], [1, 0]);
  const uiY = useTransform(p, [0, 0.12], [0, 24]);

  // 2. the car drives away to the right, out of the frame
  const carX = useTransform(p, [0.02, 0.56], ["0vw", "78vw"]);
  const carS = useTransform(p, [0.02, 0.56], [1, 0.8]);
  const carO = useTransform(p, [0.42, 0.62], [1, 0]);

  // 3. a window in the middle opens to the full screen: the port
  const ix = useTransform(p, [0.08, 0.7], [33, 0]);
  const iy = useTransform(p, [0.08, 0.7], [30, 0]);
  const ir = useTransform(p, [0.08, 0.7], [40, 0]);
  const clip = useMotionTemplate`inset(${iy}% ${ix}% ${iy}% ${ix}% round ${ir}px)`;
  const winO = useTransform(p, [0.04, 0.2], [0, 1]);
  const imgS = useTransform(p, [0.08, 1], [1.3, 1]);

  // mouse parallax on the car, a few pixels
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const px = useTransform(sx, [-1, 1], [-12, 12]);
  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section id="top" ref={ref} onPointerMove={onMove} className="relative h-[330svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* the port, revealed from a window */}
        <motion.div suppressHydrationWarning style={reduce ? undefined : { clipPath: clip, opacity: winO }} className="absolute inset-0 z-0">
          <motion.div style={{ scale: imgS }} className="absolute inset-0">
            <Image
              src="/photos/hero-ship.webp"
              alt="Автомобилевоз у причала порта"
              fill
              sizes="100vw"
              priority
              className="object-cover"
              style={{ filter: "saturate(0.85) brightness(0.7) contrast(1.05)" }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,14,0.6),rgba(6,9,14,0.3)_35%,rgba(6,9,14,0.88)_100%)]" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 px-5 pb-[12svh] sm:px-8 lg:px-12 xl:px-20">
            {STORY.map((t, i) => (
              <StoryLine key={t} p={p} from={0.62 + i * 0.1}>
                {t}
              </StoryLine>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-[104px] sm:px-8 sm:pt-[120px] lg:px-12 xl:px-20">
          <motion.p
            suppressHydrationWarning
            style={{ opacity: uiO }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[14px] font-semibold text-ink-2"
          >
            Импорт автомобилей из Кореи, Японии и Китая
          </motion.p>

          <motion.h1 suppressHydrationWarning style={{ opacity: headO }} className="display relative z-[4] mt-5 text-[clamp(54px,8.9vw,132px)] !leading-[0.96] lg:whitespace-nowrap">
            <motion.span style={{ x: l1x }} className="block">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Из Азии
              </motion.span>
            </motion.span>
            <motion.span style={{ x: l2x }} className="block">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                в ваш город.
              </motion.span>
            </motion.span>
          </motion.h1>

          <motion.div
            suppressHydrationWarning
            style={{ x: carX, scale: carS, opacity: carO }}
            className="pointer-events-none relative z-[5] -mx-[6%] mt-3 w-[104%] sm:absolute sm:right-[-4%] sm:bottom-[16%] sm:mx-0 sm:mt-0 sm:w-[74%] lg:right-[-1%] lg:bottom-[3%] lg:w-[55%]"
          >
            <motion.div style={{ x: px }}>
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -180, filter: "blur(14px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src="/cars/prado.webp"
                  alt="Toyota Land Cruiser Prado"
                  width={2000}
                  height={1181}
                  priority
                  className="h-auto w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div suppressHydrationWarning style={{ opacity: uiO, y: uiY }} className="relative z-20 mt-auto flex flex-col gap-8 pb-9 lg:pb-14">
            <div className="flex max-w-[460px] flex-col gap-6">
              <p className="lead">Подбираем, проверяем и привозим. Вы видите цену и каждый этап сделки до оплаты.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#catalog" className="btn btn-primary">
                  Подобрать автомобиль
                  <ArrowRight className="size-[18px]" strokeWidth={2} />
                </a>
                <a href="#process" className="btn btn-ghost">
                  Как это работает
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
