import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        intersecting.forEach((entry, idx) => {
          const target = entry.target;
          const delay = idx * 80;
          setTimeout(() => {
            target.classList.add("visible");
          }, delay);
          observer.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}
