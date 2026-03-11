import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { type Breakpoint, useBreakpoint } from "../hooks/useBreakpoint";
import {
  ACCORDION_CONTENT_PADDING_LEFT,
  ACCORDION_CONTENT_PADDING_X,
  ACCORDION_CONTENT_PADDING_Y,
  ACCORDION_MARGIN_TOP,
  ACCORDION_MARGIN_X,
  ACCORDION_PADDING_LEFT,
  ACCORDION_PADDING_RIGHT,
  ACCORDION_PADDING_Y,
  ANIM_BUTTON_SCALE_HOVER,
  ANIM_DURATION_ACCORDION_CLOSE,
  ANIM_DURATION_ACCORDION_IN,
  ANIM_DURATION_ACCORDION_OPEN,
  ANIM_DURATION_BUTTON_SCALE,
  ANIM_DURATION_HEADING,
  ANIM_DURATION_ICON_TOGGLE,
  ANIM_SCROLL_END,
  ANIM_SCROLL_START,
  ANIM_Y_ACCORDION,
  ANIM_Y_HEADING,
  BUTTON_SIZE,
  FONT_SIZE_ACCORDION_CONTENT,
  FONT_SIZE_ACCORDION_ITEM,
  FONT_SIZE_SECTION_H2_FRAME4,
  FRAME4_SECTION_PADDING_BOTTOM,
  FRAME4_SECTION_PADDING_TOP,
  LINE_THICKNESS,
  SECTION_PADDING_X,
} from "../theme";

const ITEMS = [
  "Continuous Lead gen",
  "Automated reporting",
  "Manual reporting",
  "Agentic internal tools",
];

const AccordionItem = ({
  item,
  isOpen,
  onToggle,
  bp,
}: {
  item: string;
  isOpen: boolean;
  onToggle: () => void;
  bp: Breakpoint;
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const verticalBarRef = useRef<HTMLSpanElement>(null);

  const isMobile = bp === "mobile";
  const itemFontSize = isMobile ? "1.8rem" : bp === "tablet" ? "2.5rem" : FONT_SIZE_ACCORDION_ITEM;
  const paddingY = isMobile ? "1.2rem" : ACCORDION_PADDING_Y;
  const paddingLeft = isMobile ? "1rem" : ACCORDION_PADDING_LEFT;
  const paddingRight = isMobile ? "1rem" : ACCORDION_PADDING_RIGHT;
  const contentPaddingLeft = isMobile ? "0" : ACCORDION_CONTENT_PADDING_LEFT;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (isOpen) {
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: ANIM_DURATION_ACCORDION_OPEN, ease: "power2.out" },
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: ANIM_DURATION_ACCORDION_CLOSE,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  // Animate vertical bar: scaleY 1 → 0 on open (+ becomes −)
  useEffect(() => {
    const bar = verticalBarRef.current;
    if (!bar) return;
    gsap.to(bar, {
      scaleY: isOpen ? 0 : 1,
      duration: ANIM_DURATION_ICON_TOGGLE,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onEnter = () =>
      gsap.to(btn, {
        scale: ANIM_BUTTON_SCALE_HOVER,
        duration: ANIM_DURATION_BUTTON_SCALE,
        ease: "power2.out",
      });
    const onLeave = () =>
      gsap.to(btn, { scale: 1, duration: ANIM_DURATION_BUTTON_SCALE, ease: "power2.out" });
    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div>
      <div
        className="flex items-center justify-between border-b-2 border-border-warm"
        style={{
          paddingTop: paddingY,
          paddingBottom: paddingY,
          paddingLeft,
          paddingRight,
        }}
      >
        <span className="font-fanwood text-text-primary" style={{ fontSize: itemFontSize }}>
          {item}
        </span>
        <button
          ref={btnRef}
          type="button"
          onClick={onToggle}
          className="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "collapse" : "expand"}
        >
          <span
            className="absolute bg-text-primary"
            style={{ width: "100%", height: LINE_THICKNESS }}
          />
          <span
            ref={verticalBarRef}
            className="absolute bg-text-primary"
            style={{ width: LINE_THICKNESS, height: "100%" }}
          />
        </button>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, paddingLeft: contentPaddingLeft }}
      >
        <p
          className="font-fanwood text-text-primary leading-relaxed"
          style={{
            fontSize: FONT_SIZE_ACCORDION_CONTENT,
            paddingLeft: ACCORDION_CONTENT_PADDING_X,
            paddingRight: paddingRight,
            paddingTop: ACCORDION_CONTENT_PADDING_Y,
            paddingBottom: ACCORDION_CONTENT_PADDING_Y,
          }}
        >
          More details about {item.toLowerCase()} coming soon.
        </p>
      </div>
    </div>
  );
};

const Frame4 = () => {
  const bp = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isMobile = bp === "mobile";
  const sectionPaddingX = isMobile ? "1.5rem" : SECTION_PADDING_X;
  const h2Size = isMobile ? "4rem" : FONT_SIZE_SECTION_H2_FRAME4;
  const accordionMarginTop = isMobile ? "4rem" : ACCORDION_MARGIN_TOP;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const heading = headingRef.current;
    const accordion = accordionRef.current;
    const section = sectionRef.current;
    if (!heading || !accordion || !section) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(heading, { opacity: 1, y: 0 });
      gsap.set(accordion, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: ANIM_SCROLL_START,
        end: ANIM_SCROLL_END,
        scrub: false,
      },
    });

    tl.fromTo(
      heading,
      { opacity: 0, y: ANIM_Y_HEADING },
      { opacity: 1, y: 0, ease: "power2.out", duration: ANIM_DURATION_HEADING },
    ).fromTo(
      accordion,
      { opacity: 0, y: ANIM_Y_ACCORDION },
      { opacity: 1, y: 0, ease: "power2.out", duration: ANIM_DURATION_ACCORDION_IN },
      "-=0.4",
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-bg-warm"
      style={{
        paddingLeft: sectionPaddingX,
        paddingRight: sectionPaddingX,
        paddingTop: FRAME4_SECTION_PADDING_TOP,
        paddingBottom: FRAME4_SECTION_PADDING_BOTTOM,
      }}
    >
      <h2
        ref={headingRef}
        className="font-fanwood leading-none text-text-primary"
        style={{ opacity: 0, fontSize: h2Size }}
      >
        Comprehensive Solutions:
      </h2>
      <div
        ref={accordionRef}
        style={{
          opacity: 0,
          marginTop: accordionMarginTop,
          marginLeft: isMobile ? "0" : ACCORDION_MARGIN_X,
          marginRight: isMobile ? "0" : ACCORDION_MARGIN_X,
          paddingLeft: ACCORDION_CONTENT_PADDING_X,
          paddingRight: ACCORDION_CONTENT_PADDING_X,
        }}
      >
        {ITEMS.map((item, i) => (
          <AccordionItem
            key={item}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
            bp={bp}
          />
        ))}
      </div>
    </section>
  );
};

export default Frame4;
