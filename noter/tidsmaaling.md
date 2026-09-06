# Tidsmåling af øvelser

Målt af Claude Code med `claude -p` mod en frisk klon af `fragtvaegt-sandbox` fra modulets startbranch. Agenttid er væggeur fra prompt til svar. Mortens tid er et skøn for de manuelle trin (nulstil branch, redigér, læs transkript, udfyld felter på siden) og skal efterprøves i Fase 8.

| Dato | Modul | Øvelse | Agenttid | Turns | Mortens trin, skøn | Samlet, skøn | Under 15 min |
|---|---|---|---|---|---|---|---|
| 2026-09-06 | 01 | Kør prompt (--json i CLI), læs transkript, udfyld skema | 39 s | 6 | 9 min | 10 min | ja |
| 2026-09-06 | 01, v1.1 | Kør bestilling (transportformen kurer), læs transkript, udfyld skema | 85 s | 15 | 9 min | 11 min | ja |
| 2026-09-06 | 02 | Ret to ting i CLAUDE.md, tilføj test, commit | 50 s | se log | 5 min | 6 min | ja |
| 2026-09-06 | 03 | Samme opgave med tynd og udbygget CLAUDE.md via claude -p, notér turns | 39 s + 47 s | 7 og 8 | 6 min | 8 min | ja |
| 2026-09-06 | 04 | Omskriv svag briefing efter tjekliste, kør én gang (fejl C) | 71 s | 11 | 9 min | 11 min | ja |
| 2026-09-06 | 05 | Aktivér takstserver, tilføj zone 5 via MCP | 52 s | se log | 4 min | 5 min | ja |
| 2026-09-06 | 06 | Find fejlen testene fanger, aktivér hook, se commit afvist, grøn commit | 33 s + 48 s | 7 | 6 min | 8 min | ja |
| 2026-09-06 | 07 | Fire testfiler sekventielt og med fire subagenter via claude -p | 137 s + 173 s | 16 og 16 | 6 min | 11 min | ja |
| 2026-09-06 | 08 | Session 1 til del 2 med STATUS.md, ny session fortsætter fra filen | 212 s + 180 s | 14 og 17 | 5 min | 12 min | ja |
| 2026-09-06 | 09 | Aktivér workflow, rød kørsel, ret, grøn kørsel og Pages-deploy | CI: 25 s + 49 s, agent cirka 40 s | | 7 min | 10 min, plus Cloudflare Pages cirka 5 min som Mortens egen del | ja |
| 2026-09-06 | 10 | /takstopdatering 5 to gange med skill, subagent, hook og MCP | 78 s + 70 s | 8 og 9 | 5 min | 8 min | ja |
| 2026-09-06 | 11 | Kandidatopgave 3 på tdc-simulator, branch agentkursus, via claude -p | 89 s | 6 | 10 min skrivning og verifikation | 12 min | ja |
| 2026-09-06 | 12 | Skriveøvelse, lærred med fem felter og tre bremseklodser | ingen agent | | 15 min | 15 min | ja, ved grænsen |
| 2026-09-06 | 13 | Læs dashboardet, git-kommando, definér én måling | ingen agent | | 10 min | 10 min | ja |
| 2026-09-06 | 14 | Destillat-script plus én atomar agent | 1 s + 49 s | 2 | 8 min | 9 min | ja |

## Noter

* Modul 03: tynd gav 7 turns, udbygget 8. Den udbyggede kørte tests før og efter ændringen, som arbejdsreglerne bad om. Modulet siger derfor åbent, at færre turns ikke er målet.
* Modul 04: briefingen efter tjeklisten løste fejl C uden indgriben, tilføjede testen først, rørte kun pris.py og test_pris.py, og lod den fejlende test i beregner være.
* Modul 06, prompt 2 rettet: agenten skal tilføje en docstring-linje, så der er noget at committe efter afvisningen. Verificeret: "Behold oprunding for vej" landede som grøn commit efter én afvisning.

