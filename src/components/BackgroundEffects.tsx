import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";
import { InkLandscape } from "./InkLandscape";

export const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridOverlayRef = useRef<HTMLDivElement | null>(null);
  const topHighlightRef = useRef<HTMLDivElement | null>(null);
  const bottomGlowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const PARTICLE_COUNT = 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotSpeed: number;
      shape: "note" | "star" | "circle";
    }

    const createParticle = (): Particle => {
      const shapes: ("note" | "star" | "circle")[] = ["note", "star", "circle"];
      return {
        x: Math.random() * canvas.width,
        y: -10,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    };

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const method = i === 0 ? "moveTo" : "lineTo";
        c[method](Math.cos(angle) * r, Math.sin(angle) * r);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawNote = (c: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      c.arc(0, 0, r * 0.4, 0, Math.PI * 2);
      c.fill();
      c.fillRect(r * 0.3, -r, r * 0.12, r);
      c.beginPath();
      c.ellipse(r * 0.36, -r, r * 0.35, r * 0.2, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.fillStyle = `rgba(247, 92, 126, ${p.opacity})`;

        if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.shape === "note") {
          drawNote(ctx, p.x, p.y, p.size, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.y > canvas.height + 20) {
          Object.assign(p, createParticle());
        }
      });

      if (!prefersReducedMotion()) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = window.innerHeight;
        const progress = Math.min(scrollY / heroH, 1);

        if (gridOverlayRef.current) {
          gridOverlayRef.current.style.opacity = String(Math.max(1 - progress * 2, 0.3));
        }

        document.body.style.setProperty("--glow-opacity", String(Math.max(1 - progress * 2, 0)));

        if (topHighlightRef.current) {
          const hlProgress = Math.min(Math.max((progress - 0.3) / 0.4, 0), 1);
          topHighlightRef.current.style.opacity = String(hlProgress);
        }

        if (bottomGlowRef.current) {
          const docH = document.documentElement.scrollHeight;
          const winH = window.innerHeight;
          const maxScroll = docH - winH;
          if (maxScroll > 0) {
            const bloomRange = Math.min(winH * 1.4, maxScroll * 0.75);
            const distFromBottom = Math.max(0, maxScroll - scrollY);
            if (distFromBottom <= bloomRange) {
              const ratio = (bloomRange - distFromBottom) / bloomRange;
              const glowOpacity = (1 - Math.pow(1 - ratio, 2.5)) * 0.95;
              bottomGlowRef.current.style.opacity = glowOpacity.toFixed(3);
            } else {
              bottomGlowRef.current.style.opacity = "0";
            }
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <InkLandscape />
      <canvas ref={canvasRef} id="particles" aria-hidden="true" />
      <div ref={gridOverlayRef} id="grid-overlay" aria-hidden="true" />
      <div ref={topHighlightRef} id="top-highlight" aria-hidden="true" />
      <div ref={bottomGlowRef} id="bottom-ambient-glow" aria-hidden="true" />
    </>
  );
};
