"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Pref = "system" | "light" | "dark";
const KEY = "site-theme";

const OPTIONS: { value: Pref; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "Как в системе", Icon: Monitor },
  { value: "light", label: "Светлая тема", Icon: Sun },
  { value: "dark", label: "Тёмная тема", Icon: Moon },
];

function resolve(p: Pref): "light" | "dark" {
  return p === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p;
}

function apply(p: Pref, animate: boolean) {
  const set = () => {
    document.documentElement.dataset.theme = resolve(p);
  };
  // View Transitions crossfade a GPU snapshot instead of animating every element.
  if (animate && document.startViewTransition) document.startViewTransition(set);
  else set();
}

export function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("dark");

  useEffect(() => {
    let saved: Pref = "dark";
    try {
      saved = (localStorage.getItem(KEY) as Pref) || "dark";
    } catch {}
    // Reading localStorage is only possible after mount; syncing it into state here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPref(saved);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let cur: Pref = "dark";
      try {
        cur = (localStorage.getItem(KEY) as Pref) || "dark";
      } catch {}
      if (cur === "system") apply("system", true);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const choose = (p: Pref) => {
    setPref(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {}
    apply(p, true);
  };

  return (
    <div role="radiogroup" aria-label="Тема оформления" className="flex items-center gap-0.5 rounded-full bg-ink/[0.07] p-[3px]">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={pref === value}
          aria-label={label}
          title={label}
          onClick={() => choose(value)}
          className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:text-ink aria-checked:bg-surface aria-checked:text-ink aria-checked:shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
        >
          <Icon className="size-[15px]" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
