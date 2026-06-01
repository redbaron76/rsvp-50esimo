import { useState, useEffect, useRef } from "react";
import { useGuestCount } from "@/hooks/useGuestCount";

export const useHomePage = () => {
  const { totalConfirmed, isLoading } = useGuestCount();
  const [displayCount, setDisplayCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (isLoading) return;

    const target = totalConfirmed;
    const start = prevTarget.current;
    prevTarget.current = target;

    if (target === start) {
      setDisplayCount(target);
      return;
    }

    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [totalConfirmed, isLoading]);

  return {
    displayCount,
    totalConfirmed,
    isCountLoading: isLoading,
  };
};
