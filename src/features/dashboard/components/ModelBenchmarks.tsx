import { useLayoutEffect } from "react";
import { ArrowRight, Gauge } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { gsap } from "@/utils/gsap";
import { toneBg, toneText } from "../tones";
import type { ModelBenchmark } from "../types";
import { useTranslation } from "react-i18next";

interface ModelBenchmarksProps {
  items: ModelBenchmark[];
}

export function ModelBenchmarks({ items }: ModelBenchmarksProps) {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>();

  // نمو الأشرطة من 0 للقيمة الفعلية (القيمة مخزنة بـ data-value)
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-bar]",
        { width: "0%" },
        {
          width: (_index: number, el: Element) =>
            `${(el as HTMLElement).dataset.value}%`,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [ref]);

  return (
    <section
      ref={ref}
      className="flex flex-col rounded-xl bg-surface-container-low p-space-md shadow-lg"
    >
      <div
        data-reveal
        className="mb-space-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Gauge className="size-5 text-tertiary" />
          <h3 className="text-title-md text-on-surface">
            {t("dashboard.benchmarks.title")}
          </h3>
        </div>
        <span className="text-label-sm text-outline">
          {t("dashboard.benchmarks.live")}
        </span>
      </div>

      <ul className="flex flex-col gap-space-sm">
        {items.map((m) => (
          <li
            key={m.id}
            data-reveal
            className="flex flex-col gap-1.5 rounded-lg p-space-xs transition-colors hover:bg-surface-container"
          >
            <div className="flex items-center justify-between text-label-md">
              <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                <span className={`size-2 rounded-full ${toneBg[m.tone]}`} />
                {m.name}
              </span>
              <span className={`font-code-md ${toneText[m.tone]}`}>
                {m.latencyMs}ms / {m.accuracyPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  data-bar
                  data-value={m.scorePercent}
                  className={`h-full rounded-full ${toneBg[m.tone]}`}
                  style={{ width: `${m.scorePercent}%` }}
                />
              </div>
              <span className="w-8 text-end text-label-sm text-outline">
                {m.scorePercent}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-space-sm flex items-center justify-between pt-space-xs text-label-sm text-outline">
        <span>{t("dashboard.benchmarks.normalized")}</span>
        <button
          type="button"
          className="flex items-center gap-0.5 text-primary hover:underline"
        >
          {t("dashboard.benchmarks.matrix")}
          <ArrowRight className="rtl:-scale-x-100 size-3.5" />
        </button>
      </div>
    </section>
  );
}
