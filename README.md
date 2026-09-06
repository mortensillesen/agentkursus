# Agentkursus

Selvstudiekursus i agent engineering: 14 moduler over to dage, med læsestof, scriptede simulationer, øvelser mod et sandbox-repo og quiz. Statisk site uden build-step, så det virker om to år uden vedligehold.

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

Push til `main` deployer til GitHub Pages via `.github/workflows/deploy-pages.yml`. Cloudflare Pages kobles på senere.

* GitHub Pages: https://mortensillesen.github.io/agentkursus/
