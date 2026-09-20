/**
 * Footer brand wordmark — `RoL1n SrP` rendered as a grid of tile sprites that get shoved
 * around by a spring-damper system under the pointer.
 *
 * Split out of `main.js` so that file stays an orchestration layer: this is a
 * self-contained rendering subsystem (offscreen target painting, tiling, physics, pointer
 * tracking), the same way `pixel-avatar.js` owns the three.js card. It is a module rather
 * than a global because nothing outside it should reach in.
 */
import { prefersReducedMotion } from "./motion.js";

const BRAND_TEXT = "RoL1n SrP";

/**
 * `ctx.font` takes a literal font shorthand, so the wordmark cannot inherit the DOM's
 * `font-family` the way body text does. Hard-coding a second copy of the stack here is
 * exactly how this wordmark once ended up silently rendering in the wrong face: the names
 * it asked for were never actually loaded, so the browser quietly walked down to a
 * fallback and nothing surfaced it. Read the families back out of the custom properties
 * that `css/style.css` owns instead, so a rename there cannot desync the canvas.
 */
function brandFontStack() {
  const css = getComputedStyle(document.documentElement);
  const families = ["--font-latin", "--font-cjk"]
    .map((name) => css.getPropertyValue(name).trim())
    .filter(Boolean);
  return [...families, "system-ui", "sans-serif"].join(", ");
}

