import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as t from "../theme";

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
}: {
  item: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const verticalBarRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (isOpen) {
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: t.ANIM_DURATION_ACCORDION_OPEN,
          ease: "power2.out",
        },
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: t.ANIM_DURATION_ACCORDION_CLOSE,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const bar = verticalBarRef.current;
    if (!bar) return;
    gsap.to(bar, {
      scaleY: isOpen ? 0 : 1,
      duration: t.ANIM_DURATION_ICON_TOGGLE,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onEnter = () =>
      gsap.to(btn, {
        scale: t.ANIM_BUTTON_SCALE_HOVER,
        duration: t.ANIM_DURATION_BUTTON_SCALE,
        ease: "power2.out",
      });
    const onLeave = () =>
      gsap.to(btn, { scale: 1, duration: t.ANIM_DURATION_BUTTON_SCALE, ease: "power2.out" });
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #d4d0c8",
          paddingTop: "var(--f4-item-py)",
          paddingBottom: "var(--f4-item-py)",
          paddingLeft: "var(--f4-item-pl)",
          paddingRight: "var(--f4-item-pr)",
        }}
      >
        <span
          style={{
            fontFamily: '"Fanwood Text", serif',
            color: "#2d2d2d",
            fontSize: "var(--f4-item-size)",
          }}
        >
          {item}
        </span>
        <button
          ref={btnRef}
          type="button"
          onClick={onToggle}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            padding: 0,
            width: "var(--f4-button-size)",
            height: "var(--f4-button-size)",
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "collapse" : "expand"}
        >
          <span
            style={{
              position: "absolute",
              backgroundColor: "#2d2d2d",
              width: "100%",
              height: "var(--f4-line-thickness)",
            }}
          />
          <span
            ref={verticalBarRef}
            style={{
              position: "absolute",
              backgroundColor: "#2d2d2d",
              width: "var(--f4-line-thickness)",
              height: "100%",
            }}
          />
        </button>
      </div>
      <div
        ref={contentRef}
        style={{
          overflow: "hidden",
          height: 0,
          opacity: 0,
          paddingLeft: "var(--f4-content-pl)",
        }}
      >
        <p
          style={{
            fontFamily: '"Fanwood Text", serif',
            color: "#2d2d2d",
            lineHeight: 1.625,
            fontSize: "var(--f4-content-size)",
            paddingLeft: "var(--f4-accordion-px)",
            paddingRight: "var(--f4-item-pr)",
            paddingTop: "var(--f4-content-py)",
            paddingBottom: "var(--f4-content-py)",
          }}
        >
          More details about {item.toLowerCase()} coming soon.
        </p>
      </div>
    </div>
  );
};

const Frame4 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        start: t.ANIM_SCROLL_START,
        end: t.ANIM_SCROLL_END,
        scrub: false,
      },
    });

    tl.fromTo(
      heading,
      { opacity: 0, y: t.ANIM_Y_HEADING },
      { opacity: 1, y: 0, ease: "power2.out", duration: t.ANIM_DURATION_HEADING },
    ).fromTo(
      accordion,
      { opacity: 0, y: t.ANIM_Y_ACCORDION },
      { opacity: 1, y: 0, ease: "power2.out", duration: t.ANIM_DURATION_ACCORDION_IN },
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
      style={{
        width: "100%",
        backgroundColor: "#f5f3ef",
        paddingLeft: "var(--f4-section-px)",
        paddingRight: "var(--f4-section-px)",
        paddingTop: "var(--f4-section-pt)",
        paddingBottom: "var(--f4-section-pb)",
      }}
    >
      <h2
        ref={headingRef}
        style={{
          fontFamily: '"Fanwood Text", serif',
          lineHeight: 1,
          color: "#2d2d2d",
          opacity: 0,
          fontSize: "var(--f4-h2-size)",
        }}
      >
        Comprehensive Solutions:
      </h2>
      <div
        ref={accordionRef}
        style={{
          opacity: 0,
          marginTop: "var(--f4-accordion-mt)",
          marginLeft: "var(--f4-accordion-mx)",
          marginRight: "var(--f4-accordion-mx)",
          paddingLeft: "var(--f4-accordion-px)",
          paddingRight: "var(--f4-accordion-px)",
        }}
      >
        {ITEMS.map((item, i) => (
          <AccordionItem
            key={item}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Frame4;
