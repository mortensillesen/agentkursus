# Agentkursus

Interaktivt selvstudiekursus i agent engineering, 14 moduler over to dage. Bygges af Claude Code, tages af Morten Stagsted Sillesen. Den fulde briefing er `agentkursus_projektplan_v2.md` i Drive-mappen `CLAUDE COWORK/Agent Coding Project`. Læs den, før du ændrer noget væsentligt.

## Rollefordeling

Claude bygger kurset. Morten tager kurset. Opsætning, repos, deploys, workflows og fejlfinding af miljø ligger aldrig i en øvelse.

## Stack

* Statisk HTML, CSS og vanilla JavaScript. Intet framework, intet build-step, ingen npm-afhængigheder i frontend.
* Alt tekstindhold ligger i `indhold/` som JSON. Tekst hårdkodes aldrig i HTML.
* Én HTML-fil per modul i `moduler/<slug>/index.html`. Ingen single-page app, ingen router.
* Lokal kørsel: `python3 -m http.server` fra repoets rod. Siderne henter JSON med fetch og virker ikke fra `file://`.
* Deploy: push til `main` udløser `.github/workflows/deploy-pages.yml`. `_arkiv/`, `worker/`, `noter/` og `.github/` deployes ikke.
* Live-kobling: `worker/` er en Cloudflare Worker. Adressen står i `indhold/kursus.json` som `workerUrl`. Tom streng betyder slået fra, og alt falder tilbage på statiske eksempler.

## Sprog

* Dansk brødtekst med æ, ø og å. Engelske fagtermer beholdes: context engineering, subagent, harness, tool call, prompt, commit, gate.
* Kort og konkret. Ingen konsulentsprog. Skriv til én læser.
* Ingen tankestreger i brødtekst. Brug komma, kolon eller punktum.
* Filnavne, slugs, JSON-nøgler og stier i kebab-case eller camelCase, ASCII, ingen æøå.

## Regler

* Slet aldrig filer. Flyt udrangerede filer til `_arkiv/` med dato i filnavnet.
* Verificér før du skriver. Hver kommando, hvert flag, hvert konfigurationsfelt tjekkes mod aktuel officiel dokumentation. Kan det ikke verificeres, skrives det ikke.
* Opfind aldrig et CLI-flag, en indstilling, et endpoint eller et filnavn.
* Hver faktuel påstand om et værktøj har kildelink og dato. Hver modulside har `Sidst verificeret: ÅÅÅÅ-MM-DD` i foden.
* Tokens og hemmeligheder står aldrig i repoet, i en config-fil, i en commit eller i frontend. Worker-secrets sættes af Morten selv med `wrangler secret put`.
* Frontend kalder kun Workeren, aldrig GitHub API direkte. Live-data er pynt, aldrig en forudsætning.
* Ingen rigtige modelkald i kurset. Simulationerne er scriptede.
* Tidsbudget per modul er en grænse: læsning 8 min, simulation 3 min, øvelse 15 min, quiz 3 min. Overskrides øvelsen, skæres den. Estimatet hæves ikke.

## Tilknyttede repos

* Sandbox til øvelserne: `mortensillesen/fragtvaegt-sandbox` (Python 3.9, pytest, fragtpligtig vægt). Startbranch per modul: `start/modul-NN`.
* Mortens rigtige projekt til modul 11 til 14: `mortensillesen/tdc-simulator`, kun på branchen `agentkursus`. Aldrig main.

## Indholdsmodel

Se `indhold/moduler/01.json` som reference. Blokke i `hvorfor`, `kernen`, `oevelse.intro` og `oevelse.efter` er enten en streng (afsnit) eller `{type: h3|liste|citat|kode|note|advarsel|tabel}`. Inline-kode med backticks. `simulationerBygget` i `kursus.json` styrer, hvilke simulationsscripts der indlæses. Skemaer, quiz og fremdrift gemmes under `agentkursus.fremdrift.v1`.

## Fasestatus

* Fase 0: repo, struktur, GitHub Pages. Færdig 2026-09-06. Repoet er offentligt, fordi GitHub Free ikke giver Pages på private repos (API-svar 422 ved forsøget). Sitet er offentligt på internettet uanset repo-synlighed.
* Fase 1: sandbox-repoet `fragtvaegt-sandbox`. Færdig 2026-09-06. Tre øvelser tidtaget, se `noter/tidsmaaling.md`.
* Fase 2: designsystem, modulskabelon, modul 01 og 02 som referencekvalitet. Færdig 2026-09-06.
* Fase 3: modul 03 til 06 med indhold og øvelser. Færdig 2026-09-06. Dag 1 kan gennemføres.
* Fase 4: seks scriptede simulationer i `assets/js/simulationer/`. Færdig 2026-09-06.
* Fase 5: modul 07 til 10 med indhold, øvelser og simulationer. Færdig 2026-09-06.
* Fase 6: Worker `agentkursus-api` bygget og testet lokalt, live.js læser `workerUrl` fra kursus.json, dashboard.html bygget. Færdig fra min side 2026-09-06. Mortens del: `wrangler login`, `wrangler secret put GITHUB_TOKEN`, `wrangler deploy`, sæt `workerUrl`, og kobl kurset på Cloudflare Pages. Se `worker/README.md`.
* Fase 7: modul 11 til 14. Færdig 2026-09-06. tdc-simulator har branchen `agentkursus` med CLAUDE.md og AGENTKURSUS.md; main er urørt. Sandboxen har `kursus/destillat/`.
* Fase 8: pre-flight-siden, eksport og import af fremdrift, linktjek, tilgængelighed, tidsmåling, sidste gennemskrivning. Ikke begyndt.
* Fase 1 til 8: se projektplanen. Efter hver fase: stop, vis resultatet, vent på grønt lys.
