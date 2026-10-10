import { SERVICES } from "@/lib/data";
import { Reveal, SectionHead } from "./ui";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[var(--page)] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            stacked
            title="Что входит в работу"
            lead="Показываем всё, что знаем об автомобиле и сделке, до того как вы примете решение."
          />
        </div>
        <ul className="border-t-[1.5px] border-ink/80">
          {SERVICES.map((s, i) => {
            return (
              <Reveal as="li" key={s.title} delay={i * 0.05}>
                <div className="group grid gap-x-8 gap-y-3 border-b border-line py-8 transition-colors hover:bg-accent-soft sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:items-start sm:px-4 sm:-mx-4 sm:rounded-[4px]">
                  <h3 className="text-[clamp(20px,1.7vw,24px)] leading-snug font-bold text-ink">{s.title}</h3>
                  <p className="text-[15.5px] leading-relaxed text-ink-2">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
