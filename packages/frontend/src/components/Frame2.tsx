import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import bellImg from "../../styles/assets/2d/visuals/bell.png";
import calendarImg from "../../styles/assets/2d/visuals/calendar.png";
import sliderImg from "../../styles/assets/2d/visuals/slider.png";
import tasksImg from "../../styles/assets/2d/visuals/tasks.png";
import temperatureImg from "../../styles/assets/2d/visuals/temperature.png";
import workflowImg from "../../styles/assets/2d/visuals/workflow.png";
import { useBreakpoint } from "../hooks/useBreakpoint";
import {
  FONT_SIZE_BODY,
  FONT_SIZE_SECTION_H2,
  FRAME2_DESC_MARGIN_LEFT,
  FRAME2_GAP,
  FRAME2_HEADING_INITIAL_OPACITY,
  FRAME2_LEFT_FLEX,
  FRAME2_RIGHT_FLEX,
  GRID_GAP_X_WIDE,
  GRID_GAP_Y,
  ICON_SIZE,
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_HEADING,
  PARA_MARGIN_TOP_SM,
  PARA_MAX_WIDTH,
  SECTION_PADDING_BOTTOM_LG,
  SECTION_PADDING_TOP_LG,
  SECTION_PADDING_X,
} from "../theme";

gsap.registerPlugin(ScrollTrigger);

const icons = [
  { src: sliderImg, alt: "slider" },
  { src: temperatureImg, alt: "temperature" },
  { src: workflowImg, alt: "workflow" },
  { src: bellImg, alt: "bell" },
  { src: calendarImg, alt: "calendar" },
  { src: tasksImg, alt: "tasks" },
];

const ICON_FROM_Y = "10rem";
const ICON_STAGGER = 0.08;
const ICON_DURATION = 0.6;
const ICON_EASE = "power3.out";

const Frame2 = () => {
  const bp = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]);

  const isMobile = bp === "mobile";
  const sectionPaddingX = isMobile ? "1.5rem" : SECTION_PADDING_X;
  // clamp: scales proportionally with viewport; desktop size / 80rem * 100 = vw value
  const h2Size = isMobile
    ? "6rem"
    : bp === "tablet"
      ? "6rem"
      : `clamp(6rem, 17.5vw, ${FONT_SIZE_SECTION_H2})`;
  const bodySize = `clamp(1.4rem, 2.375vw, ${FONT_SIZE_BODY})`;
  const iconSize = isMobile || bp === "tablet" ? "7rem" : `clamp(7rem, 15.625vw, ${ICON_SIZE})`;
  const iconColumns = "repeat(2, auto)";
  const iconColGap = isMobile ? "2rem" : GRID_GAP_X_WIDE;
  const descMarginLeft = isMobile ? "0" : FRAME2_DESC_MARGIN_LEFT;
  const layoutDirection = isMobile ? "column" : "row";

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;
    const iconEls = iconRefs.current.filter(Boolean) as HTMLImageElement[];
    if (!section || !heading || !paragraph || iconEls.length === 0) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(heading, { opacity: 1 });
      gsap.set(paragraph, { opacity: 1, y: 0 });
      for (const el of iconEls) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
      return;
    }

    // Create scrubbed animation timeline for Frame2
    // Start animation very early in scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top -10%",
        scrub: 1,
      },
    });

    const rotations = [66, -66, 66, -66, 66, -66];

    // Icons first (position 0)
    tl.fromTo(
      iconEls,
      {
        opacity: 0,
        y: ICON_FROM_Y,
        rotation: (i: number) => rotations[i],
        transformOrigin: "50% 100%",
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: ICON_DURATION,
        ease: ICON_EASE,
        stagger: { each: ICON_STAGGER, from: "start" },
      },
      0,
    );

    // Heading and paragraph run in parallel with icons
    tl.fromTo(
      heading,
      { opacity: FRAME2_HEADING_INITIAL_OPACITY },
      { opacity: 1, duration: 1, ease: "power2.out" },
      0.3,
    );

    tl.fromTo(
      paragraph,
      { opacity: 0, y: "2rem" },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      0.3,
    );

    return () => {
      for (const st of ScrollTrigger.getAll()) {
        st.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-bg-warm"
      style={{
        paddingTop: SECTION_PADDING_TOP_LG,
        paddingBottom: SECTION_PADDING_BOTTOM_LG,
        paddingLeft: sectionPaddingX,
        paddingRight: sectionPaddingX,
      }}
    >
      <div
        className="items-center"
        style={{ display: "flex", flexDirection: layoutDirection, gap: FRAME2_GAP }}
      >
        <div
          className="min-w-0 flex flex-col"
          style={{ flex: isMobile ? "none" : FRAME2_LEFT_FLEX }}
        >
          <h2
            ref={headingRef}
            className="font-fanwood font-normal text-text-primary m-0"
            style={{
              fontSize: h2Size,
              lineHeight: LINE_HEIGHT_HEADING,
              opacity: FRAME2_HEADING_INITIAL_OPACITY,
            }}
          >
            What I do:
          </h2>
          <div style={{ marginLeft: descMarginLeft }}>
            <p
              ref={paragraphRef}
              className="font-fanwood font-normal text-text-primary mb-0"
              style={{
                fontSize: bodySize,
                lineHeight: LINE_HEIGHT_BODY,
                maxWidth: isMobile ? "100%" : PARA_MAX_WIDTH,
                marginTop: PARA_MARGIN_TOP_SM,
                opacity: 0,
              }}
            >
              I specialize in creating &ldquo;
              <span className="text-accent-green">agentic</span>&rdquo; workflows. That means your
              business doesn&rsquo;t just have tools; it has autonomous systems that handle lead
              gen, reporting, and customer care without you lifting a finger.
            </p>
          </div>
        </div>
        <div
          className="min-w-0 justify-center justify-items-center"
          style={{
            flex: isMobile ? "none" : FRAME2_RIGHT_FLEX,
            display: "grid",
            gridTemplateColumns: iconColumns,
            columnGap: iconColGap,
            rowGap: GRID_GAP_Y,
          }}
        >
          {icons.map((icon, i) => (
            <img
              key={icon.alt}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              src={icon.src}
              alt={icon.alt}
              style={{ width: "100%", maxWidth: iconSize, height: iconSize, opacity: 0 }}
              className="object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Frame2;
