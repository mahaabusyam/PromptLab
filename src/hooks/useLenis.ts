import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export function useLenis(): void {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      // import ديناميكي: Lenis يصير ملف منفصل ما يوقف أول رسم
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

      // كل ما تحرك Lenis، خبري ScrollTrigger يحدّث مواقعه
      lenis.on("scroll", ScrollTrigger.update);

      // GSAP يشغّل Lenis في كل frame (الوقت عنده بالثواني، وLenis بده ملي ثانية)
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };

    // ننتظر لحظة فراغ المتصفح (أو مهلة قصيرة إن ما كان مدعومًا)
    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
      : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, []);
}