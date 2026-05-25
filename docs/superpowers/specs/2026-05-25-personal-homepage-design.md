# Personal Homepage Design Spec

## Overview

Create a standalone personal homepage (`index.html`) for deployment on a custom domain (e.g. srprolin.top). The page uses a single-page scrolling layout with ACG anime-inspired dark theme, featuring social links, site aggregation, project showcase, experience timeline, and personal interests.

**Constraints:**
- Do NOT modify `assets/`, `stats/`, or `README.md`
- Pure HTML / CSS / JS / SVG — no frameworks
- The existing GitHub Profile README remains independent

## File Structure

```
D:\GitHub\RolinShmily\
├── assets/              (untouched)
├── stats/               (untouched)
├── README.md            (untouched)
├── index.html           ← new: main page
├── css/
│   └── style.css        ← new: all styles
└── js/
    └── main.js          ← new: interactions, API, animations
```

## Color Scheme (ACG Dark)

| Role | Color | Hex |
|------|-------|-----|
| Page background | Deep purple-black | `#0f0a1a` |
| Card background | Semi-transparent purple | `rgba(30, 20, 50, 0.7)` |
| Primary accent | Sakura pink | `#f75c7e` |
| Secondary accent | Violet | `#7c3aed` |
| Gradient | Pink → Violet | `linear-gradient(135deg, #f75c7e, #7c3aed)` |
| Primary text | Warm white | `#e8e0f0` |
| Secondary text | Gray-purple | `#a09bb5` |
| Link / hover | Bright pink | `#ff7eb3` |

## Typography

- **Headings / emphasis:** `"Noto Sans SC", "PingFang SC", sans-serif`
- **Body:** `"Noto Sans SC", system-ui, sans-serif`
- **Code / terminal:** `"JetBrains Mono", "Cascadia Code", monospace`

## Global Animations

- **Falling particles:** Canvas-rendered semi-transparent music notes / stars drifting from top. Non-intrusive, low opacity, does not block interaction.
- **Scroll reveal:** Sections fade-in + translate-up on entering viewport via Intersection Observer.
- **Card hover:** Slight lift + pink-purple gradient glow border.

## Sections

### 1. Hero

- **Background:** Deep purple-black gradient with subtle starfield particle effect.
- **Content:**
  - Avatar placeholder (SVG circle with gradient border, replaceable with image later)
  - Name "RoL1n_SrP" with typewriter animation
  - Subtitle: "Entities should not be multiplied unnecessarily."
  - Social icon row: Blog / Email / Bilibili / Steam / GitHub (reuse links from existing badges in README)
  - Animated downward scroll indicator (bouncing chevron)
- **Height:** Full viewport

### 2. Sites (Navigation Aggregation)

- **Title:** "Sites" with small ACG decorative accent
- **Layout:** CSS Grid, 2-3 columns responsive
- **Cards:**
  - SrP-BloG (blog.srprolin.top)
  - SrP-CFG_ForCS2 (cfg.srprolin.top)
  - GitHub (github.com/RolinShmily)
  - Steam profile
  - Bilibili space
- **Each card:** SVG icon + site name + short description + hover glow effect

### 3. Projects

- **Title:** "Projects"
- **Data source:** GitHub API — `GET https://api.github.com/users/RolinShmily/repos?sort=stars&per_page=10`
- **Layout:**
  - Featured project (SrP-CFG_ForCS2): full-width large card with screenshot placeholder, description, tech tags, star count, release link
  - Remaining projects: 3-column grid cards showing name, description, language, stars
- **Interaction:** Click opens GitHub repo page
- **Fallback:** Static cards if API request fails (rate limit / offline)
- **Caching:** sessionStorage cache to avoid repeated API calls

### 4. Timeline

- **Title:** "Timeline"
- **Layout:** Vertical timeline, alternating left-right entries
- **Node style:** Gradient dot + connecting vertical line
- **Content (editable by user):**
  - Education / school info
  - Technical milestones
  - Project launches
  - Competitions / certificates
- **Data:** Hardcoded array in `main.js` for easy editing

### 5. About / Interests

- **Terminal card:** Embed `assets/svg/terminal.svg` directly in an SVG container, preserving its Catppuccin Mocha style as a design contrast element
- **Interest tag cloud:**
  - ACG: 孤独摇滚, Girls Band Cry, 轻音少女, BangDream
  - Arch Linux: Bash, Zsh, Fastfetch, Btop, SSH
  - Guitar: ESP, Gibson, Fender, PRS
  - Games: Minecraft, CS2, CS:GO
- **Tags:** Rounded pill badges with gradient borders, slight hover animation

### 6. Footer

- Copyright text + GitHub repo link
- Visitor counter (reuse getloli.com counter from README)

## Responsive Design

- **Desktop (>1024px):** Full grid layouts, left-right timeline
- **Tablet (768-1024px):** 2-column grids, timeline switches to single-side
- **Mobile (<768px):** Single column, hamburger nav menu, simplified animations

## Navigation

- Sticky top bar with semi-transparent glassmorphism background
- Links: Home / Sites / Projects / Timeline / About
- Smooth scroll on click
- Active section highlighted based on scroll position
- Mobile: hamburger menu toggle

## GitHub API Integration

```js
// Endpoint
GET https://api.github.com/users/RolinShmily/repos?sort=stars&per_page=10

// Response fields used
- name, description, html_url, language, stargazers_count, topics, homepage

// Featured project: SrP-CFG_ForCS2 (match by name)
// Fallback: static JSON if fetch fails
// Cache: sessionStorage, key "gh-repos", TTL: 1 session
```

## Performance Considerations

- Canvas particle animation uses `requestAnimationFrame` with low particle count (~30)
- Images lazy-loaded with `loading="lazy"`
- GitHub API response cached in sessionStorage
- CSS animations preferred over JS where possible (transforms, opacity)
- External fonts loaded via Google Fonts with `display=swap`
