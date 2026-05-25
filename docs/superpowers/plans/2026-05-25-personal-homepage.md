# Personal Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone ACG anime-style personal homepage with social links, site aggregation, GitHub API project showcase, experience timeline, and interest sections.

**Architecture:** Single-page scrolling layout using pure HTML/CSS/JS. Three files: `index.html` (structure), `css/style.css` (all styles), `js/main.js` (interactions, API, animations). Canvas-based particle system for ACG falling effects, Intersection Observer for scroll reveals, GitHub REST API for dynamic project data.

**Tech Stack:** HTML5, CSS3 (Grid, Flexbox, custom properties, animations), Vanilla JS (ES6+), Canvas API, GitHub REST API

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Page structure, all 6 sections, navigation, external font/meta links |
| `css/style.css` | All styles: layout, colors, typography, animations, responsive breakpoints |
| `js/main.js` | Navigation logic, GitHub API fetch, timeline rendering, particle canvas, scroll reveals |

---

### Task 1: HTML Skeleton + CSS Foundation

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/main.js`

- [ ] **Step 1: Create the HTML skeleton**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RoL1n_SrP</title>
  <meta name="description" content="RoL1n_SrP's personal homepage — developer, ACG enthusiast, guitarist.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Particle Canvas (background) -->
  <canvas id="particles"></canvas>

  <!-- Navigation -->
  <nav id="navbar">
    <div class="nav-inner">
      <a href="#hero" class="nav-logo">RoL1n</a>
      <button class="nav-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="#hero" class="active">Home</a></li>
        <li><a href="#sites">Sites</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#timeline">Timeline</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="section">
    <!-- Task 3 -->
  </section>

  <!-- Sites Section -->
  <section id="sites" class="section">
    <!-- Task 4 -->
  </section>

  <!-- Projects Section -->
  <section id="projects" class="section">
    <!-- Task 5 -->
  </section>

  <!-- Timeline Section -->
  <section id="timeline" class="section">
    <!-- Task 6 -->
  </section>

  <!-- About Section -->
  <section id="about" class="section">
    <!-- Task 7 -->
  </section>

  <!-- Footer -->
  <footer id="footer">
    <!-- Task 8 -->
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create the CSS foundation**

```css
/* css/style.css */

/* === Reset & Custom Properties === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #0f0a1a;
  --bg-card: rgba(30, 20, 50, 0.7);
  --accent-pink: #f75c7e;
  --accent-violet: #7c3aed;
  --accent-bright: #ff7eb3;
  --gradient: linear-gradient(135deg, #f75c7e, #7c3aed);
  --text-primary: #e8e0f0;
  --text-secondary: #a09bb5;
  --font-heading: "Noto Sans SC", "PingFang SC", sans-serif;
  --font-body: "Noto Sans SC", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Code", monospace;
  --nav-height: 64px;
  --section-padding: 100px 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height);
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

a {
  color: var(--accent-bright);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: var(--accent-pink);
}

.section {
  padding: var(--section-padding);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === Particle Canvas === */
#particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* === Navigation === */
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 1000;
  background: rgba(15, 10, 26, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(247, 92, 126, 0.1);
  transition: background 0.3s, box-shadow 0.3s;
}

#navbar.scrolled {
  background: rgba(15, 10, 26, 0.95);
  box-shadow: 0 4px 30px rgba(124, 58, 237, 0.15);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-links a::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient);
  transition: width 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--text-primary);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: transform 0.3s, opacity 0.3s;
}

/* === Card base === */
.card {
  background: var(--bg-card);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(247, 92, 126, 0.15);
  border-color: rgba(247, 92, 126, 0.3);
}

/* === Scroll reveal === */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* === Responsive: Mobile === */
@media (max-width: 768px) {
  :root {
    --section-padding: 60px 0;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: rgba(15, 10, 26, 0.95);
    backdrop-filter: blur(12px);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.5rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    pointer-events: none;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
```

- [ ] **Step 3: Create the JS skeleton**

```js
// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initParticles();
  initScrollReveal();
});

