# agentkursus-api

Cloudflare Worker, der proxyer GitHub API med læseadgang, så kurset kan vise Mortens egne commits og Actions-kørsler. Kurset virker fuldt ud uden Workeren. Live-data er pynt.

## Hvad den gør

| Endpoint | Svar |
|---|---|
| `/health` | om tjenesten kører, og om et token er sat |
| `/commits?repo=&branch=&n=` | seneste commits på en branch: sha, besked, dato, url |
| `/runs?repo=&branch=&n=` | seneste Actions-kørsler: konklusion, besked, branch, dato, url |
| `/pulls?repo=&n=` | pull requests: nummer, titel, tilstand, branch, dato, url |
| `/oversigt?repo=` | per `arbejde/modul-NN`: commits ud over startbranchen, kørsler grønne og røde |

* Kun GET. Kun repos i `REPOS`. Kun origins i `ALLOWED_ORIGINS` får CORS-svar. Alle felter filtreres i Workeren.
* Svar caches i `CACHE_SEKUNDER` (300) med Cache API, så GitHubs rate limit ikke rammes.
* Uden token virker den mod offentlige repos med 60 kald i timen. Med token: 5000.

## Mortens trin, én gang (cirka 10 minutter)

Kør fra denne mappe. `npx` bruger den lokalt installerede wrangler.

1. Log ind på Cloudflare. Åbner browseren.

```bash
npx wrangler login
```

2. Lav et fine-grained personal access token på GitHub: Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token. Repository access: Only select repositories: `fragtvaegt-sandbox` og `tdc-simulator`. Permissions, Repository: Contents: Read-only, Actions: Read-only, Pull requests: Read-only, Metadata: Read-only (sættes automatisk). Ingen andre. Kopiér tokenet, det vises kun én gang.

3. Læg tokenet som secret. Kommandoen spørger efter værdien, som du indsætter. Den bliver aldrig skrevet i en fil.

```bash
npx wrangler secret put GITHUB_TOKEN
```

4. Deploy.

```bash
npx wrangler deploy
```

Wrangler skriver adressen. Kursets Worker ligger på `https://agentkursus-api.loginalias.workers.dev`.

5. Tjek.

```bash
curl https://agentkursus-api.loginalias.workers.dev/health
```

Svaret skal indeholde `"token": true`.

6. Sæt adressen ind i kurset: feltet `workerUrl` i `indhold/kursus.json`, uden skråstreg til sidst. Commit og push. Modul 02, 09 og 13 begynder at vise dine egne data.

## Lokal test uden token

```bash
npx wrangler dev --port 8790
curl "http://localhost:8790/commits?repo=fragtvaegt-sandbox&branch=main&n=3"
```

`.dev.vars` (ikke i git) kan sætte `GITHUB_TOKEN` og en ekstra origin til lokal test.

## Sikkerhed

* Tokenet er read-only, afgrænset til to repos, og ligger kun som Worker-secret. Det står aldrig i repoet, i config eller i frontend.
* Frontend kalder kun Workeren. Workeren kalder kun `api.github.com`.
* Ingen skrivende endpoints. Ingen `Access-Control-Allow-Origin: *`.

Kilder: developers.cloudflare.com/workers/wrangler (kommandoer og config), developers.cloudflare.com/workers/runtime-apis/cache (Cache API), docs.github.com/rest (endpoints, verificeret med gh api 2026-09-06).
