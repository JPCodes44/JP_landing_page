import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as t from "../theme";

gsap.registerPlugin(ScrollTrigger);

const Frame3 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

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
        height: t.FRAME3_RECT_TARGET_HEIGHT,
        left: t.FRAME3_RECT_TARGET_INSET,
        right: t.FRAME3_RECT_TARGET_INSET,
        backgroundColor: t.COLOR_FRAME3_GREEN,
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

    const cs = getComputedStyle(rect);
    tl.fromTo(
      rect,
      {
        height: cs.height,
        left: cs.left,
        right: cs.right,
        backgroundColor: cs.backgroundColor,
      },
      {
        height: t.FRAME3_RECT_TARGET_HEIGHT,
        left: t.FRAME3_RECT_TARGET_INSET,
        right: t.FRAME3_RECT_TARGET_INSET,
        backgroundColor: t.COLOR_FRAME3_GREEN,
        ease: "none",
        duration: 1,
      },
      0,
    )
      .fromTo(label, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.2 }, 0.8)
      .to({}, { duration: 2 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#f5f3ef",
        height: "var(--f3-container-height)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          ref={rectRef}
          style={{
            position: "absolute",
            borderRadius: "1rem",
            border: "1px solid #d4d0c8",
            overflow: "hidden",
            top: "50%",
            transform: "translateY(-50%)",
            left: "var(--f3-rect-initial-inset)",
            right: "var(--f3-rect-initial-inset)",
            height: "var(--f3-rect-initial-height)",
            backgroundColor: "var(--f3-rect-initial-bg)",
          }}
        >
          <div
            ref={labelRef}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontFamily: '"Fanwood Text", serif',
              color: "#2d2d2d",
              opacity: 0,
              fontSize: "var(--f3-label-size)",
            }}
          >
            SOME COOL VISUAL WOAW
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frame3;