/* === Navigation === */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");

  // Mobile toggle
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  // Close mobile menu on link click
  navAnchors.forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("active");
    });
  });

  // Scroll: update navbar style + active link
  const sections = document.querySelectorAll(".section, #hero");
  window.addEventListener("scroll", () => {
    // Navbar background
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    // Active section highlight
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute("id");
      }
    });
    navAnchors.forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === `#${current}`
      );
    });
  });
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
    // Simple eighth note shape
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

      // Reset when out of bounds
      if (p.y > canvas.height + 20) {
        Object.assign(p, createParticle());
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* === Scroll Reveal === */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html` in a browser. Verify:
- Dark purple-black background fills the viewport
- Pink/pink-purple particles drift down from the top
- Navigation bar is visible at the top with glassmorphism effect
- Nav links are visible and hover effects work
- Page scrolls smoothly when clicking nav links

- [ ] **Step 5: Commit**

```bash
cd D:/GitHub/RolinShmily
git add index.html css/style.css js/main.js
git commit -m "feat: scaffold homepage with nav, particle canvas, and CSS foundation"
```

---

### Task 2: Hero Section

**Files:**
- Modify: `index.html` (hero section)
- Modify: `css/style.css` (hero styles)

- [ ] **Step 1: Add Hero HTML**

Replace the `<!-- Task 3 -->` placeholder in `index.html` hero section with:

```html
  <!-- Hero Section -->
  <section id="hero" class="section">
    <div class="hero-content reveal">
      <div class="hero-avatar">
        <div class="avatar-ring">
          <div class="avatar-inner">R</div>
        </div>
      </div>
      <h1 class="hero-name">
        <span class="typing-text" data-text="RoL1n_SrP"></span>
        <span class="typing-cursor">|</span>
      </h1>
      <p class="hero-subtitle">Entities should not be multiplied unnecessarily.</p>
      <div class="hero-social">
        <a href="https://blog.srprolin.top" target="_blank" rel="noopener" title="Blog">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        </a>
        <a href="mailto:RolinShmily@outlook.com" title="Email">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
        <a href="https://space.bilibili.com/422744280" target="_blank" rel="noopener" title="Bilibili">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.146c.363 0 .67.127.92.38.25.253.38.556.38.907v2.053c0 .351-.13.654-.38.907-.25.253-.557.38-.92.38s-.67-.127-.92-.38c-.25-.253-.38-.556-.38-.907v-2.053c0-.351.13-.654.38-.907.25-.253.557-.38.92-.38zm5.334 0c.363 0 .67.127.92.38.25.253.38.556.38.907v2.053c0 .351-.13.654-.38.907-.25.253-.557.38-.92.38s-.67-.127-.92-.38c-.25-.253-.38-.556-.38-.907v-2.053c0-.351.13-.654.38-.907.25-.253.557-.38.92-.38z"/></svg>
        </a>
        <a href="https://steamcommunity.com/profiles/76561199516828933/" target="_blank" rel="noopener" title="Steam">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.001-5.373 12.001-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303a3.01 3.01 0 0 0-3.015-3.015 3.01 3.01 0 0 0-3.015 3.015 3.01 3.01 0 0 0 3.015 3.015 3.01 3.01 0 0 0 3.015-3.015zm-5.273-.005c0-1.249 1.013-2.26 2.261-2.26 1.246 0 2.26 1.012 2.26 2.26 0 1.247-1.014 2.259-2.26 2.259-1.248 0-2.261-1.012-2.261-2.259z"/></svg>
        </a>
        <a href="https://github.com/RolinShmily" target="_blank" rel="noopener" title="GitHub">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
      </div>
      <div class="scroll-indicator">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" class="bounce">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
        </svg>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add Hero CSS**

Append to `css/style.css`:

```css
/* === Hero === */
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: var(--nav-height);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero-avatar {
  margin-bottom: 0.5rem;
}

.avatar-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 3px;
  background: var(--gradient);
  animation: ring-glow 3s ease-in-out infinite alternate;
}

@keyframes ring-glow {
  from { box-shadow: 0 0 20px rgba(247, 92, 126, 0.3); }
  to { box-shadow: 0 0 40px rgba(124, 58, 237, 0.5); }
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-name {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
}

.typing-cursor {
  font-weight: 300;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-style: italic;
}

.hero-social {
  display: flex;
  gap: 1.2rem;
  margin-top: 0.5rem;
}

.hero-social a {
  color: var(--text-secondary);
  transition: color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.hero-social a:hover {
  color: var(--accent-pink);
  transform: translateY(-3px);
  border-color: var(--accent-pink);
  box-shadow: 0 4px 16px rgba(247, 92, 126, 0.2);
}

.scroll-indicator {
  margin-top: 2rem;
  color: var(--text-secondary);
  opacity: 0.6;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(10px); }
  60% { transform: translateY(5px); }
}

@media (max-width: 768px) {
  .hero-name {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 0.95rem;
  }
  .avatar-ring {
    width: 96px;
    height: 96px;
  }
  .avatar-inner {
    font-size: 2rem;
  }
}
```

- [ ] **Step 3: Add typewriter effect to main.js**

Append to the `DOMContentLoaded` callback in `js/main.js` (before the closing `});`):

```js
  initTypewriter();
```

Add the function at the end of `main.js`:

```js
/* === Typewriter === */
function initTypewriter() {
  const el = document.querySelector(".typing-text");
  if (!el) return;
  const text = el.dataset.text;
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 120);
    }
  }
  setTimeout(type, 500);
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html` and verify:
- Hero section fills the viewport
- Avatar circle with gradient ring border and glow animation
- Name types out character by character
- Subtitle is displayed below
- 5 social icons are visible with hover effects
- Bouncing scroll indicator at bottom

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add hero section with avatar, typewriter, and social links"
```

---

### Task 3: Sites Section

**Files:**
- Modify: `index.html` (sites section)
- Modify: `css/style.css` (sites styles)

- [ ] **Step 1: Add Sites HTML**

Replace `<!-- Task 4 -->` in `index.html` with:

```html
  <!-- Sites Section -->
  <section id="sites" class="section">
    <h2 class="section-title reveal">Sites</h2>
    <div class="sites-grid">
      <a href="https://blog.srprolin.top" target="_blank" rel="noopener" class="card site-card reveal">
        <div class="site-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        </div>
        <h3 class="site-name">SrP-BloG</h3>
        <p class="site-desc">Personal blog — tech notes, life thoughts, and project updates.</p>
      </a>
      <a href="https://cfg.srprolin.top" target="_blank" rel="noopener" class="card site-card reveal">
        <div class="site-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>
        </div>
        <h3 class="site-name">SrP-CFG_ForCS2</h3>
        <p class="site-desc">CS2 config presets — one-click install with auto Steam path detection.</p>
      </a>
      <a href="https://github.com/RolinShmily" target="_blank" rel="noopener" class="card site-card reveal">
        <div class="site-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </div>
        <h3 class="site-name">GitHub</h3>
        <p class="site-desc">Open source projects, contributions, and code repositories.</p>
      </a>
      <a href="https://steamcommunity.com/profiles/76561199516828933/" target="_blank" rel="noopener" class="card site-card reveal">
        <div class="site-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.001-5.373 12.001-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303a3.01 3.01 0 0 0-3.015-3.015 3.01 3.01 0 0 0-3.015 3.015 3.01 3.01 0 0 0 3.015 3.015 3.01 3.01 0 0 0 3.015-3.015zm-5.273-.005c0-1.249 1.013-2.26 2.261-2.26 1.246 0 2.26 1.012 2.26 2.26 0 1.247-1.014 2.259-2.26 2.259-1.248 0-2.261-1.012-2.261-2.259z"/></svg>
        </div>
        <h3 class="site-name">Steam</h3>
        <p class="site-desc">Gaming profile — CS2, Minecraft, and more.</p>
      </a>
      <a href="https://space.bilibili.com/422744280" target="_blank" rel="noopener" class="card site-card reveal">
        <div class="site-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.146c.363 0 .67.127.92.38.25.253.38.556.38.907v2.053c0 .351-.13.654-.38.907-.25.253-.557.38-.92.38s-.67-.127-.92-.38c-.25-.253-.38-.556-.38-.907v-2.053c0-.351.13-.654.38-.907.25-.253.557-.38.92-.38zm5.334 0c.363 0 .67.127.92.38.25.253.38.556.38.907v2.053c0 .351-.13.654-.38.907-.25.253-.557.38-.92.38s-.67-.127-.92-.38c-.25-.253-.38-.556-.38-.907v-2.053c0-.351.13-.654.38-.907.25-.253.557-.38.92-.38z"/></svg>
        </div>
        <h3 class="site-name">Bilibili</h3>
        <p class="site-desc">Videos, anime, and ACG community content.</p>
      </a>
    </div>
  </section>
```

- [ ] **Step 2: Add Sites CSS**

Append to `css/style.css`:

```css
/* === Sites === */
.sites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.site-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  color: var(--text-primary);
}

