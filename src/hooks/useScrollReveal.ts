import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  selector?: string;
  /**
   * true  = fade-in للعناصر اللي تحت الشاشة فقط (الافتراضي)
   * false = حركة فقط بدون fade
   * العناصر المرئية أصلًا لا تختفي أبدًا: هذا يحسّن LCP ويمنع
   * فشل فحص التباين أثناء الأنيميشن.
   */
  fade?: boolean;
}

export function useScrollReveal<T extends HTMLElement>({
  y = 32,
  duration = 0.7,
  stagger = 0.08,
  selector = "[data-reveal]",
  fade = true,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    // احترام إعداد "تقليل الحركة" للمستخدم (إمكانية الوصول)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = root.querySelectorAll<HTMLElement>(selector);
    if (!items.length) return;

    // هل القسم ظاهر أصلًا ضمن الشاشة؟ إن كان، لا نخفيه.
    const isAboveFold = root.getBoundingClientRect().top < window.innerHeight;
    const useFade = fade && !isAboveFold;

    // context بيجمع كل الـ animations وبينظفها مرة وحدة
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        useFade ? { opacity: 0, y } : { y: Math.min(y, 12) },
        {
          ...(useFade ? { opacity: 1 } : {}),
          y: 0,
          duration: useFade ? duration : Math.min(duration, 0.5),
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [y, duration, stagger, selector, fade]);

  return ref;
}