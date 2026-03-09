import { useEffect, useRef, useState } from "react";

const INITIAL_VH = 48;
const FINAL_VH = 78;

// #dedad5 = rgb(222, 218, 213)
// #c2f0c2 = rgb(194, 240, 194)
const START_RGB: [number, number, number] = [222, 218, 213];
const END_RGB: [number, number, number] = [194, 240, 194];

const lerpColor = (
  start: [number, number, number],
  end: [number, number, number],
  t: number,
): string => {
  const r = Math.round(start[0] + (end[0] - start[0]) * t);
  const g = Math.round(start[1] + (end[1] - start[1]) * t);
  const b = Math.round(start[2] + (end[2] - start[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

const Frame3 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const wrapperHeight = wrapper.offsetHeight;
      const raw = -rect.top / (wrapperHeight - vh);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const containerHeight = ((INITIAL_VH + (FINAL_VH - INITIAL_VH) * progress) * vh) / 100;
  const bgColor = lerpColor(START_RGB, END_RGB, progress);
  const labelOpacity = Math.max(0, (progress - 0.8) / 0.2);

  return (
    <section ref={wrapperRef} className="relative w-full" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full">
        <div
          className="absolute left-[10%] right-[10%] rounded-2xl border border-border-warm overflow-hidden"
          style={{
            bottom: "1.5rem",
            height: `${containerHeight}px`,
            backgroundColor: bgColor,
          }}
        >
          <div
            className="flex items-center justify-center h-full font-fanwood text-[2rem] text-text-primary"
            style={{ opacity: labelOpacity }}
          >
            SOME COOL VISUAL WOAW
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frame3;
