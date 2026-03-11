import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import {
  COLOR_FRAME3_GREEN,
  COLOR_FRAME3_TAN,
  FONT_SIZE_LABEL,
  FRAME3_CONTAINER_HEIGHT,
  FRAME3_RECT_INITIAL_HEIGHT,
  FRAME3_RECT_INITIAL_INSET,
  FRAME3_RECT_TARGET_HEIGHT,
  FRAME3_RECT_TARGET_INSET,
} from "../theme";

gsap.registerPlugin(ScrollTrigger);

const Frame3 = () => {
  const bp = useBreakpoint();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const labelSize = bp === "mobile" ? "1.2rem" : FONT_SIZE_LABEL;
  const rectInitialInset = bp === "mobile" ? "4%" : FRAME3_RECT_INITIAL_INSET;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const rect = rectRef.current;
    const label = labelRef.current;
    if (!wrapper || !rect || !label) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(rect, {
        height: FRAME3_RECT_TARGET_HEIGHT,
        left: FRAME3_RECT_TARGET_INSET,
        right: FRAME3_RECT_TARGET_INSET,
        backgroundColor: COLOR_FRAME3_GREEN,
      });
      gsap.set(label, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(
      rect,
      {
        height: FRAME3_RECT_TARGET_HEIGHT,
        left: FRAME3_RECT_TARGET_INSET,
        right: FRAME3_RECT_TARGET_INSET,
        backgroundColor: COLOR_FRAME3_GREEN,
        ease: "none",
        duration: 1,
      },
      0,
    )
      .fromTo(label, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.2 }, 0.8)
      // Linger: hold final state while user continues scrolling
      .to({}, { duration: 2 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-bg-warm"
      style={{ height: FRAME3_CONTAINER_HEIGHT }}
    >
      <div className="sticky top-0 h-screen w-full">
        <div
          ref={rectRef}
          className="absolute rounded-2xl border border-border-warm overflow-hidden"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            left: rectInitialInset,
            right: rectInitialInset,
            height: FRAME3_RECT_INITIAL_HEIGHT,
            backgroundColor: COLOR_FRAME3_TAN,
          }}
        >
          <div
            ref={labelRef}
            className="flex items-center justify-center h-full font-fanwood text-text-primary"
            style={{ opacity: 0, fontSize: labelSize }}
          >
            SOME COOL VISUAL WOAW
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frame3;
