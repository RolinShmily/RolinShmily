// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initParticles();
  initScrollReveal();
  initTypewriter();
  initProjects();
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

/* === GitHub Projects === */
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", C: "#555555",
  "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8", Java: "#b07219",
};

const FEATURED_NAME = "SrP-CFG_ForCS2";
const FEATURED_IMAGE = "https://cdn.jsdelivr.net/gh/RolinShmily/SrP-CFG_ForCS2@refs/heads/main/app/website/public/image.png";

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

async function initProjects() {
  const repos = await fetchRepos();
  if (!repos) {
    const grid = document.getElementById("project-grid");
    if (grid) grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center">Unable to load projects.</p>';
    return;
  }

  const featured = repos.find((r) => r.name === FEATURED_NAME);
  const others = repos.filter((r) => r.name !== FEATURED_NAME);

  if (featured) renderFeatured(featured);
  renderProjectGrid(others);
}

async function fetchRepos() {
  try {
    const cached = sessionStorage.getItem("gh-repos");
    if (cached) return JSON.parse(cached);
  } catch { /* corrupted cache, re-fetch */ }

  try {
    const res = await fetch(
      "https://api.github.com/users/RolinShmily/repos?sort=stars&per_page=10&direction=desc",
      { headers: { Accept: "application/vnd.github.v3+json" } }
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
  const homepage = safeUrl(repo.homepage);
  el.innerHTML = `
    <div class="featured-card">
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
      <div class="featured-preview">
        <img src="${FEATURED_IMAGE}" alt="${esc(repo.name)}" loading="lazy">
      </div>
    </div>
  `;
  const img = el.querySelector(".featured-preview img");
  if (img) {
    img.addEventListener("error", () => {
      img.parentElement.innerHTML = '<span style="color:var(--text-secondary)">Preview</span>';
    });
  }
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
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  el.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}
