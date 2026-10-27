import { useEffect, useState } from "react";

/** Returns the id of the section currently near the top of the viewport. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
