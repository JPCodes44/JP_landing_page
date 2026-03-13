import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import bellImg from "../../styles/assets/2d/visuals/bell.png";
import calendarImg from "../../styles/assets/2d/visuals/calendar.png";
import sliderImg from "../../styles/assets/2d/visuals/slider.png";
import tasksImg from "../../styles/assets/2d/visuals/tasks.png";
import temperatureImg from "../../styles/assets/2d/visuals/temperature.png";
import workflowImg from "../../styles/assets/2d/visuals/workflow.png";
import * as t from "../theme";

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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]);

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top -10%",
        scrub: 1,
      },
    });

    const rotations = [66, -66, 66, -66, 66, -66];

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

    tl.fromTo(
      heading,
      { opacity: t.FRAME2_HEADING_INITIAL_OPACITY },
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
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f3ef",
        paddingTop: "var(--f2-section-pt)",
        paddingBottom: "var(--f2-section-pb)",
        paddingLeft: "var(--f2-section-px)",
        paddingRight: "var(--f2-section-px)",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "var(--f2-layout-direction)" as React.CSSProperties["flexDirection"],
          gap: "var(--f2-gap)",
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            flex: "var(--f2-left-flex)",
          }}
        >
          <h2
            ref={headingRef}
            style={{
              fontFamily: '"Fanwood Text", serif',
              fontWeight: 400,
              color: "#2d2d2d",
              margin: 0,
              fontSize: "var(--f2-h2-size)",
              lineHeight: "var(--line-height-heading)",
              opacity: t.FRAME2_HEADING_INITIAL_OPACITY,
            }}
          >
            What I do:
          </h2>
          <div style={{ marginLeft: "var(--f2-desc-ml)" }}>
            <p
              ref={paragraphRef}
              style={{
                fontFamily: '"Fanwood Text", serif',
                fontWeight: 400,
                color: "#2d2d2d",
                marginBottom: 0,
                fontSize: "var(--f2-body-size)",
                lineHeight: "var(--line-height-body)",
                maxWidth: "var(--f2-para-max-width)",
                marginTop: "var(--f2-para-mt)",
                opacity: 0,
              }}
            >
              I specialize in creating &ldquo;
              <span style={{ color: "#7a8b5c" }}>agentic</span>&rdquo; workflows. That means your
              business doesn&rsquo;t just have tools; it has autonomous systems that handle lead
              gen, reporting, and customer care without you lifting a finger.
            </p>
          </div>
        </div>
        <div
          style={{
            minWidth: 0,
            justifyContent: "center",
            justifyItems: "center",
            flex: "var(--f2-right-flex)",
            display: "grid",
            gridTemplateColumns: "var(--f2-icon-columns)",
            columnGap: "var(--f2-icon-col-gap)",
            rowGap: "var(--f2-icon-row-gap)",
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
              style={{
                width: "100%",
                maxWidth: "var(--f2-icon-size)",
                height: "var(--f2-icon-size)",
                opacity: 0,
                objectFit: "contain",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Frame2;
