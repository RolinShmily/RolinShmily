import React, { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";

interface InkRevealProps {
  active: boolean;
  onThemeApplied: (ink: boolean) => void;
}

/* The fog eases in, hangs at full density while the page is blurred and the
   palette flips, then thins and lifts. The switch happens shortly after the
   hold begins, once the banks have covered the viewport. */
const FOG_IN_MS = 540;
const FOG_HOLD_MS = 620;
const SWITCH_AT_MS = 170;
const FOG_OUT_MS = 720;
const MAX_BLUR = 14;
const PAGE_BLUR = 13;
const FOG_OPACITY = 0.96;
const RISE_PX = 130;

function smoothstep(p: number): number {
  return p * p * (3 - 2 * p);
}

/**
 * The theme transition is a weather change rather than a wipe: soft cloud
 * banks rise from below, the page behind them loses focus, and the palette
 * flips at peak density. After a short held beat the fog thins and lifts,
 * leaving the new theme in focus. The page is never fully covered; the blur
 * and the semi-opaque veil are what hide the switch.
 */
export const InkReveal: React.FC<InkRevealProps> = ({ active, onThemeApplied }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(active);
  const appliedRef = useRef(false);
  const busyRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const runRef = useRef<(target: boolean) => void>(() => {});
  const onThemeRef = useRef(onThemeApplied);
  onThemeRef.current = onThemeApplied;

  const run = useCallback((target: boolean) => {
    const host = hostRef.current;
    if (!host) {
      busyRef.current = false;
      return;
    }

    // A queued reverse run must be able to start from a clean state, so any
    // transition suppression left by a previous switch is cleared first.
    document.documentElement.classList.remove("ink-revealing");
    document.documentElement.classList.remove("ink-fogging");
    document.documentElement.style.removeProperty("--fog-page-blur");

    if (prefersReducedMotion()) {
      host.classList.remove("is-active");
      host.style.visibility = "hidden";
      host.style.opacity = "0";
      host.style.pointerEvents = "none";
      host.style.setProperty("--fog-flash-opacity", "0");
      document.documentElement.classList.toggle("ink-mode", target);
      onThemeRef.current(target);
      appliedRef.current = target;
      busyRef.current = false;
      return;
    }

    busyRef.current = true;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    document.documentElement.classList.add("ink-fogging");
    document.documentElement.style.setProperty("--fog-page-blur", "0px");

    host.classList.toggle("is-ink", target);
    host.classList.toggle("is-dark", !target);
    host.classList.add("is-active");
    host.style.visibility = "visible";
    host.style.opacity = "0";
    host.style.pointerEvents = "auto";
    host.style.setProperty("--fog-blur", "0px");
    host.style.setProperty("--fog-rise", "0px");
    host.style.setProperty("--fog-flash-opacity", "0");

    // Force the starting style to be committed before the first frame, so the
    // fog never begins from a leftover opacity or blur value.
    void host.offsetWidth;

    let phase: "in" | "hold" | "out" = "in";
    let phaseStarted = performance.now();
    let switched = false;

    const applyTheme = () => {
      if (switched) return;
      switched = true;
      // The palette switch is hidden by the fog, but CSS transitions on the
      // page would still start from the old theme's values. Mute them for the
      // switch; they come back as the fog lifts.
      document.documentElement.classList.add("ink-revealing");
      document.documentElement.classList.toggle("ink-mode", target);
      onThemeRef.current(target);
      appliedRef.current = target;
    };

    const animate = (now: number) => {
      const elapsed = now - phaseStarted;

      if (phase === "in") {
        const p = Math.min(elapsed / FOG_IN_MS, 1);
        const eased = smoothstep(p);
        host.style.opacity = (FOG_OPACITY * eased).toFixed(3);
        host.style.setProperty("--fog-blur", `${(MAX_BLUR * eased).toFixed(2)}px`);
        host.style.setProperty("--fog-rise", `${(RISE_PX * eased).toFixed(1)}px`);
        document.documentElement.style.setProperty(
          "--fog-page-blur",
          `${(PAGE_BLUR * eased).toFixed(2)}px`
        );

        if (p >= 1) {
          phase = "hold";
          phaseStarted = now;
        }
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (phase === "hold") {
        const p = Math.min(elapsed / FOG_HOLD_MS, 1);
        // A slow in-and-out swell keeps the fog alive during the wait without
        // drawing the eye to a loader.
        const breath = Math.sin(p * Math.PI);
        host.style.opacity = (FOG_OPACITY - 0.012 * breath).toFixed(3);
        host.style.setProperty(
          "--fog-blur",
          `${(MAX_BLUR + 1.4 * breath).toFixed(2)}px`
        );
        host.style.setProperty(
          "--fog-rise",
          `${(RISE_PX + 18 * breath).toFixed(1)}px`
        );
        document.documentElement.style.setProperty(
          "--fog-page-blur",
          `${(PAGE_BLUR + breath).toFixed(2)}px`
        );

        // A breath of denser mist passes over the page exactly while the
        // palette flips. The cloud banks stay visible above it; the veil only
        // fills the gaps, so this reads as weather rather than a white fade.
        const flashIn = smoothstep(
          Math.min(Math.max((elapsed - 40) / (SWITCH_AT_MS - 40), 0), 1)
        );
        const flashOut = smoothstep(
          Math.min(Math.max((elapsed - (SWITCH_AT_MS + 90)) / 220, 0), 1)
        );
        host.style.setProperty(
          "--fog-flash-opacity",
          (flashIn * (1 - flashOut)).toFixed(3)
        );

        if (!switched && elapsed >= SWITCH_AT_MS) applyTheme();

        if (p >= 1) {
          applyTheme();
          // The switch is done. Let hover/entrance transitions resume while
          // the fog is still dense enough to cover their first frames.
          document.documentElement.classList.remove("ink-revealing");
          host.style.setProperty("--fog-flash-opacity", "0");
          phase = "out";
          phaseStarted = now;
        }
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const p = Math.min(elapsed / FOG_OUT_MS, 1);
      const eased = smoothstep(p);
      host.style.opacity = (FOG_OPACITY * (1 - eased)).toFixed(3);
      host.style.setProperty("--fog-blur", `${(MAX_BLUR * (1 - eased)).toFixed(2)}px`);
      document.documentElement.style.setProperty(
        "--fog-page-blur",
        `${(PAGE_BLUR * (1 - eased)).toFixed(2)}px`
      );
      host.style.setProperty(
        "--fog-rise",
        `${(RISE_PX + 90 * eased).toFixed(1)}px`
      );

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      rafRef.current = null;
      host.classList.remove("is-active");
      host.style.visibility = "hidden";
      host.style.opacity = "0";
      host.style.pointerEvents = "none";
      host.style.setProperty("--fog-blur", "0px");
      host.style.setProperty("--fog-rise", "0px");
      host.style.setProperty("--fog-flash-opacity", "0");
      document.documentElement.classList.remove("ink-fogging");
      document.documentElement.style.setProperty("--fog-page-blur", "0px");
      busyRef.current = false;

      if (targetRef.current !== appliedRef.current) {
        runRef.current(targetRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  runRef.current = run;

  useEffect(() => {
    targetRef.current = active;
    if (busyRef.current) return;
    if (active !== appliedRef.current) runRef.current(active);
  }, [active]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove("ink-revealing");
      document.documentElement.classList.remove("ink-fogging");
      document.documentElement.style.setProperty("--fog-page-blur", "0px");
    };
  }, []);

  return (
    <div ref={hostRef} className="ink-fog" aria-hidden="true">
      <div className="ink-fog-veil" />
      <div className="ink-fog-clouds">
        <span className="ink-fog-cloud c1" />
        <span className="ink-fog-cloud c2" />
        <span className="ink-fog-cloud c3" />
        <span className="ink-fog-cloud c4" />
        <span className="ink-fog-cloud c5" />
        <span className="ink-fog-cloud c6" />
        <span className="ink-fog-cloud c7" />
        <span className="ink-fog-cloud c8" />
        <span className="ink-fog-cloud c9" />
        <span className="ink-fog-cloud c10" />
        <span className="ink-fog-cloud c11" />
      </div>
    </div>
  );
};
