export default {
  async fetch(request: Request, env: { GH_TOKEN: string; ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);

    // API proxy route
    if (url.pathname.startsWith("/api/github/")) {
      return handleGitHubProxy(url, env);
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<{ GH_TOKEN: string; ASSETS: Fetcher }>;

const CACHE_TTL = 1800; // 30 min

async function handleGitHubProxy(url: URL, env: { GH_TOKEN: string }): Promise<Response> {
  const segments = url.pathname.replace("/api/github/", "").split("/");

  let owner: string;
  let repo: string;

  if (segments.length >= 2) {
    owner = segments[0];
    repo = segments[1];
  } else {
    owner = "RolinShmily";
    repo = segments[0];
  }

  if (!repo) {
    return new Response(JSON.stringify({ error: "Missing repo name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const githubUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "rolin-shmily-worker",
  };

  if (env.GH_TOKEN) {
    headers.Authorization = `token ${env.GH_TOKEN}`;
  }

  // Check Cloudflare Cache API
  const cache = caches.default;
  const cacheKey = new Request(githubUrl, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const res = new Response(cached.body, cached);
    res.headers.set("X-Cache", "HIT");
    return res;
  }

  try {
    const res = await fetch(githubUrl, { headers });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `GitHub ${res.status}` }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();

    const response = new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
        "X-Cache": "MISS",
      },
    });

    // Fire-and-forget cache write
    await cache.put(cacheKey, response.clone());

    return response;
  } catch {
    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
