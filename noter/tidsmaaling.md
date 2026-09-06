# Tidsmåling af øvelser

Målt af Claude Code med `claude -p` mod en frisk klon af `fragtvaegt-sandbox` fra modulets startbranch. Agenttid er væggeur fra prompt til svar. Mortens tid er et skøn for de manuelle trin (nulstil branch, redigér, læs transkript, udfyld felter på siden) og skal efterprøves i Fase 8.

| Dato | Modul | Øvelse | Agenttid | Turns | Mortens trin, skøn | Samlet, skøn | Under 15 min |
|---|---|---|---|---|---|---|---|
| 2026-09-06 | 01 | Kør prompt (--json i CLI), læs transkript, udfyld skema | 39 s | 6 | 9 min | 10 min | ja |
| 2026-09-06 | 02 | Ret to ting i CLAUDE.md, tilføj test, commit | 50 s | se log | 5 min | 6 min | ja |
| 2026-09-06 | 03 | Samme opgave med tynd og udbygget CLAUDE.md via claude -p, notér turns | 39 s + 47 s | 7 og 8 | 6 min | 8 min | ja |
| 2026-09-06 | 04 | Omskriv svag briefing efter tjekliste, kør én gang (fejl C) | 71 s | 11 | 9 min | 11 min | ja |
| 2026-09-06 | 05 | Aktivér takstserver, tilføj zone 5 via MCP | 52 s | se log | 4 min | 5 min | ja |
| 2026-09-06 | 06 | Find fejlen testene fanger, aktivér hook, se commit afvist, grøn commit | 33 s + 48 s | 7 | 6 min | 8 min | ja |

## Noter

* Modul 03: tynd gav 7 turns, udbygget 8. Den udbyggede kørte tests før og efter ændringen, som arbejdsreglerne bad om. Modulet siger derfor åbent, at færre turns ikke er målet.
* Modul 04: briefingen efter tjeklisten løste fejl C uden indgriben, tilføjede testen først, rørte kun pris.py og test_pris.py, og lod den fejlende test i beregner være.
* Modul 06, prompt 2 rettet: agenten skal tilføje en docstring-linje, så der er noget at committe efter afvisningen. Verificeret: "Behold oprunding for vej" landede som grøn commit efter én afvisning.

* Modul 01: transkriptet indeholdt 5 handlinger, 5 observationer og 1 vurdering, så kravet om mindst 3 observationsrækker kan opfyldes. Agenten lavede to redigeringer efter hinanden med kun værktøjssvar imellem, hvilket er et godt eksempel til skemaets sidste række.

* Modul 05: den relative sti `kursus/mcp/takstserver.py` i `.mcp.json` virker, når Claude startes fra repoets rod. Transkriptet viser `liste_zoner` én gang og `hent_takst` to gange. Zone 5 blev tilføjet for fly og soe, ikke vej. Korrekt.
* Modul 06, prompt 2: hooken afviste committen som planlagt. Agenten rettede koden tilbage, men da det gav nul diff, var der intet at committe. Prompten i Fase 3 skal bede om en ændring, der overlever (fx en docstring), så der bliver en grøn commit efter den røde.
* Modul 02: agenten committede kun testfilen. Mortens egne rettelser i CLAUDE.md lå stadig ukommitterede. Modulsiden skal bede ham committe dem selv først, så `git log` viser hans commit.
