"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const KEY = "demo-notice-closed";

/** Tells the visitor at once that this is a sample site. Shows once per session. */
export function DemoNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let closed = false;
    try {
      closed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (closed) return;
    const t = setTimeout(() => setShow(true), 1400);
    const h = setTimeout(() => setShow(false), 10000);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  const close = () => {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="pointer-events-none fixed inset-x-0 top-[78px] z-40 flex justify-center px-3 sm:top-[90px]"
        >
          <div className="glass pointer-events-auto flex max-w-[520px] items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4 text-[12.5px] leading-snug font-semibold text-ink sm:gap-3 sm:py-2 sm:pr-2 sm:pl-5 sm:text-[13px]">
            <span>
              Пример сайта: логотип, тексты, цены и фото заменим под ваш бизнес
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть сообщение"
              className="grid size-8 shrink-0 place-items-center rounded-full text-ink-2 transition-colors hover:text-ink"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
