import { useCallback, useRef, useState } from "react";

export function useSquareSize<T extends HTMLElement>() {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [size, setSize] = useState(0);

  const ref = useCallback((el: T | null) => {
    // Clean up any previous observer first (handles unmount + remount)
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!el) return;

    const updateSize = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize(Math.floor(Math.min(width, height)));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    observerRef.current = observer;
  }, []);

  return { ref, size };
}