.site-card:hover {
  color: var(--text-primary);
}

.site-icon {
  color: var(--accent-pink);
  margin-bottom: 0.25rem;
}

.site-name {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.site-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .sites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sites-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify in browser**

Scroll to the Sites section and verify:
- 5 site cards in a responsive grid
- Each card has an icon, name, and description
- Hover produces lift + glow effect
- Cards fade in on scroll
- Responsive: 3 col → 2 col → 1 col

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add sites navigation aggregation section"
```

---

### Task 4: Projects Section (GitHub API)

**Files:**
- Modify: `index.html` (projects section)
- Modify: `css/style.css` (projects styles)
- Modify: `js/main.js` (GitHub API logic)

- [ ] **Step 1: Add Projects HTML**

Replace `<!-- Task 5 -->` in `index.html` with:

```html
  <!-- Projects Section -->
  <section id="projects" class="section">
    <h2 class="section-title reveal">Projects</h2>
    <div id="featured-project" class="reveal"></div>
    <div id="project-grid" class="project-grid"></div>
  </section>
```

- [ ] **Step 2: Add Projects CSS**

Append to `css/style.css`:

```css
/* === Projects === */
.featured-card {
  background: var(--bg-card);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.featured-card:hover {
  border-color: rgba(247, 92, 126, 0.3);
  box-shadow: 0 8px 32px rgba(247, 92, 126, 0.12);
}

.featured-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.featured-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-pink);
}

