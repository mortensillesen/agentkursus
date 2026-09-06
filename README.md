# Agentkursus

Selvstudiekursus i agent engineering: 14 moduler over to dage, med læsestof, scriptede simulationer, øvelser mod et sandbox-repo og quiz. Statisk site uden build-step, så det virker om to år uden vedligehold.

## Status

Version 1.0.0, 2026-09-06. Alle 14 moduler er live, hver øvelse er kørt og tidtaget, og live-koblingen er deployet. Pre-flight-siden og `preflight.sh` tjekker installation og adgang dagen før.

## Kør lokalt

Siderne henter indhold med fetch og virker ikke fra `file://`. Start en lokal server fra repoets rod:

```bash
python3 -m http.server 8000
```

Åbn derefter http://localhost:8000/

## Struktur

```
index.html                 forside: fire dele, fremdrift, tidsestimat
preflight.html             tjeklisten til dagen før
moduler/<slug>/index.html  én side per modul
indhold/kursus.json        metadata og rækkefølge
indhold/moduler/NN.json    tekst, øvelsestrin, quiz og kilder per modul
assets/css/kursus.css
assets/js/modul.js         rendrer en modulside fra JSON
assets/js/fremdrift.js     localStorage under agentkursus.fremdrift.v1
assets/js/live.js          kald til Worker med timeout og fallback
assets/js/simulationer/    én fil per simulation
worker/                    Cloudflare Worker (agentkursus-api)
.github/workflows/         deploy til GitHub Pages
_arkiv/                    udrangerede filer, aldrig slettet
```

## Deploy

Push til `main` deployer til GitHub Pages via `.github/workflows/deploy-pages.yml`.

* GitHub Pages: https://mortensillesen.github.io/agentkursus/
* Cloudflare Pages: https://agentkursus.pages.dev/ (når koblet på, se nedenfor)

### Cloudflare Pages, Mortens trin (cirka 5 minutter)

Trinnene følger Cloudflares dokumentation for git-integration (developers.cloudflare.com/pages/get-started/git-integration, hentet 2026-09-06).

1. Log ind på dash.cloudflare.com. Gå til Workers & Pages, vælg Create application, Pages, Connect to Git.
2. Vælg repoet `agentkursus`. Project name: `agentkursus`. Production branch: `main`.
3. Framework preset: None. Build command: `sh cf-byg.sh`. Build output directory: `_site`.
4. Vælg Save and Deploy. Adressen bliver `https://agentkursus.pages.dev`. Hvert push til `main` deployer igen.

`cf-byg.sh` kopierer de samme mapper, som GitHub-workflowen deployer, så begge sites er ens.

## Live-kobling

`worker/` indeholder Cloudflare Workeren `agentkursus-api`. Opsætning og Mortens trin står i `worker/README.md`. Adressen sættes i `indhold/kursus.json` som `workerUrl`.
