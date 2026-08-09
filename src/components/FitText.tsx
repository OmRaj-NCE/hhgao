"use client";

import { useLayoutEffect, useRef } from "react";
import { CARD_NATIVE_WIDTH } from "@/lib/constants";

type Props = {
  text: string;
  top: string;
  maxPx: number;
  minPx: number;
  className?: string;
};

export default function FitText({ text, top, maxPx, minPx, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const container = el.closest(".id-card") as HTMLElement | null;
    if (!container) return;

    function applyFit() {
      const containerWidth = container!.clientWidth;
      const scale = containerWidth / CARD_NATIVE_WIDTH;

      let size = maxPx * scale;
      el!.style.fontSize = `${size}px`;
      const minSize = minPx * scale;

      while (el!.scrollWidth > el!.clientWidth && size > minSize) {
        size -= 1;
        el!.style.fontSize = `${size}px`;
      }
    }

    applyFit();
    const ro = new ResizeObserver(applyFit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text, maxPx, minPx]);

  return (
    <div ref={ref} className={`field-out ${className ?? ""}`} style={{ top }}>
      {text}
    </div>
  );
}