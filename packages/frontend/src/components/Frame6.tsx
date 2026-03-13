import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import * as t from "../theme";

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const inputStyle: React.CSSProperties = {
    fontFamily: '"Fanwood Text", serif',
    color: "#2d2d2d",
    backgroundColor: "#f5f3ef",
    border: "1px solid #d4d0c8",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '"Fanwood Text", serif',
    color: "#2d2d2d",
  };

  return (
    <div style={{ padding: "var(--f6-form-padding)" }}>
      <h3
        style={{
          fontFamily: "satoshi",
          color: "#2d2d2d",
          textTransform: "uppercase",
          margin: 0,
          fontSize: "var(--f6-title-size)",
          marginBottom: "var(--f6-title-mb)",
          letterSpacing: "var(--f6-title-letter-spacing)",
        }}
      >
        Contact Me.
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--f6-fields-gap)",
          paddingTop: "var(--f6-fields-pt)",
        }}
      >
        {/* First + Last Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "var(--f6-name-direction)" as React.CSSProperties["flexDirection"],
            gap: "var(--f6-name-row-gap)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--f6-label-gap)",
              flex: "var(--f6-first-name-flex)",
            }}
          >
            <label
              htmlFor="firstName"
              style={{
                ...labelStyle,
                fontSize: "var(--f6-label-size)",
                fontFamily: "satoshi",
              }}
            >
              First Name
            </label>
            <input
              id="firstName"
              style={{
                ...inputStyle,
                fontSize: "var(--f6-input-size)",
                padding: "var(--f6-input-padding)",
                boxShadow: "var(--f6-shadow)",
                backgroundColor: "var(--f6-input-bg)",
              }}
              placeholder="Your first name here.."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--f6-label-gap)",
              flex: "var(--f6-last-name-flex)",
            }}
          >
            <label
              htmlFor="lastName"
              style={{
                ...labelStyle,
                fontSize: "var(--f6-label-size)",
                fontFamily: "satoshi",
              }}
            >
              Last Name
            </label>
            <input
              id="lastName"
              style={{
                ...inputStyle,
                fontSize: "var(--f6-input-size)",
                padding: "var(--f6-input-padding)",
                boxShadow: "var(--f6-shadow)",
                backgroundColor: "var(--f6-input-bg)",
              }}
              placeholder="Your last name here.."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--f6-label-gap)",
            width: "var(--f6-email-width)",
          }}
        >
          <label
            htmlFor="email"
            style={{
              ...labelStyle,
              fontSize: "var(--f6-label-size)",
              fontFamily: "satoshi",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            style={{
              ...inputStyle,
              fontSize: "var(--f6-input-size)",
              padding: "var(--f6-input-padding)",
              boxShadow: "var(--f6-shadow)",
              backgroundColor: "var(--f6-input-bg)",
            }}
            placeholder="Your email here.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Comments */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--f6-label-gap)",
            width: "var(--f6-comments-width)",
          }}
        >
          <label
            htmlFor="comments"
            style={{
              ...labelStyle,
              fontSize: "var(--f6-label-size)",
              fontFamily: "satoshi",
            }}
          >
            Comments
          </label>
          <textarea
            id="comments"
            style={{
              ...inputStyle,
              resize: "none",
              fontSize: "var(--f6-input-size)",
              padding: "var(--f6-input-padding)",
              boxShadow: "var(--f6-shadow)",
              backgroundColor: "var(--f6-input-bg)",
              height: "var(--f6-textarea-height)",
            }}
            placeholder="Your comments here.."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "var(--f6-submit-pt)",
          }}
        >
          <button
            type="button"
            style={{
              fontFamily: "satoshi",
              color: "#2d2d2d",
              border: "1px solid #2d2d2d",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "var(--f6-submit-size)",
              padding: "var(--f6-submit-padding)",
              boxShadow: "var(--f6-shadow)",
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
  const bp = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // SVG attributes can't use CSS vars — keep breakpoint logic for these only
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const borderWidth = isMobile
    ? t.FRAME6_BORDER_WIDTH_MOBILE
    : isTablet
      ? t.FRAME6_BORDER_WIDTH_TABLET
      : t.FRAME6_BORDER_WIDTH_DESKTOP;
  const borderDash = isMobile
    ? t.FRAME6_BORDER_DASH_MOBILE
    : isTablet
      ? t.FRAME6_BORDER_DASH_TABLET
      : t.FRAME6_BORDER_DASH_DESKTOP;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const arrow = arrowRef.current;
    if (!section || !heading || !arrow) return;

    const bobTween = gsap.to(arrow, {
      y: t.FRAME6_ARROW_BOB_Y,
      duration: t.FRAME6_ARROW_BOB_DURATION,
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
      { opacity: t.FRAME6_HEADING_INITIAL_OPACITY },
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
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f3ef",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "var(--f6-section-pt)",
        paddingBottom: "var(--f6-section-pb)",
        paddingLeft: "var(--f6-section-px)",
        paddingRight: "var(--f6-section-px)",
      }}
    >
      {/* CTA heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <h2
          ref={headingRef}
          style={{
            fontFamily: '"Fanwood Text", serif',
            fontWeight: 400,
            color: "#2d2d2d",
            textAlign: "center",
            margin: 0,
            fontSize: "var(--f6-cta-size)",
            lineHeight: "var(--line-height-heading)",
            opacity: t.FRAME6_HEADING_INITIAL_OPACITY,
            maxWidth: "var(--f6-cta-max-width)",
          }}
        >
          Ready to stop working for your business and let it work for you?
        </h2>
      </div>

      {/* Arrow centered on the top border of the form rect */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "calc(-1 * var(--f6-arrow-size) / 2)",
          zIndex: 1,
          paddingTop: "var(--f6-arrow-pt)",
        }}
      >
        <div
          ref={arrowRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            border: "1px solid #2d2d2d",
            backgroundColor: "#f5f3ef",
            width: "var(--f6-arrow-size)",
            height: "var(--f6-arrow-size)",
            opacity: t.FRAME6_HEADING_INITIAL_OPACITY,
          }}
        >
          <svg
            width="var(--f6-arrow-icon-size)"
            height="var(--f6-arrow-icon-size)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#2d2d2d" }}
          >
            <title>Scroll down arrow</title>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>

      {/* Form with dashed SVG border overlay */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          width: "var(--f6-form-width)",
        }}
      >
        {/* Dashed border — sits on top, pointer-events off */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            color: "#2d2d2d",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            display: "block",
            overflow: "visible",
          }}
        >
          <title>Form border</title>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="currentColor"
            strokeWidth={borderWidth}
            pathLength="400"
            strokeDasharray={borderDash}
            strokeDashoffset={t.FRAME6_BORDER_DASH_OFFSET}
          />
        </svg>

        <ContactForm />
      </div>
    </section>
  );
};

export default Frame6;
