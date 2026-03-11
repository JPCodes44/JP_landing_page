import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import {
  COLOR_FRAME3_GREEN,
  COLOR_FRAME3_TAN,
  FRAME3_RECT_INITIAL_HEIGHT,
  FRAME3_RECT_INITIAL_INSET,
  FRAME3_RECT_TARGET_HEIGHT,
  FRAME3_RECT_TARGET_INSET,
} from "../theme";

gsap.registerPlugin(ScrollTrigger);

// Pixels of scroll per frame during the linger phase.
// Higher = smoother scrub but taller section.
const PX_PER_FRAME = 3;

// Load all frame URLs in sorted order at build time
const frameModules = import.meta.glob("../../styles/assets/2d/videos/frame3Animation/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const FRAME_URLS: string[] = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key]);

const TOTAL_FRAMES = FRAME_URLS.length;

const Frame3 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const rect = rectRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !rect || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pre-load all images
    const images: HTMLImageElement[] = FRAME_URLS.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });

    let currentFrameIndex = -1;

    const drawImageCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (iw === 0 || ih === 0) return;
      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    };

    const drawFrame = (index: number) => {
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
      if (clampedIndex === currentFrameIndex) return;
      currentFrameIndex = clampedIndex;

      // Size canvas to container on first draw
      if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = rect.offsetWidth;
        canvas.height = rect.offsetHeight;
      }

      const img = images[clampedIndex];
      if (img.complete && img.naturalWidth > 0) {
        drawImageCover(img);
      } else {
        img.onload = () => drawImageCover(img);
      }
    };

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
      canvas.width = rect.offsetWidth;
      canvas.height = rect.offsetHeight;
      drawFrame(TOTAL_FRAMES - 1);
      return;
    }

    // Draw first frame immediately
    canvas.width = rect.offsetWidth;
    canvas.height = rect.offsetHeight;
    drawFrame(0);

    let tl: gsap.core.Timeline | undefined;

    const buildAnimation = () => {
      // Expansion: 1 viewport-height of scroll (same feel regardless of frame count)
      const expansionPx = window.innerHeight;
      // Linger: enough scroll to comfortably scrub all frames
      const lingerPx = TOTAL_FRAMES * PX_PER_FRAME;
      // Total section height = sticky viewport + scroll distance
      wrapper.style.height = `${window.innerHeight + expansionPx + lingerPx}px`;

      // GSAP units: expansion = 1, linger scales proportionally so px/unit stays constant
      const lingerUnits = lingerPx / expansionPx;

      tl?.scrollTrigger?.kill();
      tl?.kill();

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            drawFrame(Math.round(self.progress * (TOTAL_FRAMES - 1)));
          },
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
        // Linger: hold expanded state while frames scrub to the end
        .to({}, { duration: lingerUnits });
    };

    buildAnimation();

    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-bg-warm"
      // Height is set dynamically in the effect once frame count is known.
      // 300vh is a reasonable fallback until then.
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full">
        <div
          ref={rectRef}
          className="absolute rounded-2xl border border-border-warm overflow-hidden"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            left: FRAME3_RECT_INITIAL_INSET,
            right: FRAME3_RECT_INITIAL_INSET,
            height: FRAME3_RECT_INITIAL_HEIGHT,
            backgroundColor: COLOR_FRAME3_TAN,
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Frame3;
