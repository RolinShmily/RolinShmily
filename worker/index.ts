/**
 * Static site. Every real path is a file under `assets/`, which Cloudflare serves before
 * this Worker is reached; this file only catches paths that match no file and forwards
 * them to the asset binding so they get the asset layer's 404.
 *
 * In other words this Worker no longer does anything a plain static-assets deployment
 * would not. It is kept only because `main` is wired into the deploy (wrangler.toml, and
 * the typecheck step in .github/workflows/deploy.yml); dropping it entirely is a fine
 * follow-up, not an oversight.
 *
 * WHAT IT USED TO DO, AND MUST NOT DO AGAIN
 * It also served `/api/github/*`: a 30-minute-cached proxy that forwarded whatever
 * `/api/github/<owner>/<repo>` was requested to the GitHub API, attaching a bearer token
 * read from the Worker's environment. No caller had to authenticate to reach it, so the
 * route existed to spend a private credential on behalf of strangers. Nothing on the site
 * ever called it — `js/`, `css/` and `index.html` contain no `fetch()` to that path.
 *
 * No such token was ever bound to this Worker, so the exposure never went live; it was
 * found and removed while still latent. The code was nevertheless shaped to hand a
 * credential to anyone who asked, and an unused endpoint has no upside to weigh against
 * that. It was deleted rather than restricted: do not bring it back without an allowlist.
 */
export default {
  fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;
