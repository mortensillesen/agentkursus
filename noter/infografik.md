# Infografikker

Femten infografikker, én for hele begrebet og én per modul. Lavet 2026-09-07.

## Sådan hænger det sammen

1. Kilden er `infografik/byg.py`, som tegner alle 15 som SVG i kursets farver. `python3 infografik/byg.py` skriver `infografik/svg/` og `infografik/html/`.
2. `zsh infografik/byg-pdf.sh pdf` laver PDF i `infografik/pdf/` med Chrome headless. `zsh infografik/byg-pdf.sh png` laver forhåndsvisninger i `infografik/prev/`, som ikke committes.
3. PDF'erne ligger offentligt på GitHub Pages og er importeret i Canva som redigerbare designs (tekst og former kan rettes). De ligger i Canva-mappen "Agentkursus infografik": https://www.canva.com/folder/FAHUeusz3BU
4. Kurset viser Canvas PNG-eksport (1600 × 900) fra `assets/img/infografik/`. Retter Morten i Canva, eksporteres igen som PNG i bredde 1600, og filen erstattes. Filnavnet er slug'en, så JSON skal ikke røres.
5. Billedet indsættes med bloktypen `billede` først i `kernen` i hvert modul-JSON, og for hele kurset i `forside.billede` i `kursus.json`. Felter: `fil`, `alt`, `tekst`.

Retter du i `byg.py`, skal du køre trin 1 og 2, pushe, importere PDF'en i Canva igen (import laver et nyt design) og eksportere. Canva-designet er altså kun redigerbar kopi, ikke kilde.

## Canva-designs

| Nr | Slug | Design-id | Redigér |
|---|---|---|---|
| 00 | 00-hvad-er-agentic-engineering | DAHUehtmZ5o | https://www.canva.com/d/0nAJ2PWOxJJDWeY |
| 01 | 01-den-agentiske-loekke | DAHUetGOQyo | https://www.canva.com/d/SWfs3hE50JCFe0J |
| 02 | 02-opsaetning-af-miljoe | DAHUejoelZ0 | https://www.canva.com/d/waX2m79_kEeu-x- |
| 03 | 03-kontekst-engineering | DAHUelfGEjs | https://www.canva.com/d/D5TAeaNOiOJNZGx |
| 04 | 04-effektiv-prompting | DAHUegDOOLg | https://www.canva.com/d/bDMyCuPx0y0yxie |
| 05 | 05-vaerktoejer-mcp-forbindelser | DAHUei60dsw | https://www.canva.com/d/QoFAseRZcWRfeXW |
| 06 | 06-verifikation-og-kvalitetsporte | DAHUem82Vh4 | https://www.canva.com/d/l6wdeXPK0_wGC0F |
| 07 | 07-subagenter-og-parallelitet | DAHUevHeDYk | https://www.canva.com/d/Rl2xjBjCmf73lP3 |
| 08 | 08-langtkoerende-agenter-og-hukommelse | DAHUekfQah8 | https://www.canva.com/d/P_i6sCRpiMjJcDq |
| 09 | 09-produktions-workflows | DAHUeqiHkwE | https://www.canva.com/d/uq7PmGKXQ_aMmml |
| 10 | 10-byg-dit-eget-agent-system | DAHUerCXMQw | https://www.canva.com/d/VF1s7COliD1TFYq |
| 11 | 11-fra-forretningskontekst-til-opgaver | DAHUellxN4Q | https://www.canva.com/d/NwI8wscWsaCt0oR |
| 12 | 12-enterprise-adoption | DAHUevrwijM | https://www.canva.com/d/WNoY0XsESSURffo |
| 13 | 13-observability-og-livscyklus | DAHUehEgh14 | https://www.canva.com/d/PBS_AEwZeKlddI5 |
| 14 | 14-atomare-agenter | DAHUeg4p8yE | https://www.canva.com/d/SUwLMhlP6gW6vRF |

## Designregler

* 1600 × 900, kursets palette fra `assets/css/kursus.css`, Arial. Ingen fotos, ingen forløb.
* Tekstbudget per billede: modulnummer, titel, højst seks korte etiketter og én sætning i bunden. Resten er figurer.
* Motivet er modulets faste hverdagsbillede fra stilguiden (disponenten, den nye elev, skrivebordet, fragtordren, rampen, vagtskiftet osv.).
* Alt-teksten i JSON beskriver, hvad man ser, i én sætning, fordi billedet bærer indhold.
