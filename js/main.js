// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initParticles();
  initScrollReveal();
  initTypewriter();
  initScrollEffects();

  initWorks();
  initBrandCanvas();
  initBackToTop();
  initEmailButtons();
});

/* === Navigation === */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const toggle = document.querySelector(".nav-toggle");
  const pill = document.querySelector(".nav-pill");
  const navItems = document.querySelectorAll(".nav-item");

  // Mobile toggle
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

  // Scroll: update active link
  const sections = document.querySelectorAll(".section, #hero");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute("id");
      }
    });
    navItems.forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === `#${current}`
      );
    });
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

    requestAnimationFrame(animate);
  }
  animate();
}

/* === Scroll Reveal === */
function initScrollReveal() {
  let revealIndex = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    el.dataset.revealDelay = revealIndex * 80;
    revealIndex++;
    observer.observe(el);
  });
}

/* === Typewriter === */
function initTypewriter() {
  const el = document.querySelector(".typing-text");
  if (!el) return;
  const text = el.dataset.text;
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

  setTimeout(type, 400);
}

/* === Scroll Effects === */
function initScrollEffects() {
  const navbar = document.getElementById("navbar");
  const navPill = document.querySelector(".nav-pill");
  const gridOverlay = document.getElementById("grid-overlay");
  const topHighlight = document.getElementById("top-highlight");
  const bodyBefore = document.body;

  // On mobile, show navbar immediately
  if (navbar && window.innerWidth <= 768) {
    navbar.classList.remove("hidden");
  }

  let ticking = false;
  let navWasHidden = true;

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

      // Navbar appears after 30% scroll (skip on mobile)
      const isMobile = window.innerWidth <= 768;
      if (navbar && !isMobile) {
        const showNav = progress > 0.3;
        if (showNav) {
          navbar.classList.remove("hidden");
          if (navWasHidden) {
            navWasHidden = false;
            navPill.classList.remove("animate-in");
            void navPill.offsetWidth;
            navPill.classList.add("animate-in");
          }
        } else {
          navbar.classList.add("hidden");
          navWasHidden = true;
          navPill.classList.remove("animate-in");
        }
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Apply initial state
  onScroll();
}

/* === GitHub Projects === */
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", C: "#555555",
  "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8", Java: "#b07219",
};

const FEATURED_REPOS = [
  { name: "SrP-CFG_ForCS2", image: "https://cdn.jsdelivr.net/gh/RolinShmily/SrP-CFG_ForCS2@main/app/shared/images/desktop-1.png" },
  { name: "SrP-IMG", image: "https://cdn.jsdelivr.net/gh/RolinShmily/SrP-IMG@main/preview.png" },
  { name: "porter-skill", image: "https://opengraph.githubassets.com/1/RolinShmily/porter-skill" },
  { name: "20-Fruit_Recognition_System", image: "https://opengraph.githubassets.com/1/RolinShmily/20-Fruit_Recognition_System" },
];

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? url : "";
  } catch { return ""; }
}


async function initWorks() {
  const container = document.getElementById("featured-projects");
  if (!container) return;

  showLoading(container);

  const results = await Promise.all(
    FEATURED_REPOS.map(spec => fetchRepo(spec.name))
  );

  const repos = results.filter(Boolean);

  if (repos.length === 0) {
    showError(container);
    return;
  }

  renderFeatured(repos);
}

function showLoading(container) {
  container.innerHTML = '<div class="works-status works-loading">Loading works…</div>';
}

function showError(container) {
  container.innerHTML =
    '<div class="works-status works-error">Failed to load works. ' +
    '<button onclick="initWorks()" class="retry-btn">Retry</button></div>';
}

async function fetchWithTimeout(url, opts = {}, timeout = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRepo(name, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(`/api/github/${name}`);
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      console.warn(`GitHub proxy fetch failed for ${name} (attempt ${attempt + 1}):`, e);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  return null;
}

function renderFeatured(repos) {
  const el = document.getElementById("featured-projects");
  if (!el || !repos.length) return;
  el.innerHTML = repos.map((repo) => {
    const spec = FEATURED_REPOS.find(r => r.name === repo.name);
    const imageUrl = spec ? spec.image : "";
    const homepage = safeUrl(repo.homepage);
    return `
    <div class="featured-card">
      <div class="featured-preview">
        <img src="${esc(imageUrl)}" alt="${esc(repo.name)}" loading="lazy">
      </div>
      <div class="featured-info">
        <span class="featured-label">Featured Project</span>
        <h3 class="featured-name"><a href="${esc(repo.html_url)}" target="_blank" rel="noopener">${esc(repo.name)}</a></h3>
        <p class="featured-desc">${esc(repo.description || "")}</p>
        <div class="featured-tags">
          ${(repo.topics || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
          ${repo.language ? `<span class="tag">${esc(repo.language)}</span>` : ""}
        </div>
        <div class="featured-meta">
          <span><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg> ${repo.stargazers_count}</span>
          ${homepage ? `<a href="${esc(homepage)}" target="_blank" rel="noopener" style="color:var(--accent-bright)">Website</a>` : ""}
        </div>
      </div>
    </div>`;
  }).join("");
  el.querySelectorAll(".featured-preview img").forEach((img) => {
    img.addEventListener("error", () => {
      img.parentElement.innerHTML = '<span style="color:var(--text-secondary)">Preview</span>';
    });
  });
}

function renderProjectGrid(repos) {
  const el = document.getElementById("project-grid");
  if (!el) return;
  el.innerHTML = repos
    .map(
      (r) => `
    <a href="${esc(r.html_url)}" target="_blank" rel="noopener" class="card project-card reveal">
      <h4 class="project-card-name">${esc(r.name)}</h4>
      <p class="project-card-desc">${esc(r.description || "No description.")}</p>
      <div class="project-card-meta">
        ${r.language ? `<span><span class="lang-dot" style="background:${LANG_COLORS[r.language] || "#ccc"}"></span>${esc(r.language)}</span>` : ""}
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
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  el.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
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

/* === Brand 3D Kinetic Canvas Effect (RoL1n SrP) === */
function initBrandCanvas() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");

  const BRAND_TEXT = "RoL1n SrP";

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
    offCtx.font = `900 ${fontSize}px "Maple Mono NF CN", "Maple Mono SC NF", "Maple Mono CN", "Maple Mono", "Public Sans", "Inter", "Noto Sans SC", system-ui, sans-serif`;

    // Adjust font size to fit width constraint
    let textMetrics = offCtx.measureText(BRAND_TEXT);
    const maxTextWidth = width * 0.92;
    if (textMetrics.width > maxTextWidth) {
      fontSize = fontSize * (maxTextWidth / textMetrics.width);
      offCtx.font = `900 ${fontSize}px "Maple Mono NF CN", "Maple Mono SC NF", "Maple Mono CN", "Maple Mono", "Public Sans", "Inter", "Noto Sans SC", system-ui, sans-serif`;
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

  function startAnimation() {
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
}

