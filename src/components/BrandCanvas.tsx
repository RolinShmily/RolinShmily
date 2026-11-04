import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";

const BRAND_TEXT = "RoL1n SrP";

function brandFontStack(): string {
  const css = getComputedStyle(document.documentElement);
  const families = ["--font-latin", "--font-cjk"]
    .map((name) => css.getPropertyValue(name).trim())
    .filter(Boolean);
  return [...families, "system-ui", "sans-serif"].join(", ");
}

export const BrandCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

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
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;

    const renderOffscreen = () => {
      offscreen.width = width;
      offscreen.height = height;
      offCtx.clearRect(0, 0, width, height);

      let fontSize = Math.min(width * 0.2, height * 0.78);
      offCtx.font = `900 ${fontSize}px ${BRAND_FONT_STACK}`;

      const textMetrics = offCtx.measureText(BRAND_TEXT);
      const maxTextWidth = width * 0.92;
      if (textMetrics.width > maxTextWidth) {
        fontSize = fontSize * (maxTextWidth / textMetrics.width);
        offCtx.font = `900 ${fontSize}px ${BRAND_FONT_STACK}`;
      }

      offCtx.fillStyle = "#e2eafc";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(BRAND_TEXT, width / 2, height / 2);
    };

    const resize = () => {
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
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      let maxDelta = 0;
      const ease = 0.085;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const sx = c * cellSize;
          const sy = r * cellSize;
          const sw = Math.min(cellSize, width - sx);
          const sh = Math.min(cellSize, height - sy);

          if (sw <= 0 || sh <= 0) continue;

          currX[i] += (targetX[i] - currX[i]) * ease;
          currY[i] += (targetY[i] - currY[i]) * ease;

          const dx = Math.abs(targetX[i] - currX[i]);
          const dy = Math.abs(targetY[i] - currY[i]);
          if (dx > maxDelta) maxDelta = dx;
          if (dy > maxDelta) maxDelta = dy;

          ctx.drawImage(offscreen, sx, sy, sw, sh, sx + currX[i], sy + currY[i], sw, sh);
        }
      }

      for (let i = 0; i < totalCells; i++) {
        targetX[i] *= 0.94;
        targetY[i] *= 0.94;
      }

      if (maxDelta > 0.15 && isIntersecting && !prefersReducedMotion()) {
        isAnimating = true;
        requestAnimationFrame(draw);
      } else {
        isAnimating = false;
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (prefersReducedMotion()) return;

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = (clientX - rect.left) * dpr;
      const y = (clientY - rect.top) * dpr;

      if (lastPointerX === null || lastPointerY === null) {
        lastPointerX = x;
        lastPointerY = y;
        return;
      }

      const vx = x - lastPointerX;
      const vy = y - lastPointerY;
      lastPointerX = x;
      lastPointerY = y;

      const speed = Math.hypot(vx, vy);
      if (speed < 0.5) return;

      const radius = cellSize * 4.2;
      const radiusSq = radius * radius;
      const maxPush = cellSize * 2.8;

      const startCol = Math.max(0, Math.floor((x - radius) / cellSize));
      const endCol = Math.min(cols - 1, Math.ceil((x + radius) / cellSize));
      const startRow = Math.max(0, Math.floor((y - radius) / cellSize));
      const endRow = Math.min(rows - 1, Math.ceil((y + radius) / cellSize));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const i = r * cols + c;
          const cx = c * cellSize + cellSize / 2;
          const cy = r * cellSize + cellSize / 2;
          const distSq = (cx - x) * (cx - x) + (cy - y) * (cy - y);

          if (distSq < radiusSq) {
            const factor = 1 - Math.sqrt(distSq) / radius;
            const push = factor * factor * Math.min(speed * 0.45, maxPush);
            const angle = Math.atan2(cy - y, cx - x);
            targetX[i] += Math.cos(angle) * push + vx * 0.12 * factor;
            targetY[i] += Math.sin(angle) * push + vy * 0.12 * factor;
          }
        }
      }

      if (!isAnimating && isIntersecting) {
        isAnimating = true;
        requestAnimationFrame(draw);
      }
    };

    const handlePointerLeave = () => {
      lastPointerX = null;
      lastPointerY = null;
    };

    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
      if (isIntersecting && !isAnimating) {
        draw();
      }
    });

    observer.observe(canvas);
    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });
    canvas.addEventListener("touchend", handlePointerLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerLeave);
    };
  }, []);

  return <canvas id="brand-canvas" ref={canvasRef} />;
};
