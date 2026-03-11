import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import {
  FRAME5_CONTAINER_HEIGHT,
  FRAME5_FROST_BLUR_FINAL,
  FRAME5_HEADING_FINAL_SIZE,
  FRAME5_HEADING_FINAL_TOP,
  FRAME5_HEADING_INITIAL_OPACITY,
  FRAME5_HEADING_INITIAL_SIZE,
  FRAME5_HEADING_INITIAL_TOP,
  FRAME5_RECT_BG_COLOR,
  FRAME5_RECT_INITIAL_HEIGHT,
  FRAME5_RECT_INITIAL_INSET,
  FRAME5_RECT_INITIAL_TOP,
} from "../theme";

gsap.registerPlugin(ScrollTrigger);

const Frame5 = () => {
  const bp = useBreakpoint();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headingLargeRef = useRef<HTMLHeadingElement>(null);
  const headingSmallRef = useRef<HTMLHeadingElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);

  const isMobile = bp === "mobile";
  const headingInitialSize = isMobile ? "6rem" : FRAME5_HEADING_INITIAL_SIZE;
  const headingFinalSize = isMobile ? "4rem" : FRAME5_HEADING_FINAL_SIZE;
  const headingInitialTop = isMobile ? "30vh" : FRAME5_HEADING_INITIAL_TOP;
  const headingLeft = isMobile ? "1.5rem" : "3.75rem";

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
      gsap.set(headingSmall, { opacity: 1, top: FRAME5_HEADING_FINAL_TOP });
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

    // Phase 1 (0–1.0): Large heading fades out; small heading fades in and moves up
    tl.to(headingLarge, { opacity: 0, ease: "none", duration: 1 }, 0);
    tl.fromTo(
      headingSmall,
      { opacity: 0, top: FRAME5_HEADING_INITIAL_TOP },
      { opacity: 1, top: FRAME5_HEADING_FINAL_TOP, ease: "none", duration: 1 },
      0,
    );

    // Phase 2 (0.7–1.0): Rect fades in
    tl.fromTo(rect, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.7);

    // Phase 3 (1.2–2.0): Rect expands to fullscreen, nav collapses
    tl.to(
      rect,
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

    // Phase 3 blur: background behind rect frosts as rect expands
    tl.fromTo(
      frost,
      { backdropFilter: "blur(0px)", opacity: 1 },
      { backdropFilter: FRAME5_FROST_BLUR_FINAL, ease: "power2.in", duration: 0.8 },
      1.2,
    );

    // Linger: hold final frosted fullscreen state while user continues scrolling
    tl.to({}, { duration: 2 });

    // Restore nav when viewport leaves Frame5, hide again if scrolling back in
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
      className="relative w-full"
      style={{ height: FRAME5_CONTAINER_HEIGHT }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-bg-warm">
        {/* Large heading — 2 lines, fades out */}
        <h2
          ref={headingLargeRef}
          className="absolute font-fanwood text-text-primary"
          style={{
            fontSize: headingInitialSize,
            opacity: FRAME5_HEADING_INITIAL_OPACITY,
            top: headingInitialTop,
            left: headingLeft,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          My Services In Action:
        </h2>
        {/* Small heading — 1 line, fades in and moves up */}
        <h2
          ref={headingSmallRef}
          className="absolute font-fanwood text-text-primary whitespace-nowrap"
          style={{
            fontSize: headingFinalSize,
            opacity: 0,
            top: headingInitialTop,
            left: headingLeft,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          My Services In Action:
        </h2>
        {/* Frost overlay — sits behind rect, blurs background content */}
        <div
          ref={frostRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, backdropFilter: "blur(0px)" }}
        />
        <div
          ref={rectRef}
          className="absolute rounded-2xl overflow-hidden"
          style={{
            opacity: 0,
            top: FRAME5_RECT_INITIAL_TOP,
            left: FRAME5_RECT_INITIAL_INSET,
            right: FRAME5_RECT_INITIAL_INSET,
            height: FRAME5_RECT_INITIAL_HEIGHT,
            backgroundColor: FRAME5_RECT_BG_COLOR,
            border: "1px solid currentColor",
          }}
        >
          <div className="flex items-center justify-center h-full font-fanwood text-text-primary">
            <span className="font-fanwood text-text-primary">some video</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frame5;
