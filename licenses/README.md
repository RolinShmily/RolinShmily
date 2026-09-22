# `licenses/`

Verbatim license texts for the third-party components that this site **redistributes** —
code, font binaries and icon artwork that are bundled into the deployed page and
therefore reach every visitor.

The component-to-license mapping, versions, copyright holders, and the reasoning behind
what is and is not covered live in [`../THIRD_PARTY_NOTICE.md`](../THIRD_PARTY_NOTICE.md).
The repository's own MIT License — which applies to the first-party source only — is
[`../LICENSE`](../LICENSE).

| File | Applies to | Required because |
| --- | --- | --- |
| `three.js-MIT.txt` | three.js `0.169.0`, bundled into `js/vendor/three.module.min.js` | MIT requires the notice to accompany copies of the software |
| `fonts/inter-OFL-1.1.txt` | Inter Variable, sliced into `fonts/files/*.woff2` | SIL OFL 1.1 requires the license text to travel with the font |
| `fonts/jetbrains-mono-OFL-1.1.txt` | JetBrains Mono Variable, same | same |
| `fonts/noto-sans-sc-OFL-1.1.txt` | Noto Sans SC Variable, same | same |
| `fontawesome-free.txt` | Font Awesome Free `7.2.0` icons under `assets/svg/` and inlined in `index.html` | Icons are CC BY 4.0, which requires attribution and a link to the license |
| `lobe-icons-MIT.txt` | the Bilibili icon (`assets/svg/bilibili.svg`, `icon-bilibili`) | MIT requires the notice to accompany copies |
| `feather-icons-MIT.txt` | the `icon-arrow-out` geometry in `index.html` | MIT requires the notice to accompany copies |

Provenance of each file, so the reproduction can be re-checked rather than trusted:

| File | Copied from |
| --- | --- |
| `three.js-MIT.txt` | `node_modules/three/LICENSE` |
| `fonts/*-OFL-1.1.txt` | `node_modules/@fontsource-variable/*/LICENSE` |
| `fontawesome-free.txt` | <https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.x/LICENSE.txt> |
| `lobe-icons-MIT.txt` | <https://raw.githubusercontent.com/lobehub/lobe-icons/master/LICENSE> |
| `feather-icons-MIT.txt` | <https://raw.githubusercontent.com/feathericons/feather/main/LICENSE> |

All are copied unchanged, byte for byte, rather than transcribed. The two `*-OFL-1.1.txt`
files are stored per font because OFL requires the license text to be preceded by that
project's own copyright line — a single shared OFL copy would not satisfy that pairing.

Two consequences worth knowing:

- **`fontawesome-free.txt` is a bundle of three licenses.** Font Awesome Free splits by
  asset type — CC BY 4.0 for the SVG icons, SIL OFL 1.1 for the font files, MIT for the
  code. Only the first applies to what this site uses, but the whole file is kept so the
  split is visible instead of paraphrased. CC BY 4.0 itself is linked rather than
  reproduced, which is what that license asks for.
- **MIT files are not identical to each other.** They differ only in the copyright line,
  which is exactly the part MIT requires you to keep. Do not collapse them into one
  generic `MIT.txt`.

Build-time-only tooling (esbuild, TypeScript, Wrangler, …) is intentionally absent here:
it never enters the deployed artifact, and each package's license text already ships
inside its own directory under `node_modules/`.

These files are served by the site at `/licenses/…` — the deployed `wrangler.toml` assets
directory is the repository root, so the notice travels with the distribution itself.