.featured-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
}

.featured-name a {
  color: var(--text-primary);
}

.featured-name a:hover {
  color: var(--accent-bright);
}

.featured-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.featured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: var(--accent-violet);
}

.featured-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.featured-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.featured-preview {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  background: rgba(30, 20, 50, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: var(--text-primary);
}

.project-card:hover {
  color: var(--text-primary);
}

.project-card-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
}

.project-card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.lang-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

@media (max-width: 1024px) {
  .featured-card {
    grid-template-columns: 1fr;
  }
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add GitHub API logic to main.js**

Append to the `DOMContentLoaded` callback in `js/main.js`:

```js
  initProjects();
```

Add the function at the end of `main.js`:

```js
/* === GitHub Projects === */
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", C: "#555555",
  "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8", Java: "#b07219",
};

const FEATURED_NAME = "SrP-CFG_ForCS2";
const FEATURED_IMAGE = "https://cdn.jsdelivr.net/gh/RolinShmily/SrP-CFG_ForCS2@refs/heads/main/app/website/public/image.png";

async function initProjects() {
  const repos = await fetchRepos();
  if (!repos) return;

  const featured = repos.find((r) => r.name === FEATURED_NAME);
  const others = repos.filter((r) => r.name !== FEATURED_NAME);

  if (featured) renderFeatured(featured);
  renderProjectGrid(others);
}

async function fetchRepos() {
  const cached = sessionStorage.getItem("gh-repos");
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch(
      "https://api.github.com/users/RolinShmily/repos?sort=stars&per_page=10&direction=desc"
    );
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    sessionStorage.setItem("gh-repos", JSON.stringify(data));
    return data;
  } catch (e) {
    console.warn("GitHub API fetch failed:", e);
    return null;
  }
}

function renderFeatured(repo) {
  const el = document.getElementById("featured-project");
  if (!el) return;
  el.innerHTML = `
    <div class="featured-card">
      <div class="featured-info">
        <span class="featured-label">Featured Project</span>
        <h3 class="featured-name"><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
        <p class="featured-desc">${repo.description || ""}</p>
        <div class="featured-tags">
          ${(repo.topics || []).map((t) => `<span class="tag">${t}</span>`).join("")}
          ${repo.language ? `<span class="tag">${repo.language}</span>` : ""}
        </div>
        <div class="featured-meta">
          <span><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg> ${repo.stargazers_count}</span>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" style="color:var(--accent-bright)">Website</a>` : ""}
        </div>
      </div>
      <div class="featured-preview">
        <img src="${FEATURED_IMAGE}" alt="${repo.name}" loading="lazy" onerror="this.parentElement.innerHTML='<span style=\\'color:var(--text-secondary)\\'>Preview</span>'">
      </div>
    </div>
  `;
}

function renderProjectGrid(repos) {
  const el = document.getElementById("project-grid");
  if (!el) return;
  el.innerHTML = repos
    .map(
      (r) => `
    <a href="${r.html_url}" target="_blank" rel="noopener" class="card project-card reveal">
      <h4 class="project-card-name">${r.name}</h4>
      <p class="project-card-desc">${r.description || "No description."}</p>
      <div class="project-card-meta">
        ${r.language ? `<span><span class="lang-dot" style="background:${LANG_COLORS[r.language] || "#ccc"}"></span>${r.language}</span>` : ""}
        <span><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg> ${r.stargazers_count}</span>
      </div>
    </a>
  `
    )
    .join("");

  // Re-observe newly added reveal elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  el.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
```

- [ ] **Step 4: Verify in browser**

Scroll to the Projects section and verify:
- Featured project card displays with image, description, tags, star count
- Other repos render as grid cards below
- Clicking cards opens GitHub pages
- Cards fade in on scroll
- Refreshing page uses cached data (check sessionStorage in DevTools)

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add projects section with GitHub API integration"
```

---

### Task 5: Timeline Section

**Files:**
- Modify: `index.html` (timeline section)
- Modify: `css/style.css` (timeline styles)
- Modify: `js/main.js` (timeline data + rendering)

- [ ] **Step 1: Add Timeline HTML**

Replace `<!-- Task 6 -->` in `index.html` with:

```html
  <!-- Timeline Section -->
  <section id="timeline" class="section">
    <h2 class="section-title reveal">Timeline</h2>
    <div class="timeline-container" id="timeline-container"></div>
  </section>
```

- [ ] **Step 2: Add Timeline CSS**

Append to `css/style.css`:

```css
/* === Timeline === */
.timeline-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-container::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gradient);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 45%;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.timeline-item:nth-child(odd) {
  margin-left: 0;
  text-align: right;
}

