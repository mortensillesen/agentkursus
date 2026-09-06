# agentkursus-api

Cloudflare Worker, som proxyer GitHub API med read-only token, cache og CORS begrænset til de to kendte origins.

Bygges i Fase 6. Tokenet lægges som Worker secret med `wrangler secret put` af Morten selv og står aldrig i repoet.