* Modul 01: transkriptet indeholdt 5 handlinger, 5 observationer og 1 vurdering, så kravet om mindst 3 observationsrækker kan opfyldes. Agenten lavede to redigeringer efter hinanden med kun værktøjssvar imellem, hvilket er et godt eksempel til skemaets sidste række.

* Modul 05: den relative sti `kursus/mcp/takstserver.py` i `.mcp.json` virker, når Claude startes fra repoets rod. Transkriptet viser `liste_zoner` én gang og `hent_takst` to gange. Zone 5 blev tilføjet for fly og soe, ikke vej. Korrekt.
* Modul 06, prompt 2: hooken afviste committen som planlagt. Agenten rettede koden tilbage, men da det gav nul diff, var der intet at committe. Prompten i Fase 3 skal bede om en ændring, der overlever (fx en docstring), så der bliver en grøn commit efter den røde.
* Modul 02: agenten committede kun testfilen. Mortens egne rettelser i CLAUDE.md lå stadig ukommitterede. Modulsiden skal bede ham committe dem selv først, så `git log` viser hans commit.
* Modul 07: sekventiel 137 s, 20 bestået, 2 fejlet (fandt fejl B). Parallel 173 s, dobbelt pris, 23 bestået, 1 fejlet (fandt ikke fejl B). Modulet siger det åbent.
* Modul 08: session 2 læste STATUS.md som første handling, spurgte ikke, gentog intet, fandt fejl A og noterede den under Beslutninger i stedet for at rette.
* Modul 09: Pages-miljøet i sandboxen har custom branch policy. Branchen arbejde/modul-09 er tilføjet som tilladt deploy-branch, og workflow-triggeren omfatter den. Min testbranch er slettet igen.
* Modul 10: byte for byte samme takster.json i to kørsler. Hooken kørte (logfilen /tmp/fragtvaegt-hook.log opdateret), men stille, fordi exit 0 ikke giver output.
* Startbranches 04 til 10 og 14 fik den korrekte tynde CLAUDE.md, så den bevidst mangelfulde fil kun findes i modul 02 (og på main).
* Modul 11: første prøvekørsel hang, fordi prompten bad agenten starte en http.server som bevis, og serveren aldrig returnerer. Prompten er rettet til grep og forklaring. Anden kørsel: 89 s, 6 turns, main urørt.
* Modul 12 er ren skriveøvelse og ligger ved grænsen på 15 minutter. Skemaet har otte rækker, og siden siger, at lærredet skal være udfyldt, ikke perfekt.
* Modul 14: destillatet kører på 1 sekund uden modelkald. Den atomare agent takst-tester alene: 49 s, 2 turns, 0,18 dollar. Modul 10 til sammenligning: 70 til 78 s, 8 til 9 turns, 0,30 til 0,51 dollar.

## Samlet

Alle 14 øvelser er kørt og tidtaget 2026-09-06. Ingen over 15 minutter. Modul 12 ligger på grænsen som ren skriveøvelse. Samlet målt øvelsestid: cirka 135 minutter, mod cirka 210 minutter afsat (14 gange 15). De målte tider står i kursus.json under maalt og vises på forsiden.

## Version 1.1 (ikke-kodende læser)

* Modul 01 fik en ny opgave: transportformen kurer i stedet for et JSON-flag. Målt 2026-09-06 mod en frisk klon af start/modul-01 (efter at branchen fik den tynde CLAUDE.md): 85 s, 15 turns, 0,68 dollar. Agenten rettede fire filer, kørte beregneren og viste 24.0 kg og 1032 DKK, som verifikationen forventer. Den lod den kendte fly-fejl være, som bestillingen bad om.
* Modul 02 til 14: agent-opgaverne er de samme som i version 1.0, kun formuleret som bestillinger. Mortens egne trin er færre (git og shell-parsing er flyttet til agenten), så de målte tider fra 1.0 holder som øvre grænse. Modul 03 og 07 aflæser nu tid og tokens med /usage i stedet for claude -p, hvilket giver et par minutter mere til Morten, men stadig under 15.

