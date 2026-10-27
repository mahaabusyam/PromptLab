import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export function useLenis(): void {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // كل ما تحرك Lenis، خبري ScrollTrigger يحدّث مواقعه
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP يشغّل Lenis في كل frame (الوقت عنده بالثواني، وLenis بده ملي ثانية)
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
