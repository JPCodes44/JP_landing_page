import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import {
  FONT_SIZE_CTA,
  FONT_SIZE_CTA_MAX_WIDTH,
  FONT_SIZE_FORM_INPUT,
  FONT_SIZE_FORM_LABEL,
  FONT_SIZE_FORM_SUBMIT,
  FONT_SIZE_FORM_TITLE,
  FRAME6_ARROW_BOB_DURATION,
  FRAME6_ARROW_BOB_Y,
  FRAME6_ARROW_SIZE,
  FRAME6_FORM_INNER_PADDING,
  FRAME6_FORM_PADDING_X,
  FRAME6_HEADING_INITIAL_OPACITY,
  LINE_HEIGHT_HEADING,
  SECTION_PADDING_BOTTOM_LG,
  SECTION_PADDING_X,
} from "../theme";

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const inputClass =
    "font-fanwood text-text-primary bg-bg-warm border border-border-warm w-full outline-none";
  const labelClass = "font-fanwood text-text-primary";
  const shadowStyle = { boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" };
  const fieldStyle = { fontSize: FONT_SIZE_FORM_INPUT, padding: "0.6rem 0.75rem", ...shadowStyle };
  const labelStyle = { fontSize: FONT_SIZE_FORM_LABEL, fontFamily: "satoshi" };
  const gapStyle = { gap: "0.5rem" };

  return (
    <div style={{ padding: FRAME6_FORM_INNER_PADDING }}>
      <h3
        className="font-fanwood text-text-primary uppercase m-0"
        style={{
          fontSize: FONT_SIZE_FORM_TITLE,
          marginBottom: "2rem",
          letterSpacing: "0.05em",
          fontFamily: "satoshi",
        }}
      >
        Contact Me.
      </h3>

      <div className="flex flex-col" style={{ gap: "1.25rem", paddingTop: "5rem" }}>
        {/* First + Last Name */}
        <div className="flex" style={{ gap: "1.5rem" }}>
          <div className="flex flex-col" style={{ ...gapStyle, flex: "0 0 46%" }}>
            <label htmlFor="firstName" className={labelClass} style={labelStyle}>
              First Name
            </label>
            <input
              id="firstName"
              className={inputClass}
              style={{
                ...fieldStyle,
                backgroundColor: "#ffffff",
                padding: "1rem 1.25rem",
                fontSize: "1.4rem",
              }}
              placeholder="Your first name here.."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col" style={{ ...gapStyle, flex: "0 0 38%" }}>
            <label htmlFor="lastName" className={labelClass} style={labelStyle}>
              Last Name
            </label>
            <input
              id="lastName"
              className={inputClass}
              style={{
                ...fieldStyle,
                backgroundColor: "#ffffff",
                padding: "1rem 1.25rem",
                fontSize: "1.4rem",
              }}
              placeholder="Your last name here.."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col" style={{ ...gapStyle, width: "55%" }}>
          <label htmlFor="email" className={labelClass} style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            style={{
              ...fieldStyle,
              backgroundColor: "#ffffff",
              padding: "1rem 1.25rem",
              fontSize: "1.4rem",
            }}
            placeholder="Your email here.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Comments — slightly narrower than submit row */}
        <div className="flex flex-col" style={{ ...gapStyle, width: "90%" }}>
          <label htmlFor="comments" className={labelClass} style={labelStyle}>
            Comments
          </label>
          <textarea
            id="comments"
            className={`${inputClass} resize-none`}
            style={{
              ...fieldStyle,
              backgroundColor: "#ffffff",
              padding: "1rem 1.25rem",
              fontSize: "1.4rem",
              height: "20rem",
            }}
            placeholder="Your comments here.."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end" style={{ paddingTop: "3rem" }}>
          <button
            type="button"
            className="font-fanwood text-text-primary border border-text-primary bg-transparent cursor-pointer"
            style={{
              fontSize: "1.6rem",
              padding: "0.75rem 3rem",
              fontFamily: "satoshi",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Frame6 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const arrow = arrowRef.current;
    if (!section || !heading || !arrow) return;

    const bobTween = gsap.to(arrow, {
      y: FRAME6_ARROW_BOB_Y,
      duration: FRAME6_ARROW_BOB_DURATION,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([heading, arrow], { opacity: 1 });
      return () => {
        bobTween.kill();
      };
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top -33%",
        scrub: 1,
      },
    });

    tl.fromTo(
      [heading, arrow],
      { opacity: FRAME6_HEADING_INITIAL_OPACITY },
      { opacity: 1, ease: "power2.out", duration: 1 },
      0,
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      bobTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-bg-warm flex flex-col items-center"
      style={{
        paddingTop: "50rem",
        paddingBottom: SECTION_PADDING_BOTTOM_LG,
        paddingLeft: SECTION_PADDING_X,
        paddingRight: SECTION_PADDING_X,
      }}
    >
      {/* CTA heading */}
      <div className="flex flex-col items-center flex-1 justify-center w-full">
        <h2
          ref={headingRef}
          className="font-fanwood font-normal text-text-primary text-center m-0"
          style={{
            fontSize: FONT_SIZE_CTA,
            lineHeight: LINE_HEIGHT_HEADING,
            opacity: FRAME6_HEADING_INITIAL_OPACITY,
            maxWidth: FONT_SIZE_CTA_MAX_WIDTH,
          }}
        >
          Ready to stop working for your business and let it work for you?
        </h2>
      </div>

      {/* Arrow centered on the top border of the form rect */}
      <div
        className="relative w-full flex justify-center"
        style={{ marginBottom: `calc(-${FRAME6_ARROW_SIZE} / 2)`, zIndex: 1, paddingTop: "10rem" }}
      >
        <div
          ref={arrowRef}
          className="flex items-center justify-center rounded-full border border-text-primary bg-bg-warm"
          style={{
            width: FRAME6_ARROW_SIZE,
            height: FRAME6_ARROW_SIZE,
            opacity: FRAME6_HEADING_INITIAL_OPACITY,
          }}
        >
          <svg
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
          >
            <title>Scroll down arrow</title>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>

      {/* Form with dashed SVG border overlay */}
      <div
        className="relative bg-white"
        style={{ width: `calc(100% - ${FRAME6_FORM_PADDING_X} * 2)` }}
      >
        {/* Dashed border — sits on top, pointer-events off */}
        <svg
          className="absolute inset-0 text-text-primary pointer-events-none"
          style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
        >
          <title>Form border</title>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            pathLength="400"
            strokeDasharray="3 1"
            strokeDashoffset="1.5"
          />
        </svg>

        <ContactForm />
      </div>
    </section>
  );
};

export default Frame6;
