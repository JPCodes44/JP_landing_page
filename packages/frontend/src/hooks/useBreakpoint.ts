import { useEffect, useState } from "react";
import { BREAKPOINT_DESKTOP, BREAKPOINT_MOBILE, BREAKPOINT_TABLET } from "../theme";

export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

export const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINT_MOBILE) return "mobile";
  if (width < BREAKPOINT_TABLET) return "tablet";
  if (width < BREAKPOINT_DESKTOP) return "desktop";
  return "wide";
};

export const useBreakpoint = (): Breakpoint => {
  const [bp, setBp] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth));
  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
};
