/* agentkursus-api: read-only proxy til GitHub API for kursets live-kobling.
   Endpoints: /health, /commits, /runs, /pulls, /oversigt. Alle GET. Svar caches i CACHE_SEKUNDER.
   Tokenet ligger som secret GITHUB_TOKEN og bruges kun i Authorization-headeren mod api.github.com. */

const GITHUB = "https://api.github.com";

function json(data, status, ekstra) {
  const h = new Headers({ "content-type": "application/json; charset=utf-8" });
  if (ekstra) for (const [k, v] of Object.entries(ekstra)) h.set(k, v);
  return new Response(JSON.stringify(data), { status: status || 200, headers: h });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const tilladt = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const h = { "Vary": "Origin" };
  if (tilladt.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}

function repoTilladt(env, repo) {
  return (env.REPOS || "").split(",").map((s) => s.trim()).includes(repo);
}

function branchOk(b) {
  return typeof b === "string" && b.length <= 100 && /^[A-Za-z0-9._\/-]+$/.test(b);
}

async function github(env, sti) {
  const headers = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "agentkursus-api"
  };
  if (env.GITHUB_TOKEN) headers["Authorization"] = "Bearer " + env.GITHUB_TOKEN;
  const r = await fetch(GITHUB + sti, { headers });
  if (r.status === 404) return null; // fx en branch, der ikke findes endnu: tom liste, ikke fejl
  if (!r.ok) {
    const tekst = await r.text();
    throw new Error("GitHub svarede " + r.status + (tekst ? ": " + tekst.slice(0, 120) : ""));
  }
  return r.json();
}

const kort = (sha) => String(sha || "").slice(0, 7);
const dato = (iso) => String(iso || "").slice(0, 10);

async function commits(env, repo, branch, n) {
  const data = await github(env, `/repos/${env.OWNER}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${n}`);
  if (!data) return [];
  return data.map((c) => ({
    sha: kort(c.sha),
    besked: String(c.commit && c.commit.message || "").split("\n")[0].slice(0, 120),
    dato: dato(c.commit && c.commit.author && c.commit.author.date),
    url: c.html_url
  }));
}

async function runs(env, repo, branch, n) {
  const q = branch ? `&branch=${encodeURIComponent(branch)}` : "";
  const data = await github(env, `/repos/${env.OWNER}/${repo}/actions/runs?per_page=${n}${q}`);
  return ((data && data.workflow_runs) || []).map((r) => ({
    sha: kort(r.head_sha),
    konklusion: r.conclusion || r.status || "ukendt",
    besked: `${r.name}: ${String(r.display_title || "").slice(0, 100)}`,
    branch: r.head_branch,
    dato: dato(r.created_at),
    url: r.html_url
  }));
}

async function pulls(env, repo, n) {
  const data = await github(env, `/repos/${env.OWNER}/${repo}/pulls?state=all&per_page=${n}`);
  if (!data) return [];
  return data.map((p) => ({
    nummer: p.number,
    titel: String(p.title || "").slice(0, 120),
    tilstand: p.merged_at ? "merged" : p.state,
    branch: p.head && p.head.ref,
    dato: dato(p.created_at),
    url: p.html_url
  }));
}

/* Oversigt per modul: commits paa arbejde/modul-NN ud over start/modul-NN, og koersler paa branchen. */
async function oversigt(env, repo) {
  const branches = (await github(env, `/repos/${env.OWNER}/${repo}/branches?per_page=100`)) || [];
  const navne = branches.map((b) => b.name);
  const arbejde = navne.filter((n) => /^arbejde\/modul-\d\d$/.test(n)).sort();
  const alleRuns = await runs(env, repo, null, 100);
  const resultat = [];
  for (const b of arbejde) {
    const modul = b.slice(-2);
    const start = `start/modul-${modul}`;
    let commitsUdOver = null;
    if (navne.includes(start)) {
      const cmp = await github(env, `/repos/${env.OWNER}/${repo}/compare/${encodeURIComponent(start)}...${encodeURIComponent(b)}`);
      commitsUdOver = cmp ? cmp.ahead_by : null;
    }
    const mine = alleRuns.filter((r) => r.branch === b);
    resultat.push({
      modul,
      branch: b,
      commits: commitsUdOver,
      koersler: { success: mine.filter((r) => r.konklusion === "success").length, failure: mine.filter((r) => r.konklusion === "failure").length, ialt: mine.length },
      seneste: mine[0] ? mine[0].dato : null
    });
  }
  return { repo, hentet: new Date().toISOString(), moduler: resultat };
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return json({ fejl: "kun GET" }, 405, cors);

    const url = new URL(request.url);
    const sti = url.pathname.replace(/\/+$/, "") || "/";
    if (sti === "/" || sti === "/health") {
      return json({ ok: true, tjeneste: "agentkursus-api", token: Boolean(env.GITHUB_TOKEN), endpoints: ["/commits", "/runs", "/pulls", "/oversigt"] }, 200, cors);
    }

    const repo = url.searchParams.get("repo") || "";
    const branch = url.searchParams.get("branch") || "";
    const n = Math.min(50, Math.max(1, parseInt(url.searchParams.get("n") || "10", 10) || 10));
    if (!repoTilladt(env, repo)) return json({ fejl: "ukendt repo" }, 400, cors);
    if (branch && !branchOk(branch)) return json({ fejl: "ugyldigt branchnavn" }, 400, cors);

    const cache = caches.default;
    const noegle = new Request(url.origin + sti + "?" + new URLSearchParams({ repo, branch, n: String(n) }).toString(), { method: "GET" });
    const cached = await cache.match(noegle);
    if (cached) {
      const r = new Response(cached.body, cached);
      for (const [k, v] of Object.entries(cors)) r.headers.set(k, v);
      r.headers.set("X-Cache", "HIT");
      return r;
    }

    try {
      let data;
      if (sti === "/commits") data = await commits(env, repo, branch || "main", n);
      else if (sti === "/runs") data = await runs(env, repo, branch, n);
      else if (sti === "/pulls") data = await pulls(env, repo, n);
      else if (sti === "/oversigt") data = await oversigt(env, repo);
      else return json({ fejl: "ukendt endpoint" }, 404, cors);

      const sek = parseInt(env.CACHE_SEKUNDER || "300", 10) || 300;
      const svar = json(data, 200, { "Cache-Control": "public, max-age=" + sek, "X-Cache": "MISS" });
      ctx.waitUntil(cache.put(noegle, svar.clone()));
      for (const [k, v] of Object.entries(cors)) svar.headers.set(k, v);
      return svar;
    } catch (e) {
      console.log(JSON.stringify({ niveau: "fejl", sti, repo, branch, besked: String(e && e.message || e) }));
      return json({ fejl: "kunne ikke hente fra GitHub", detalje: String(e && e.message || e).slice(0, 200) }, 502, cors);
    }
  }
};