.timeline-item:nth-child(even) {
  margin-left: 55%;
}

.timeline-dot {
  position: absolute;
  top: 1.8rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--gradient);
  box-shadow: 0 0 12px rgba(247, 92, 126, 0.4);
}

.timeline-item:nth-child(odd) .timeline-dot {
  right: -7%;
  transform: translateX(50%);
}

.timeline-item:nth-child(even) .timeline-dot {
  left: -7%;
  transform: translateX(-50%);
}

.timeline-date {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-pink);
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.timeline-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .timeline-container::before {
    left: 20px;
  }

  .timeline-item,
  .timeline-item:nth-child(odd),
  .timeline-item:nth-child(even) {
    width: calc(100% - 50px);
    margin-left: 50px;
    text-align: left;
  }

  .timeline-item:nth-child(odd) .timeline-dot,
  .timeline-item:nth-child(even) .timeline-dot {
    left: -39px;
    right: auto;
    transform: translateX(0);
  }
}
```

- [ ] **Step 3: Add Timeline data + rendering to main.js**

Append to the `DOMContentLoaded` callback in `js/main.js`:

```js
  initTimeline();
```

Add the function at the end of `main.js`:

```js
/* === Timeline === */
const TIMELINE_DATA = [
  {
    date: "2022",
    title: "Started at HAUT",
    desc: "Began studying Electronic Information Engineering at Henan University of Technology.",
  },
  {
    date: "2023",
    title: "Dove into Linux",
    desc: "Installed Arch Linux as daily driver. Fell in love with the terminal — bash, zsh, fastfetch, btop.",
  },
  {
    date: "2023",
    title: "First Open Source Project",
    desc: "Started building tools and sharing on GitHub. Explored TypeScript, React, and Electron.",
  },
  {
    date: "2024",
    title: "SrP-CFG_ForCS2",
    desc: "Launched CS2 config manager with Electron desktop app — auto Steam detection, one-click install.",
  },
  {
    date: "2024",
    title: "Picked up Guitar",
    desc: "Started learning guitar. Explored ESP, Gibson, Fender, and PRS instruments. ACG music is the best practice motivation.",
  },
  {
    date: "2025",
    title: "Personal Homepage",
    desc: "Building this site — a place to aggregate all my projects, interests, and journey.",
  },
];

function initTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  container.innerHTML = TIMELINE_DATA.map(
    (item, i) => `
    <div class="timeline-item reveal" style="transition-delay: ${i * 0.1}s">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${item.date}</div>
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-desc">${item.desc}</p>
    </div>
  `
  ).join("");

  // Observe new reveal elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  container.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
```

- [ ] **Step 4: Verify in browser**

Scroll to the Timeline section and verify:
- Vertical gradient line in the center
- Entries alternate left and right
- Gradient dots with glow on the timeline
- Fade-in with staggered delay
- Responsive: single column on mobile

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add timeline section with alternating layout"
```

---

### Task 6: About / Interests Section

**Files:**
- Modify: `index.html` (about section)
- Modify: `css/style.css` (about styles)

- [ ] **Step 1: Add About HTML**

Replace `<!-- Task 7 -->` in `index.html` with:

```html
  <!-- About Section -->
  <section id="about" class="section">
    <h2 class="section-title reveal">About</h2>
    <div class="about-grid">
      <div class="about-terminal reveal">
        <object data="assets/svg/terminal.svg" type="image/svg+xml" width="100%" class="terminal-svg">
          Terminal profile
        </object>
      </div>
      <div class="about-interests reveal">
        <h3 class="interests-heading">Interests</h3>
        <div class="interest-group">
          <span class="interest-label">ACG</span>
          <div class="interest-tags">
            <span class="interest-tag">孤独摇滚</span>
            <span class="interest-tag">Girls Band Cry</span>
            <span class="interest-tag">轻音少女</span>
            <span class="interest-tag">BangDream</span>
          </div>
        </div>
        <div class="interest-group">
          <span class="interest-label">Arch Linux</span>
          <div class="interest-tags">
            <span class="interest-tag">Bash</span>
            <span class="interest-tag">Zsh</span>
            <span class="interest-tag">Fastfetch</span>
            <span class="interest-tag">Btop</span>
            <span class="interest-tag">SSH</span>
          </div>
        </div>
        <div class="interest-group">
          <span class="interest-label">Guitar</span>
          <div class="interest-tags">
            <span class="interest-tag">ESP</span>
            <span class="interest-tag">Gibson</span>
            <span class="interest-tag">Fender</span>
            <span class="interest-tag">PRS</span>
          </div>
        </div>
        <div class="interest-group">
          <span class="interest-label">Games</span>
          <div class="interest-tags">
            <span class="interest-tag">Minecraft</span>
            <span class="interest-tag">CS2</span>
            <span class="interest-tag">CS:GO</span>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add About CSS**

Append to `css/style.css`:

```css
/* === About === */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.about-terminal {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.terminal-svg {
  display: block;
  width: 100%;
  height: auto;
}

.about-interests {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.interests-heading {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.interest-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.interest-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-pink);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.interest-tag {
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  background: rgba(30, 20, 50, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  color: var(--text-primary);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  cursor: default;
}

.interest-tag:hover {
  border-color: var(--accent-pink);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(247, 92, 126, 0.15);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify in browser**

Scroll to the About section and verify:
- Left: terminal SVG embedded from `assets/svg/terminal.svg`
- Right: interest groups with categorized tag pills
- Tags hover with lift + pink glow
- Responsive: stacks vertically on mobile

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add about section with terminal card and interest tags"
```

---

### Task 7: Footer

**Files:**
- Modify: `index.html` (footer)
- Modify: `css/style.css` (footer styles)

- [ ] **Step 1: Add Footer HTML**

Replace `<!-- Task 8 -->` in `index.html` with:

```html
  <!-- Footer -->
  <footer id="footer">
    <div class="footer-inner">
      <p class="footer-text">
        Built by <a href="https://github.com/RolinShmily" target="_blank" rel="noopener">RoL1n_SrP</a>
        &middot; <a href="https://github.com/RolinShmily/RolinShmily" target="_blank" rel="noopener">Source</a>
      </p>
      <p class="footer-counter">
        <img src="https://count.getloli.com/@RolinShmily" alt="Visitor Counter">
      </p>
    </div>
  </footer>
```

- [ ] **Step 2: Add Footer CSS**

Append to `css/style.css`:

```css
/* === Footer === */
#footer {
  border-top: 1px solid rgba(124, 58, 237, 0.15);
  padding: 2rem 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.footer-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.footer-counter img {
  height: 24px;
  opacity: 0.6;
}
```

- [ ] **Step 3: Verify in browser**

Scroll to the bottom and verify:
- Footer with border-top separator
- GitHub link and source link work
- Visitor counter image loads
- Clean centered layout

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add footer with links and visitor counter"
```

---

### Task 8: Polish, Responsive Testing & Final Commit

**Files:**
- Modify: `index.html` (final tweaks)
- Modify: `css/style.css` (responsive fixes)
- Modify: `js/main.js` (mobile nav toggle fix)

- [ ] **Step 1: Add hamburger animation CSS**

Append to `css/style.css`:

```css
/* === Hamburger animation === */
.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}
```

- [ ] **Step 2: Add scroll-padding for anchor offset**

Verify the `html` rule in `css/style.css` has:
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height);
}
```
(Already added in Task 1, confirm it's present.)

- [ ] **Step 3: Test responsive breakpoints**

Open `index.html` in browser and test:
1. **Desktop (>1024px):** All grids 3-col, timeline alternating, full nav
2. **Tablet (~768-1024px):** Sites 2-col, projects 2-col, featured full-width
3. **Mobile (<768px):** Single column, hamburger menu opens/closes, timeline single-side

Use browser DevTools responsive mode (Ctrl+Shift+M) to test each breakpoint.

- [ ] **Step 4: Test all interactions**

1. Nav links smooth-scroll to correct sections
2. Active nav link updates on scroll
3. Hero typewriter plays on load
4. Particles float continuously
5. All `.reveal` elements animate on scroll
6. Cards hover with glow effect
7. GitHub API populates projects
8. Mobile hamburger opens/closes menu

- [ ] **Step 5: Final commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: complete personal homepage with responsive design and polish"
```
