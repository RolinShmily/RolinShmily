# Third-Party Notices

This project (the source of <https://www.srprolin.top>, plus the GitHub profile README
that lives beside it) incorporates the third-party software and artwork listed below.
This file records the attribution and license terms that those licenses require us to
reproduce and pass on to anyone who receives the site.

## License scope

**First-party source code in this repository is released under the [MIT License](LICENSE)**
(Copyright © 2026 RoL1n_SrP). "First-party source code" means the code written for this
project:

| Covered by the repository's MIT License |
| --- |
| `index.html`, `css/`, `worker/`, `scripts/` |
| `js/*.js` — `main.js`, `motion.js`, `brand-canvas.js`, `pixel-avatar.js` |
| Build configuration — `package.json`, `wrangler.toml`, `tsconfig.json`, `.github/workflows/` |

**The MIT License does not extend to the following**, and nothing in it should be read as
granting rights over them:

| Not covered | Why |
| --- | --- |
| Third-party components in [Redistributed components](#redistributed-components) | Each stays under its own license (MIT, OFL 1.1, CC BY 4.0) as recorded below |
| Personal branding and artwork — `assets/avatar.jpg`, `assets/works/*.webp`, `assets/badges/*.svg`, the name and likeness used across the site and README | A software license is not a grant of rights over a person's name, likeness, or presentation material |
| `assets/foot-icp.png` | The badge published by 工信部 for ICP filing display; use is governed by the filing rules, not by this repository |
| `README.md` and the site's written content | Personal profile copy, published for reading rather than for reuse as a template |
| Generated artifacts — `stats/*.svg`, `output` branch | Machine output of third-party actions (see [below](#generated-artifacts)) |

Third-party **trademarks and brand marks** (GitHub, Bilibili, Steam, QQ, Douyin, and the
rest) belong to their respective owners. The page uses them only to link to the author's
own accounts on those platforms — nominative use, not an endorsement or a claim of
affiliation.

## What actually gets redistributed

Only two categories of dependency leave the build machine and reach a visitor, so only
they carry attribution obligations:

| Category | What it is | Redistributed? |
| --- | --- | --- |
| Bundled code | three.js, shipped as `js/vendor/three.module.min.js` | Yes — served to every visitor |
| Bundled assets | Three variable webfonts (`fonts/files/*.woff2`) and the SVG icons committed under `assets/svg/` and inlined in `index.html` | Yes — served to every visitor |
| Build-time only | The toolchain (esbuild, TypeScript, Wrangler, …) | No — never enters the deployed artifact |

`fonts/` and `js/vendor/` are generated at build time and are not committed to git; see
[Build outputs](#build-outputs). Both are rebuilt by CI before every deploy, from the
exact revisions pinned in `package.json` and `package-lock.json`.

## Redistributed components

### three.js

| | |
| --- | --- |
| Version | `0.169.0` (r169), pinned exactly in `package.json` |
| License | MIT |
| Copyright | © 2010-2024 three.js authors |
| Used by | `js/pixel-avatar.js` (the 3D avatar card) |
| Shipped as | `js/vendor/three.module.min.js` |
| License text | [`licenses/three.js-MIT.txt`](licenses/three.js-MIT.txt) |
| Upstream | <https://github.com/mrdoob/three.js> |

MIT requires the copyright notice and permission notice to be included in all copies or
substantial portions of the software. `scripts/build-vendor.mjs` therefore bundles with
esbuild's `legalComments: "inline"`, which keeps the `@license` banner at the top of the
minified bundle:

```
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
```

Do not change that option — minifying away the banner would put the deployed bundle out
of compliance.

### Webfonts

The site self-hosts its fonts rather than calling Google Fonts, because
`fonts.googleapis.com` is unreliable from mainland China. The WOFF2 slices are copied
verbatim from the `@fontsource-variable/*` packages (`scripts/build-fonts.mjs`) and are
derived from the corresponding upstream font projects.

| Font | Package | Version | License | License text |
| --- | --- | --- | --- | --- |
| Inter Variable | `@fontsource-variable/inter` | `5.3.0` | SIL OFL 1.1 | [`licenses/fonts/inter-OFL-1.1.txt`](licenses/fonts/inter-OFL-1.1.txt) |
| JetBrains Mono Variable | `@fontsource-variable/jetbrains-mono` | `5.3.0` | SIL OFL 1.1 | [`licenses/fonts/jetbrains-mono-OFL-1.1.txt`](licenses/fonts/jetbrains-mono-OFL-1.1.txt) |
| Noto Sans SC Variable | `@fontsource-variable/noto-sans-sc` | `5.3.0` | SIL OFL 1.1 | [`licenses/fonts/noto-sans-sc-OFL-1.1.txt`](licenses/fonts/noto-sans-sc-OFL-1.1.txt) |

Copyright notices, as stated by each upstream project:

- Inter — Copyright 2016 The Inter Project Authors (<https://github.com/rsms/inter>)
- JetBrains Mono — Copyright 2020 The JetBrains Mono Project Authors
  (<https://github.com/JetBrains/JetBrainsMono>)
- Noto Sans SC — Copyright Google Inc. (<https://github.com/notofonts/noto-cjk>)

OFL 1.1 obligations and how they are met here:

- **The license text travels with the font.** Each `licenses/fonts/*.txt` file is the
  complete OFL 1.1 text as published with that font, including its copyright line. These
  files sit next to the source that produces the WOFF2 slices and are served alongside
  the site.
- **No font is sold on its own.** The fonts are embedded in the page's own styling and
  are not distributed as standalone products.
- **No Reserved Font Names are declared** by any of the three upstream projects (verified:
  none of the three license files contains a `with Reserved Font Name` clause), so
  referring to the families by name — as `fonts/fonts.css` does — is permitted.
- **No glyph outlines were modified.** The slices are byte-for-byte copies of the
  upstream releases; the only edit in the pipeline touches the deprecated
  `format('woff2-variations')` keyword in the generated CSS, not any font binary.

### SVG icons

The icons are the easiest thing in this repository to lose track of, because the same
artwork exists twice: as standalone files under `assets/svg/` and inlined into the
`<svg class="svg-sprite">` block in `index.html`. For the four platform marks the two
copies were verified to be byte-identical path data.

| Icon(s) | Upstream | License | Copyright | Where |
| --- | --- | --- | --- | --- |
| `blog-solid-full`, `envelope-solid-full`, `shield-heart-solid-full`, `github-brands-solid-full`, `qq-brands-solid-full`, `steam-brands-solid-full`, `tiktok-brands-solid-full` | Font Awesome Free `7.2.0` | Icons: CC BY 4.0 · Code: MIT · Fonts: OFL 1.1 | Copyright 2026 Fonticons, Inc. | `assets/svg/*.svg` |
| Same artwork again, as `icon-github`, `icon-qq`, `icon-steam`, `icon-douyin` | Font Awesome Free `7.2.0` | as above | as above | inlined in `index.html` (path data verified identical to the files above) |
| `bilibili` | Lobe Icons (`@lobehub/icons`) | MIT | Copyright © 2023 LobeHub | `assets/svg/bilibili.svg` and inlined as `icon-bilibili` |
| `icon-arrow-out` | [Feather](https://github.com/feathericons/feather) `arrow-up-right` geometry (`<line>` + `<polyline points="7 7 17 7 17 17"/>`) | MIT | Copyright © 2013-2023 Cole Bemis | inlined in `index.html` |

License texts: [`licenses/fontawesome-free.txt`](licenses/fontawesome-free.txt) ·
[`licenses/lobe-icons-MIT.txt`](licenses/lobe-icons-MIT.txt) ·
[`licenses/feather-icons-MIT.txt`](licenses/feather-icons-MIT.txt)

Notes on how those terms are met:

- **Font Awesome (CC BY 4.0).** Each standalone file under `assets/svg/` carries Font
  Awesome's attribution comment — `<!--!Font Awesome Free 7.2.0 by @fontawesome - …-->` —
  and that comment must be left in place; stripping it would remove the attribution the
  license relies on. The four inlined copies in `index.html` **do not** carry it (the
  sprite is bare `<path>` data), so attribution for those is provided by this file
  instead, which CC BY 4.0 permits as long as attribution is given "in any reasonable
  manner" and the license is linked. If you want the in-page copies to be self-attributing
  as well, paste the same comment above each `<symbol>`.
- **CC BY 4.0 allows modification**, but any modified icon must be marked as changed.
  Nothing has been modified except `fill="currentColor"` substitution, which is how the
  icons inherit CSS color and is not a change to the artwork.
- **Brand marks are trademarks.** The GitHub / Bilibili / Steam / QQ / Douyin glyphs are
  used solely to label links to the author's own profiles. That use is independent of the
  icon license and is not granted by it.

#### Open item: two icons with unconfirmed provenance

`icon-arrow-right` and `icon-envelope` in the `index.html` sprite match no upstream icon
set byte-for-byte. Both are filled paths drawn on a 20-unit grid and placed unchanged in a
24-unit `viewBox`, which is structurally the same as Heroicons v2's `20/solid` family
(MIT, Copyright © Tailwind Labs) — e.g. `icon-arrow-right` is
`M12.293 5.293a1 1 0 0 1 1.414 0l6 6…` versus Heroicons' own `M10.293 3.293a1 1 0 0 1
1.414 0l6 6…` for `20/solid arrow-right`. That similarity suggests they were adapted from
Heroicons or hand-authored in the same idiom, but neither case is proven, and they carry
no embedded notice.

They are 24-pixel UI glyphs (an arrow and a mail icon) with no distinctive authorship, so
the practical risk is negligible — but this is recorded rather than assumed. To close it:
either confirm the source and add it to the table above, or replace them with the
equivalent Font Awesome icons already vendored in `assets/svg/`, which would collapse the
unknown to a known license.

## Build-time-only toolchain

These packages run during `npm ci` / `npm run build` and on CI. They are not bundled,
minified, or copied into anything the site serves, so their notices need not ship with
the deployed artifact — they are listed here for transparency and supply-chain review.
Each package's full license text is present in its own directory under `node_modules/`
after installation.

| Package | Version | License (SPDX) |
| --- | --- | --- |
| `@cloudflare/workers-types` | `5.20260920.1` | MIT OR Apache-2.0 |
| `@fontsource-variable/*` | `5.3.0` | OFL-1.1 |
| `esbuild` | `0.28.2` (+ `0.28.1` under `wrangler`) | MIT |
| `three` | `0.169.0` | MIT |
| `typescript` | `7.0.2` | Apache-2.0 |
| `wrangler` | `4.135.0` | MIT OR Apache-2.0 |
| `sharp` / `@img/*` (via `wrangler` → `miniflare`) | `0.35.4` / `1.3.3` | Apache-2.0 AND LGPL-3.0-or-later |
| `miniflare`, `unenv`, `undici`, `ws`, `youch`, and other transitive `wrangler` deps | locked in `package-lock.json` | MIT, Apache-2.0, ISC, 0BSD, CC0-1.0 |

The complete resolved set — names, exact versions and SPDX identifiers — can be read
from `package-lock.json`, or produced with `npm ls --all`.

## Generated artifacts

Committed machine output that is produced by third-party tooling. These are data, not
library code, so no license text is redistributed with them; the tools are recorded so the
provenance of the files is traceable.

| Artifact | Produced by | License of the tool |
| --- | --- | --- |
| `stats/stats.svg`, `stats/top-langs.svg` | `.github/workflows/stats-cards.yml` → `readme-tools/github-readme-stats-action@v2` | MIT |
| `github-contribution-grid-snake(-dark).svg` on the `output` branch | `.github/workflows/snake.yml` → `Platane/snk@v3`, published with `crazy-max/ghaction-github-pages` | MIT |
| `assets/badges/*.svg` | Generated with [shields.io](https://shields.io) and committed as static files | CC0-1.0 |
| `assets/avatar.jpg`, `assets/works/*.webp` | First-party — the author's own artwork and screenshots of his own projects | Not licensed via MIT; see [License scope](#license-scope) |

## Third-party services referenced by the page

Not code dependencies and no license is involved, but they are external parties the
deployed page or README talks to. Noted so the list stays honest:

| Service | Where |
| --- | --- |
| `count.getloli.com` | Visitor counter image in the site footer |
| `img.srprolin.top` | Image host for the site's own assets |
| `wakatime.com`, `readme-typing-svg.demolab.com`, `raw.githubusercontent.com` | External images referenced by `README.md` |

## Build outputs

Both redistributed component sets are generated and git-ignored, so they exist only in a
working tree or in the deployed artifact:

| Output | Produced by | Input |
| --- | --- | --- |
| `js/vendor/three.module.min.js` | `scripts/build-vendor.mjs` (`npm run build:vendor`) | `three` from `node_modules` |
| `fonts/fonts.css`, `fonts/files/*.woff2` | `scripts/build-fonts.mjs` (`npm run build:fonts`) | `@fontsource-variable/*` from `node_modules` |

Run `npm run build` before deploying from a fresh checkout; `.github/workflows/deploy.yml`
does exactly that.

## Updating this file

When a redistributed dependency is added, removed, or upgraded:

1. Update the relevant row (name, version, license, copyright).
2. If its license text changed, replace the file in `licenses/`.
3. If a new license family appears, add its full text under `licenses/` and link it above.

Note that icon sources are not tracked by any lockfile — nothing will warn you when a new
`assets/svg/*.svg` appears or when an inline sprite icon changes. Re-check the
[SVG icons](#svg-icons) table by hand whenever icons are added or replaced, and keep the
standalone files and the inlined sprite in sync.

Keep this file and `licenses/` in sync with `package.json` — a version bump that skips
this file is an attribution bug, not a documentation chore.
