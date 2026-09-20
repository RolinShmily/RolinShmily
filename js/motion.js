/**
 * Shared motion-preference module.
 *
 * The site leans on motion heavily: a falling-particle canvas, a typewriter, a three.js
 * avatar, a canvas wordmark, and eleven CSS keyframe sets. `css/style.css` neutralises
 * the CSS half through one `prefers-reduced-motion` block, but a running
 * `requestAnimationFrame` or WebGL loop is invisible to CSS — so the JS half has to ask
 * for itself. Both halves read the same media query, through here, rather than each
 * script re-querying it and drifting apart.
 *
 * Kept dependency-free so any module can import it without pulling in the world.
 */

const query =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

/**
 * True when the visitor has asked their OS to minimise non-essential motion.
 *
 * Call this at the point a loop would start rather than caching the result in a module
 * constant: the preference can change mid-session, and a loop that already checked once
 * would keep running.
 */
export function prefersReducedMotion() {
  return query ? query.matches : false;
}

/**
 * Invoke `callback(matches)` whenever the preference changes, so toggling the OS setting
 * is honoured without a reload. Returns an unsubscribe function.
 */
export function onReducedMotionChange(callback) {
  if (!query) return () => {};
  const handler = (event) => callback(event.matches);
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}
