/**
 * Page orchestration. This module wires the interactive pieces together and nothing
 * else — the two heavy rendering subsystems live in modules of their own:
 * `brand-canvas.js` (the footer wordmark) and `pixel-avatar.js` (the three.js card).
 *
 * Loaded as an ES module, so the document is already parsed by the time this runs: no
 * `DOMContentLoaded` wait is needed, and nothing leaks onto `window`.
 */
import { prefersReducedMotion } from "./motion.js";
import { initBrandCanvas } from "./brand-canvas.js";

initNavigation();
initParticles();
initScrollReveal();
initTypewriter();
initScrollEffects();

// Works are now 100% static HTML (0-JS) with local assets
initBrandCanvas();
initBackToTop();
initEmailButtons();

/* === Navigation === */
function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const pill = document.querySelector(".nav-pill");
  const navItems = document.querySelectorAll(".nav-item");

  // Mobile toggle
  if (toggle && pill) {
    toggle.addEventListener("click", () => {
      pill.classList.toggle("open");
      toggle.classList.toggle("active");
      toggle.setAttribute("aria-expanded", pill.classList.contains("open"));
    });

    // Close mobile menu on link click
    navItems.forEach((a) => {
      a.addEventListener("click", () => {
        pill.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll: update active link (cached & RAF throttled to eliminate jitter)
  const sections = document.querySelectorAll(".section, #hero");
  let currentActiveId = "";
  let navSpyTicking = false;

  function updateActiveNav() {
    let current = "";
    const scrollPos = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute("id");
      }
    });

    if (!current && window.scrollY < 200) {
      current = "hero";
    }

    if (current && current !== currentActiveId) {
      currentActiveId = current;
      navItems.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
      });
    }
  }

  window.addEventListener("scroll", () => {
    if (!navSpyTicking) {
      navSpyTicking = true;
      requestAnimationFrame(() => {
        updateActiveNav();
        navSpyTicking = false;
      });
    }
  }, { passive: true });
}

/* === Particle Canvas === */
function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 30;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function createParticle() {
    const shapes = ["note", "star", "circle"];
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
  }

  // Seed initial particles at random Y positions
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function drawStar(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const method = i === 0 ? "moveTo" : "lineTo";
      ctx[method](Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawNote(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(r * 0.3, -r, r * 0.12, r);
    ctx.beginPath();
    ctx.ellipse(r * 0.36, -r, r * 0.35, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
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

    // Reduced motion: paint the field once and stop instead of looping forever.
    if (!prefersReducedMotion()) requestAnimationFrame(animate);
  }
  animate();
}

/* === Scroll Reveal === */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      intersecting.forEach((entry, idx) => {
        const target = entry.target;
        // Batch stagger delay: elements in the same viewport batch enter with 80ms increments
        const delay = idx * 80;
        setTimeout(() => {
          target.classList.add("visible");
        }, delay);
        observer.unobserve(target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
}

/* === Typewriter === */
function initTypewriter() {
  const el = document.querySelector(".typing-text");
  if (!el) return;
  const text = el.dataset.text;

  // Reduced motion: reveal the finished string immediately instead of typing it out.
  if (prefersReducedMotion()) {
    el.textContent = text;
    return;
  }

  let displayText = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      displayText += text[i];
      el.textContent = displayText;
      el.style.animation = "none";
      setTimeout(() => {
        el.style.animation = "charPulse 0.3s ease-out";
      }, 10);
      i++;
      setTimeout(type, 100);
    } else {
      el.style.animation = "";
    }
  }

  setTimeout(type, 650);
}

/* === Scroll Effects === */
function initScrollEffects() {
  const navbar = document.getElementById("navbar");
  const navPill = document.querySelector(".nav-pill");
  const gridOverlay = document.getElementById("grid-overlay");
  const topHighlight = document.getElementById("top-highlight");
  const bottomAmbientGlow = document.getElementById("bottom-ambient-glow");
  const bodyBefore = document.body;

  // On mobile, show navbar immediately
  if (navbar && window.innerWidth <= 768) {
    navbar.classList.remove("hidden");
  }

  let ticking = false;
  let isNavVisible = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH = window.innerHeight;

      // Progress 0→1 as user scrolls through the hero
      const progress = Math.min(scrollY / heroH, 1);

      // Grid overlay fades out: 1 → 0.3 over 0%~50% scroll
      const gridOpacity = Math.max(1 - progress * 2, 0.3);
      if (gridOverlay) gridOverlay.style.opacity = gridOpacity;

      // Bottom glow fades out completely (same range)
      bodyBefore.style.setProperty("--glow-opacity", Math.max(1 - progress * 2, 0));

      // Top highlight fades in: 0 → 1 over 30%~70% scroll
      const hlProgress = Math.min(Math.max((progress - 0.3) / 0.4, 0), 1);
      if (topHighlight) topHighlight.style.opacity = hlProgress;

      // Bottom ambient horizon glow (Hakadao cubic bloom as user scrolls to bottom)
      if (bottomAmbientGlow) {
        const docH = document.documentElement.scrollHeight;
        const winH = window.innerHeight;
        const maxScroll = docH - winH;
        if (maxScroll > 0) {
          const bloomRange = Math.min(winH * 1.4, maxScroll * 0.75);
          const distFromBottom = Math.max(0, maxScroll - scrollY);
          if (distFromBottom <= bloomRange) {
            const ratio = (bloomRange - distFromBottom) / bloomRange;
            const glowOpacity = (1 - Math.pow(1 - ratio, 2.5)) * 0.95;
            bottomAmbientGlow.style.opacity = glowOpacity.toFixed(3);
          } else {
            bottomAmbientGlow.style.opacity = "0";
          }
        }
      }

      // Navbar appears after scrolling down, with hysteresis to prevent jitter/flicker
      const isMobile = window.innerWidth <= 768;
      if (navbar && !isMobile) {
        // Hysteresis deadzone: show when > 0.30, hide only when < 0.12
        if (!isNavVisible && progress > 0.30) {
          isNavVisible = true;
          navbar.classList.remove("hidden");
        } else if (isNavVisible && progress < 0.12) {
          isNavVisible = false;
          navbar.classList.add("hidden");
        }
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Apply initial state
  onScroll();
}

/* === Back to Top === */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle("visible", window.scrollY > window.innerHeight * 0.5);
      ticking = false;
    });
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* === Email Button: copy address to clipboard with pink feedback === */
function initEmailButtons() {
  const EMAIL = "rol1n@srprolin.top";
  const FEEDBACK_MS = 1500; // how long the "Copied!" feedback stays visible
  const buttons = document.querySelectorAll(".email-btn");
  const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>`;

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (btn.dataset.copied) return; // avoid double-fire during feedback
      btn.dataset.copied = "1";
      const email = btn.dataset.email || EMAIL;

      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          copied = true;
        } else {
          const ta = document.createElement("textarea");
          ta.value = email;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          copied = document.execCommand("copy");
          document.body.removeChild(ta);
        }
      } catch (err) {
        console.error("Failed to copy email: ", err);
      }

      if (!copied) {
        delete btn.dataset.copied;
        return;
      }

      // Feedback: swap every email button to a pink "Copied!" state
      const originals = new Map();
      buttons.forEach((b) => {
        originals.set(b, b.innerHTML);
        b.classList.add("copied");
        b.innerHTML = `<span>Copied!</span>${checkSvg}`;
      });

      setTimeout(() => {
        buttons.forEach((b) => {
          b.classList.remove("copied");
          b.innerHTML = originals.get(b);
        });
        delete btn.dataset.copied;
      }, FEEDBACK_MS);
    });
  });
}
