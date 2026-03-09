import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // Try immediately, then once more after a short delay in case the page is still rendering
      tryScroll();
      const t = setTimeout(tryScroll, 100);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
}
