# Third-Party Notices

This repository is the source of <https://www.srprolin.top> and of the GitHub profile of
the same name. It incorporates the third-party software and artwork declared below. This
file states the copyright and license of each component, and defines the scope of the
repository's own license.

**License texts are referenced by their official URL rather than copied into this
repository.** The upstream license files linked in the tables are the authoritative texts.
Where a license requires its text to travel with the distributed copy of the work — SIL
OFL 1.1 does this for the webfonts — that requirement is met only if those texts are also
served alongside the site; see [License obligations](#license-obligations).

## Contents

- [1. License scope of this repository](#1-license-scope-of-this-repository)
- [2. Components redistributed with the site](#2-components-redistributed-with-the-site)
- [3. Build-time-only toolchain](#3-build-time-only-toolchain)
- [4. Generated artifacts](#4-generated-artifacts)
- [5. Third-party services referenced by the page](#5-third-party-services-referenced-by-the-page)
- [6. Maintaining this file](#6-maintaining-this-file)

## 1. License scope of this repository

The repository's own license is **MIT** ([`LICENSE`](LICENSE), Copyright © 2026
RoL1n_SrP), and it covers the first-party source code of this project:

| Covered by the repository's MIT License |
| --- |
| `index.html`, `css/`, `worker/`, `scripts/` |
| `js/*.js` — `main.js`, `motion.js`, `brand-canvas.js`, `pixel-avatar.js` |
| Build configuration — `package.json`, `wrangler.toml`, `tsconfig.json`, `.github/workflows/` |

It **does not** extend to the following, and nothing in it should be read as granting
rights over them:

| Not covered | Why |
| --- | --- |
| Third-party components in [section 2](#2-components-redistributed-with-the-site) | Each remains under its own license, as declared below |
| Personal branding and artwork — `assets/avatar.jpg`, `assets/works/*.webp`, `assets/badges/*.svg`, and the name, likeness and writing used across the site and README | A software license is not a grant of rights over a person's name, likeness, or presentation material |
| `assets/foot-icp.png` | The badge published by 工信部 for ICP filing display; its use is governed by the filing rules, not by this repository |
| `README.md` and the site's written content | Personal profile copy, published for reading rather than for reuse as a template |
| Generated artifacts — `stats/*.svg`, the `output` branch | Machine output of third-party actions; see [section 4](#4-generated-artifacts) |

Trademarks and brand marks (GitHub, Bilibili, Steam, QQ, Douyin, and others) belong to
their respective owners. They are used here only to label links to the author's own
accounts — nominative use, not endorsement or affiliation.

## 2. Components redistributed with the site

These leave the build machine and reach a visitor, so their terms apply to the deployed
artifact. Versions follow `package.json` / `package-lock.json`.

### 2.1 three.js — bundled code

| | |
| --- | --- |
| Version | `0.169.0` (r169), pinned exactly in `package.json` |
| License | MIT |
| Copyright | © 2010-2024 three.js authors |
| License text | <https://github.com/mrdoob/three.js/blob/dev/LICENSE> |
| Used by | `js/pixel-avatar.js` (the 3D avatar card) |
| Shipped as | `js/vendor/three.module.min.js` |

`scripts/build-vendor.mjs` bundles with esbuild's `legalComments: "inline"`, which keeps
the `@license` banner at the top of the minified bundle:

```
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
```

Do not change that option — minifying away the banner would drop the copyright notice
from the deployed file.

### 2.2 Webfonts — SIL OFL 1.1

The site self-hosts its fonts instead of calling Google Fonts, because
`fonts.googleapis.com` is unreliable from mainland China. `scripts/build-fonts.mjs` copies
the WOFF2 slices verbatim from the `@fontsource-variable/*` packages into `fonts/files/`.

| Font | Package @ version | License | Copyright | License text |
| --- | --- | --- | --- | --- |
| Inter Variable | `@fontsource-variable/inter` @ `5.3.0` | SIL OFL 1.1 | 2016 The Inter Project Authors | <https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt> |
| JetBrains Mono Variable | `@fontsource-variable/jetbrains-mono` @ `5.3.0` | SIL OFL 1.1 | 2020 The JetBrains Mono Project Authors | <https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt> |
| Noto Sans SC Variable | `@fontsource-variable/noto-sans-sc` @ `5.3.0` | SIL OFL 1.1 | Google Inc. | <https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE> |

Canonical OFL 1.1 text: <https://scripts.sil.org/OFL>

### 2.3 SVG icons

The same artwork exists twice — as files under `assets/svg/` and inlined into the
`<svg class="svg-sprite">` block in `index.html`. For the four platform marks the two
copies were verified to be byte-identical path data.

| Icon(s) | Version / source | License | Copyright | License text |
| --- | --- | --- | --- | --- |
| `blog-solid-full`, `envelope-solid-full`, `shield-heart-solid-full`, `github-brands-solid-full`, `qq-brands-solid-full`, `steam-brands-solid-full`, `tiktok-brands-solid-full` | Font Awesome Free `7.2.0` | Icons CC BY 4.0 · Fonts OFL 1.1 · Code MIT | 2026 Fonticons, Inc. | <https://fontawesome.com/license/free> · <https://creativecommons.org/licenses/by/4.0/> |
| `bilibili` (file + inlined as `icon-bilibili`) | Lobe Icons (`@lobehub/icons`) | MIT | © 2023 LobeHub | <https://github.com/lobehub/lobe-icons/blob/master/LICENSE> |
| `icon-arrow-out` (inlined only) | Feather `arrow-up-right` geometry | MIT | © 2013-2023 Cole Bemis | <https://github.com/feathericons/feather/blob/main/LICENSE> |

Two details that are easy to lose:

- **The Font Awesome attribution comments must stay.** Every standalone file under
  `assets/svg/` carries `<!--!Font Awesome Free 7.2.0 by @fontawesome - …-->`; that
  comment is the attribution CC BY 4.0 relies on. The four inlined copies in `index.html`
  do **not** carry it, so their attribution is provided by this file instead — which
  CC BY 4.0 permits, provided the license is linked, as it is above. To make the inlined
  copies self-attributing too, paste the same comment above each `<symbol>`.
- **Open item.** `icon-arrow-right` and `icon-envelope` in the `index.html` sprite match no
  upstream icon set byte-for-byte. Both are filled 20-unit-grid paths placed unchanged in a
  24-unit `viewBox`, which is structurally Heroicons v2's `20/solid` family (MIT,
  © Tailwind Labs) but is not the same path data, and they carry no embedded notice. They
  are plain 24-pixel UI glyphs with no distinctive authorship, so the practical risk is
  negligible — recorded rather than assumed. To close it, either confirm the source or
  replace them with the Font Awesome equivalents already vendored in `assets/svg/`.

### License obligations

| License | Obligation | How it is met |
| --- | --- | --- |
| MIT (three.js) | Copyright and permission notice included in all copies | The `@license` banner is baked into the minified bundle by `legalComments: "inline"`; the full text is linked above |
| MIT (Lobe Icons, Feather) | Same | Declared in this file, which is served with the site |
| SIL OFL 1.1 (three webfonts) | License text distributed with the font; no Reserved Font Names misused; fonts not sold on their own | **Text is linked, not shipped** — see the note below. No Reserved Font Name is declared by any of the three projects (verified: none of their license files contains a `with Reserved Font Name` clause), and the fonts are embedded in the page's styling rather than distributed as standalone products |
| CC BY 4.0 (Font Awesome icons) | Attribution + link to the license | Attribution and license link are in this file; the embedded comments in `assets/svg/*.svg` carry it a second time in-file |

Two facts about the font pipeline that matter for OFL: the WOFF2 slices are byte-for-byte
copies of the upstream releases (**no glyph outlines were modified**), and the only edit in
the pipeline normalises the deprecated `format('woff2-variations')` keyword in the
generated CSS, never a font binary.

**Known gap, stated plainly:** OFL 1.1 asks that the license text be distributed together
with the font, and this repository links to the text instead of shipping it. Nothing in the
deployed artifact reproduces it. If verbatim compliance is wanted later, serve the upstream
license files from this origin (for example under `/licenses/`) and point the table above
at those paths.

## 3. Build-time-only toolchain

These run during `npm ci` / `npm run build` and on CI. Nothing here is bundled, minified,
or copied into a served file, so no notice needs to accompany the deployed artifact. Each
package's own license text ships inside its directory under `node_modules/`.

| Package | Version | License (SPDX) |
| --- | --- | --- |
| `@cloudflare/workers-types` | `5.20260920.1` | MIT OR Apache-2.0 |
| `@fontsource-variable/*` | `5.3.0` | OFL-1.1 |
| `esbuild` | `0.28.2` (+ `0.28.1` under `wrangler`) | MIT |
| `three` | `0.169.0` | MIT |
| `typescript` | `7.0.2` | Apache-2.0 |
| `wrangler` | `4.135.0` | MIT OR Apache-2.0 |
| `sharp` / `@img/*` (via `wrangler` → `miniflare`) | `0.35.4` / `1.3.3` | Apache-2.0 AND LGPL-3.0-or-later |
| `miniflare`, `unenv`, `undici`, `ws`, `youch`, and the remaining transitive `wrangler` deps | locked in `package-lock.json` | MIT, Apache-2.0, ISC, 0BSD, CC0-1.0 |

The complete resolved set — names, exact versions, SPDX identifiers — is in
`package-lock.json`, or via `npm ls --all`.

## 4. Generated artifacts

Committed machine output produced by third-party tooling. These are data rather than
library code, so no license text is redistributed with them; the tools are recorded so the
provenance of each file stays traceable.

| Artifact | Produced by | Tool license |
| --- | --- | --- |
| `stats/stats.svg`, `stats/top-langs.svg` | `.github/workflows/stats-cards.yml` → `readme-tools/github-readme-stats-action@v2` | MIT |
| `github-contribution-grid-snake(-dark).svg` on the `output` branch | `.github/workflows/snake.yml` → `Platane/snk@v3`, published with `crazy-max/ghaction-github-pages` | MIT |
| `assets/badges/*.svg` | Generated with [shields.io](https://shields.io) and committed as static files | CC0-1.0 |
| `assets/avatar.jpg`, `assets/works/*.webp` | First-party — the author's own artwork and screenshots of his own projects | Not licensed via MIT; see [section 1](#1-license-scope-of-this-repository) |

## 5. Third-party services referenced by the page

Not code dependencies, and no license is involved, but they are external parties the
deployed page or README talks to:

| Service | Where |
| --- | --- |
| `count.getloli.com` | Visitor counter image in the site footer |
| `img.srprolin.top` | Image host for the site's own assets |
| `wakatime.com`, `readme-typing-svg.demolab.com`, `raw.githubusercontent.com` | External images referenced by `README.md` |

## 6. Maintaining this file

When a redistributed dependency is added, removed, or upgraded:

1. Update its row — name, version, license, copyright, and the license URL.
2. Re-check the [license obligations](#license-obligations) table if the license family
   changed.

Two things no tool will warn you about:

- **Icon sources are not tracked by any lockfile.** Nothing detects a new
  `assets/svg/*.svg`, and nothing detects an inline sprite icon changing. Re-check
  [section 2.3](#23-svg-icons) by hand whenever icons are added or replaced, and keep the
  standalone files and the inlined sprite in sync.
- **A version bump in `package.json` that skips this file is an attribution bug**, not a
  documentation chore.
