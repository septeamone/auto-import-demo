import { BRANDS } from "@/lib/data";
import { Vector } from "./ui";

export function Marquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div
      aria-label={`Марки в каталоге: ${BRANDS.join(", ")}`}
      className="relative overflow-hidden border-y border-line py-7 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max items-center gap-12 pr-12" style={{ animation: "marquee 48s linear infinite" }}>
        {row.map((b, i) => (
          <span key={`${b}-${i}`} className="flex items-center gap-12" aria-hidden>
            <span className="font-display text-[clamp(22px,2.6vw,34px)] font-medium tracking-[-0.02em] text-ink-3 transition-colors hover:text-ink">
              {b}
            </span>
            <Vector className="text-accent/60" size={14} />
          </span>
        ))}
      </div>
    </div>
  );
}