export function initBrandCanvas() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");

  const BRAND_FONT_STACK = brandFontStack();

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cellSize = 20;
  let cols = 0;
  let rows = 0;
  let totalCells = 0;

  let currX = new Float32Array(0);
  let currY = new Float32Array(0);
  let targetX = new Float32Array(0);
  let targetY = new Float32Array(0);

  let isIntersecting = true;
  let isAnimating = false;
  let lastPointerX = null;
  let lastPointerY = null;

  function renderOffscreen() {
    offscreen.width = width;
    offscreen.height = height;
    offCtx.clearRect(0, 0, width, height);

    // Dynamic typography fitting
    let fontSize = Math.min(width * 0.2, height * 0.78);
    offCtx.font = `900 ${fontSize}px ${BRAND_FONT_STACK}`;

    // Adjust font size to fit width constraint
    const textMetrics = offCtx.measureText(BRAND_TEXT);
    const maxTextWidth = width * 0.92;
    if (textMetrics.width > maxTextWidth) {
      fontSize = fontSize * (maxTextWidth / textMetrics.width);
      offCtx.font = `900 ${fontSize}px ${BRAND_FONT_STACK}`;
    }

    // Clean solid pale text fill matching the reference design
    offCtx.fillStyle = "#e2eafc";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(BRAND_TEXT, width / 2, height / 2);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.round(rect.width * dpr);
    height = Math.round(rect.height * dpr);

    canvas.width = width;
    canvas.height = height;

    cellSize = Math.round(Math.max(12 * dpr, Math.min(26 * dpr, width / 68)));
    cols = Math.ceil(width / cellSize);
    rows = Math.ceil(height / cellSize);
    totalCells = cols * rows;

    currX = new Float32Array(totalCells);
    currY = new Float32Array(totalCells);
    targetX = new Float32Array(totalCells);
    targetY = new Float32Array(totalCells);

    renderOffscreen();
    drawSingleFrame();
  }

  function drawSingleFrame() {
    ctx.clearRect(0, 0, width, height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const sx = c * cellSize;
        const sy = r * cellSize;
        const sw = Math.min(cellSize, width - sx);
        const sh = Math.min(cellSize, height - sy);
        const dx = sx + currX[idx];
        const dy = sy + currY[idx];
        ctx.drawImage(offscreen, sx, sy, sw, sh, dx, dy, sw, sh);
      }
    }
  }

  /**
   * Single choke point for every animation start, which makes it the right place to
   * honour the motion preference: with reduced motion the wordmark still paints (via
   * `resize`), it just never enters the physics loop.
   */
  function startAnimation() {
    if (prefersReducedMotion()) return;
    if (!isAnimating && isIntersecting) {
      isAnimating = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    if (!isIntersecting) {
      isAnimating = false;
      return;
    }

    let moving = false;
    ctx.clearRect(0, 0, width, height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;

        // Spring-damper physics
        currX[idx] += (targetX[idx] - currX[idx]) * 0.2;
        currY[idx] += (targetY[idx] - currY[idx]) * 0.2;
        targetX[idx] *= 0.88;
        targetY[idx] *= 0.88;

        // Sub-pixel rest clamping
        if (Math.abs(currX[idx]) < 0.04) currX[idx] = 0;
        if (Math.abs(currY[idx]) < 0.04) currY[idx] = 0;
        if (Math.abs(targetX[idx]) < 0.04) targetX[idx] = 0;
        if (Math.abs(targetY[idx]) < 0.04) targetY[idx] = 0;

        if (currX[idx] !== 0 || currY[idx] !== 0 || targetX[idx] !== 0 || targetY[idx] !== 0) {
          moving = true;
        }

        const sx = c * cellSize;
        const sy = r * cellSize;
        const sw = Math.min(cellSize, width - sx);
        const sh = Math.min(cellSize, height - sy);
        const dx = sx + currX[idx];
        const dy = sy + currY[idx];

        ctx.drawImage(offscreen, sx, sy, sw, sh, dx, dy, sw, sh);
      }
    }

    if (moving) {
      requestAnimationFrame(tick);
    } else {
      isAnimating = false;
    }
  }

  function handlePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * dpr;
    const py = (clientY - rect.top) * dpr;

    if (lastPointerX === null || lastPointerY === null) {
      lastPointerX = px;
      lastPointerY = py;
      return;
    }

    const vx = px - lastPointerX;
    const vy = py - lastPointerY;
    lastPointerX = px;
    lastPointerY = py;

    const R = Math.max(75 * dpr, Math.min(width, height) * 0.38);
    const maxOffset = cellSize * 1.35;

    // Bounding box optimization
    const minCol = Math.max(0, Math.floor((px - R) / cellSize));
    const maxCol = Math.min(cols - 1, Math.floor((px + R) / cellSize));
    const minRow = Math.max(0, Math.floor((py - R) / cellSize));
    const maxRow = Math.min(rows - 1, Math.floor((py + R) / cellSize));

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cx = (c + 0.5) * cellSize;
        const cy = (r + 0.5) * cellSize;
        const dist = Math.hypot(cx - px, cy - py);

        if (dist < R) {
          const att = Math.pow(1 - dist / R, 2);
          const jitter = Math.sin(c * 13.37 + r * 37.11) * 3.5 * dpr;
          const idx = r * cols + c;

          const impulseX = (vx * 0.9 + jitter) * att;
          const impulseY = (vy * 0.7 - jitter) * att;

          targetX[idx] = Math.max(-maxOffset, Math.min(maxOffset, targetX[idx] + impulseX));
          targetY[idx] = Math.max(-maxOffset, Math.min(maxOffset, targetY[idx] + impulseY));
        }
      }
    }

    startAnimation();
  }

  function resetPointer() {
    lastPointerX = null;
    lastPointerY = null;
  }

  // Pointer & Touch Events
  canvas.addEventListener("pointermove", (e) => {
    handlePointer(e.clientX, e.clientY);
  });

  canvas.addEventListener("pointerleave", resetPointer);
  canvas.addEventListener("pointerup", resetPointer);

  canvas.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener("touchend", resetPointer);

  // Resize & Intersection handling
  window.addEventListener("resize", resize, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        startAnimation();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);

  // Initial setup
  resize();

  // `renderOffscreen` fits the wordmark to the canvas via `measureText`, so it has to run
  // again once the webfont has actually loaded — at DOMContentLoaded the face is still in
  // flight and the first measurement would be taken against a fallback, leaving the brand
  // text sized for the wrong font.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      renderOffscreen();
      drawSingleFrame();
    });
  }
}
