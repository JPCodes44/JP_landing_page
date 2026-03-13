import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as t from "../theme";

gsap.registerPlugin(ScrollTrigger);

const Frame5 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headingLargeRef = useRef<HTMLHeadingElement>(null);
  const headingSmallRef = useRef<HTMLHeadingElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const headingLarge = headingLargeRef.current;
    const headingSmall = headingSmallRef.current;
    const frost = frostRef.current;
    const rect = rectRef.current;
    const nav = document.getElementById("main-nav");
    if (!wrapper || !sticky || !headingLarge || !headingSmall || !frost || !rect) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(headingLarge, { opacity: 0 });
      gsap.set(headingSmall, { opacity: 1, top: t.FRAME5_HEADING_FINAL_TOP });
      gsap.set(rect, { opacity: 1 });
      if (nav) gsap.set(nav, { opacity: 0 });
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

    tl.to(headingLarge, { opacity: 0, ease: "none", duration: 1 }, 0);
    tl.fromTo(
      headingSmall,
      { opacity: 0, top: t.FRAME5_HEADING_INITIAL_TOP },
      { opacity: 1, top: t.FRAME5_HEADING_FINAL_TOP, ease: "none", duration: 1 },
      0,
    );

    const cs = getComputedStyle(rect);
    tl.fromTo(rect, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.7);

    tl.fromTo(
      rect,
      {
        top: cs.top,
        left: cs.left,
        right: cs.right,
        height: cs.height,
        borderRadius: cs.borderRadius,
      },
      {
        top: 0,
        left: 0,
        right: 0,
        height: "100vh",
        borderRadius: "0",
        ease: "none",
        duration: 0.8,
      },
      1.2,
    );

    if (nav) {
      tl.to(nav, { opacity: 0, ease: "none", duration: 0.3 }, 1.2);
    }

    tl.fromTo(
      frost,
      { backdropFilter: "blur(0px)", opacity: 1 },
      { backdropFilter: t.FRAME5_FROST_BLUR_FINAL, ease: "power2.in", duration: 0.8 },
      1.2,
    );

    tl.to({}, { duration: 2 });

    const navTrigger = nav
      ? ScrollTrigger.create({
          trigger: wrapper,
          start: "bottom bottom",
          onEnter: () => gsap.to(nav, { opacity: 1, duration: 0.3, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(nav, { opacity: 0, duration: 0.2, ease: "power2.in" }),
        })
      : null;

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      navTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: "var(--f5-container-height)",
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#f5f3ef",
        }}
      >
        <h2
          ref={headingLargeRef}
          style={{
            position: "absolute",
            fontFamily: '"Fanwood Text", serif',
            color: "#2d2d2d",
            fontSize: "var(--f5-heading-initial-size)",
            opacity: t.FRAME5_HEADING_INITIAL_OPACITY,
            top: "var(--f5-heading-initial-top)",
            left: "var(--f5-heading-left)",
            right: "var(--f5-heading-left)",
            margin: 0,
            lineHeight: "var(--line-height-heading)",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          My Services In Action:
        </h2>
        <h2
          ref={headingSmallRef}
          style={{
            position: "absolute",
            fontFamily: '"Fanwood Text", serif',
            color: "#2d2d2d",
            fontSize: "var(--f5-heading-final-size)",
            opacity: t.FRAME5_HEADING_INITIAL_OPACITY,
            top: "var(--f5-heading-initial-top)",
            left: "var(--f5-heading-left)",
            right: "var(--f5-heading-left)",
            margin: 0,
            lineHeight: "var(--line-height-heading)",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          My Services In Action:
        </h2>
        <div
          ref={frostRef}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            pointerEvents: "none",
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
        />
        <div
          ref={rectRef}
          style={{
            position: "absolute",
            borderRadius: "1rem",
            overflow: "hidden",
            opacity: 0,
            top: "var(--f5-rect-initial-top)",
            left: "var(--f5-rect-initial-inset)",
            right: "var(--f5-rect-initial-inset)",
            height: "var(--f5-rect-initial-height)",
            backgroundColor: "var(--f5-rect-bg)",
            border: "1px solid currentColor",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontFamily: '"Fanwood Text", serif',
              color: "#2d2d2d",
            }}
          >
            <span
              style={{
                fontFamily: '"Fanwood Text", serif',
                color: "#2d2d2d",
              }}
            >
              some video
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frame5;
