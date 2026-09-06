# Stilguide: omskrivning af agentkursus til en læser, der ikke koder

## Præmis

Morten kan ikke kode og skal ikke lære det. Han skal lære at få Claude Code til det:
beskrive, hvad der skal være sandt bagefter, følge med i hvad agenten gør, og bedømme
resultatet ud fra bevis. Alt indhold skrives ud fra den præmis. Kode, han ser i et
transkript, må han læse hen over. Det, han skal kunne se, er løkken, konteksten,
bestillingen, porten og beviset.

## To slags teknisk stof

BEHOLD (det er hans egne håndtag):
* Kommandoen `claude`, og kommandoerne inde i sessionen: `/clear`, `/compact`, `/context`,
  `/usage`, `/mcp`, `/exit`, `/btw`, `Esc`.
* Nulstil-kommandoen øverst i hver øvelse (feltet nulstilKommando, rør den ikke).
* At køre beregneren: `python3 -m fragtvaegt <transportform> <zone> <LxBxH:VAEGT>`.
  Forklar den første gang i modulet, den bruges: transportform, zone, og et kolli som
  længde x bredde x højde i cm, kolon, vægt i kg.
* At køre testene: `python3 -m pytest -q`. Kald det "testene" eller "beviset".
* At kopiere en færdig konfigurationsfil ind: `cp kursus/mcp/mcp.aktiv.json .mcp.json`.
  De faste aktiveringsblokke fra sandboxens READMEs (byggeklodser, hooks) må stå som
  ét kopiér-trin med etiketten "tænd" og en sætning om, hvad der tændes.
* `git config core.hooksPath kursus/hooks` (en kontakt) og `git branch --show-current`
  (et sikkerhedstjek i modul 11). Ingen anden git for Morten.
* Værktøjsnavnene Read, Edit, Bash, Grep må nævnes én gang per modul som "de navne,
  du ser i transkriptet", ikke forklares.

FJERN fra læsetekst, simulationer, quiz og verifikation:
* Alt, der beskriver kodens inderside: funktionsnavne (afrund_vaegt, beregn_pris,
  parse_kolli), Python-ord (dict, import, argparse, math.ceil, math.floor, docstring,
  dataclass, parser, traceback, NameError), YAML-nøgler (needs, permissions, on: push),
  JSON-RPC, stdio, stdin, stdout, stderr, exit-kode, printf, jq, pipe.
* Filnavne som forklaring. Skriv "takstfilen", "beregneren", "kommandolinjen",
  "testene", "prisudregningen", "afrundingen af vægten". Filnavne må stå i prompts til
  agenten, hvor agenten har brug for dem, og i en kommando Morten kører.

## Oversættelser, der bruges konsekvent

* afrund_vaegt / math.ceil / math.floor  -> "afrundingen af vægten", "runder op / runder ned"
* beregn_pris / round()                  -> "prisudregningen", "afrundingen af prisen til hele kroner"
* data/takster.json                      -> "takstfilen" (i prompts: data/takster.json)
* cli.py / argparse                      -> "kommandolinjen" eller "beregneren"
* en test                                -> "en test" er ok, men forklar første gang: et bevis, der kan køres igen og selv siger bestået eller fejlet
* exit-kode                              -> "kommandoen melder selv, om den lykkedes"
* tool call                              -> behold ordet tool call (engelsk fagterm), forklar som "ét kald af ét værktøj"
* pre-commit hook                        -> "porten før commit", ordet hook må bruges
* CI / GitHub Actions                    -> "porten på GitHub", "kørslen på GitHub"; Actions-siden i browseren er det, Morten ser

## Kommandoer, Morten selv taster

* Én linje, ingen pipes, ingen jq, ingen python3 -c, ingen for-løkker, ingen sed,
  ingen diff, ingen $(...), ingen && (undtagen nulstil-kommandoen og de faste
  aktiveringsblokke).
* Er noget svært at gøre i shell, bliver det en bestilling til agenten i stedet
  (feltet prompt i trinnet), fx "Gå gennem alle branches arbejde/modul-* og vis en
  tabel med antal commits per branch."
* Alle kørsler er interaktive i `claude`. Ingen `claude -p` for Morten.
  Målinger tages med `/usage` (viser Total duration (API) og (wall), Total code changes
  og tokens per model) og `/context` (viser hvad der fylder i vinduet).
  Kilde for begge: https://code.claude.com/docs/en/costs, hentet 2026-09-06.
  Tilføj den kilde i moduler, der bruger dem, hvis den ikke er der.
* Git er agentens arbejde: "Commit med beskeden ...", "Push branchen", "Omdøb filen ...
  og commit". Morten committer aldrig selv (undtagelse: intet).
* Læsning af kode: aldrig `cat fil.py` eller `sed -n`. I stedet en bestilling:
  "Læs kursus/mcp/takstserver.py og forklar i fem linjer, hvad den kan, og hvad den
  har adgang til. Ændr intet." Det er en vigtig færdighed: lad agenten forklare kode,
  før du stoler på den. Små tekstfiler (STATUS.md, CLAUDE.md, SKILL.md) må vises med
  `cat`, forklaret som "viser filen i terminalen".

## Opgaverne til agenten

* Selve opgaven forbliver den samme som før (så de målte tider holder), men prompten
  skrives som en bestilling: hvad skal være sandt bagefter, afgrænsning, bevis.
  Filnavne må stå i prompten, hvor agenten har brug for dem.
* Verifikation for Morten: én simpel kommando (beregneren eller testene) med forventet
  output i ord, eller noget han kan se i transkriptet eller i browseren.

## Hverdagsbillede

Hvert modul får i Kernen, før den tekniske forklaring, en h3 "Et billede fra hverdagen"
med 3 til 6 linjer fra spedition eller undervisning. Faste billeder, brug dem:

* 01 Løkken: disponenten, der booker en transport. Mål: paller i Hamborg fredag.
  Kontekst: kunden, godset, de faste vognmænd. Handling: ringer til en vognmand.
  Observation: "ingen kapacitet før mandag". Vurdering: ikke godt nok. Gentag.
* 02 Harness og CLAUDE.md: den nye elev på speditionskontoret. Instruksen på første
  dag (CLAUDE.md), hvad eleven må gøre uden at spørge (permissions), og de systemer
  eleven har adgang til (værktøjer).
* 03 Kontekst: disponentens skrivebord. Alt, der ligger fremme, er det, hun kan se.
  Læg hele arkivskabet på bordet, og hun finder ingenting. Ryd bordet mellem to sager.
* 04 Prompting: en fragtordre fra en kunde. "Send det til Tyskland" mod en ordre med
  gods, mål, vægt, adresse, leveringsdag og Incoterm. Den gode ordre kan udføres uden
  at ringe tilbage.
* 05 MCP: opslag i transportørens bookingsystem mod en printet prisliste fra i fjor.
  Forbindelsen giver dagens tal og siger, hvad der ikke tilbydes.
* 06 Verifikation: tolddokumenterne tjekkes, før bilen kører. Porten er ligeglad med,
  hvor sikker chaufføren er på, at alt er i orden.
* 07 Subagenter: fire kolleger får hver sin sag og hvert sit skrivebord. Det går
  hurtigere, hvis sagerne ikke rører de samme papirer.
* 08 Hukommelse: overdragelsen ved vagtskifte. Det, der ikke står i overdragelsesnotatet,
  er væk, når den næste møder ind.
* 09 Produktions-workflows: den faste kontrol på terminalen, som ingen kan springe over,
  uanset hvor travlt der er. Frigivelse sker først, når kontrollen er grøn.
* 10 Eget system: et lille speditionskontor sat op med instruks, fast procedure,
  bookingsystem, automatisk kontrol og en kollega, der regner efter.
* 11 Forretningskontekst: fra "kunden vil have bedre overblik" til tre konkrete
  ændringer, som en fremmed kan afgøre er lavet.
* 12 Enterprise: at indføre et nyt TMS i en hel afdeling på én gang mod at starte med
  tre disponenter.
* 13 Observability: KPI-tavlen på kontoret. Leveringspræcision, reklamationer, pris per
  sending. Tal over tid, ikke en enkelt god dag.
* 14 Destillation: den procedure, kontoret har kørt hundrede gange, bliver til en
  tjekliste, en elev kan følge uden at tænke. Skønnet bliver hos den erfarne.

## Sprog

* CLAUDE.md-reglerne gælder: dansk brødtekst, engelske fagtermer beholdes (context
  engineering, subagent, harness, tool call, prompt, commit, gate), kort og konkret,
  til én læser, ingen tankestreger, ingen konsulentsprog.
* Læsetekst (hvorfor + kernen + sidebar) højst cirka 600 ord. Hverdagsbilledet koster
  plads, så noget andet skal ud. Fjern først det tekniske.
* Ingen nye faktuelle påstande om værktøjer. Fjern gerne påstande. Kilder beholdes
  uændret, medmindre en kilde nu er helt ubrugt (så beholdes den alligevel, det skader
  ikke).
* Quiz: spørgsmål, der forudsætter at man kan læse kode, omskrives til at handle om
  bestilling, bevis, kontekst og porte. Behold antal spørgsmål og strukturen med
  forklaring per svar.
* Læringsmål og verifikationskriterier omskrives i samme ånd.

## Simulationer (assets/js/simulationer/<id>.js)

* Behold logik, struktur, CSS-klasser og knapper. Omskriv al tekst efter reglerne ovenfor.
* Trin med et felt `kode` må vise tool call-linjen, som den ser ud i transkriptet, fx
  `Read("data/takster.json")` eller `python3 -m fragtvaegt kurer 2 60x40x50:12`. Ingen
  anden kode.
* Notelinjen nederst ("note-lille") skal pege på pointen, ikke på koden.

## Rør ikke

id, slug, del, tidsestimat, startbranch, nulstilKommando, kilder (bortset fra at
tilføje costs-kilden), simulation.id, sidstVerificeret, strukturen af skema og tjekliste
(kolonne-id'er), live- og dashboard-felter.

## Sandboxen (fragtvaegt-sandbox), fakta til brug i tekster

* Beregner fragtpligtig vægt og pris. Transportformer: fly, vej, soe. Zoner 1 til 4.
* Beregneren køres: `python3 -m fragtvaegt fly 2 60x40x50:12` giver 20.0 kg og
  total 1350 DKK. Et kolli skrives som LxBxH:VAEGT i cm og kg.
* Testene: `python3 -m pytest -q`. Startpunktet har én test, der fejler med vilje
  (afrundingen for fly runder ned i stedet for op). Fejler i modul 04, 06 og 09.
* Takstfilen: data/takster.json. README.md er facit for reglerne.
* Komponenter i kursus/: varianter (tynd og udbygget CLAUDE.md), mcp (takstserver med
  zone 5, aktiveres med cp), hooks (port før commit, tændes med git config), byggeklodser
  (skill /takstopdatering, subagent takst-tester, hook efter hver skrivning), destillat
  (opdater_takst.py, kører uden model).
* Modul 11 til 14 bruger desuden Mortens eget projekt tdc-simulator på branchen
  agentkursus. Aldrig main.

## Modulspecifikke ændringer i øvelserne

Selve agent-opgaven er den samme som før i hvert modul. Det, der ændres, er hvad Morten selv
taster, og hvordan bestillingen er formuleret.

* 02: Morten retter selv de to fejl i CLAUDE.md i en teksteditor (`open -e CLAUDE.md` åbner
  filen i TextEdit på Mac). Sig hvad de to fejl er (testkommandoen hedder ikke npm test,
  den rigtige står i README: python3 -m pytest -q; mål er i cm, ikke millimeter). Derefter
  committer agenten hans rettelse: prompt "Commit mine ændringer i CLAUDE.md med beskeden
  Ret CLAUDE.md. Rør ikke andre filer." Derefter den samme testopgave som før, formuleret som
  bestilling med bevis. Ingen `git commit` for Morten.
* 03: Ingen `claude -p`, ingen python3 -c. Forløb: kopiér den tynde CLAUDE.md ind (cp), start
  claude, giv den samme opgave som før (som bestilling), skriv `/context` og `/usage`, notér
  tid (Total duration (API)) og tokens i skemaet, `/exit`. Kopiér den udbyggede ind, gentag.
  Skemaets kolonner tilpasses (fx variant, tid, tokens, hvad agenten gjorde anderledes).
  Tilføj kilden code.claude.com/docs/en/costs (hentet 2026-09-06) for /usage og /context.
  Pointen fra noten (færre turns er ikke målet, færre forkerte er) beholdes.
* 04: Øvelsen (omskriv en svag briefing) er allerede ikke-kodende. Tjek at den svage og den
  stærke briefing og tjeklisten ikke kræver kodeforståelse. Simulationen omskrives (ingen
  math.floor, math.ceil, filnavne som forklaring).
* 05: Sidebaren "Under motorhjelmen" udgår helt. `sed -n 1,40p ...` erstattes af en bestilling:
  "Læs kursus/mcp/takstserver.py og forklar i fem linjer, hvad den kan, hvad den har adgang
  til, og om den kan ændre noget på min maskine. Ændr intet." cp-kommandoen beholdes.
  Opgaven med zone 5 beholdes som bestilling. `/mcp` beholdes.
* 06: Første bestilling beholdes. `git commit -am` erstattes af en bestilling til agenten.
  `git config core.hooksPath kursus/hooks` beholdes som "tænd porten". Anden bestilling
  omskrives uden funktionsnavne og docstring: "Ændr afrundingen for vej, så den runder ned i
  stedet for op, og skriv en forklarende linje i beregneren om, hvordan vej afrundes. Commit
  med beskeden Rund vej ned. Afvises committen, så genopret oprundingen for vej, behold den
  forklarende linje, og commit igen med beskeden Behold oprunding for vej." (Der skal være
  noget at committe efter afvisningen, derfor den forklarende linje.)
* 07: De to `claude -p`-kommandoer bliver to interaktive sessioner med samme bestilling
  (først sekventielt, så med fire subagenter parallelt). Tid og tokens aflæses med `/usage`
  før `/exit`. Skemaet tilpasses. Nævn resultatet fra kursets egen måling (sekventiel 137 s,
  parallel 173 s, dobbelt pris, parallel fandt ikke fejl B) som det står i dag.
* 08: Forløbet beholdes. `cat STATUS.md` beholdes (viser filen). `/exit` beholdes.
* 09: `git mv ... && git commit` bliver en bestilling: "Aktivér workflowen ved at omdøbe
  .github/workflows/ci-og-deploy.yml.deaktiveret til ci-og-deploy.yml, commit med beskeden
  Aktivér workflow, og push branchen arbejde/modul-09." `gh run watch` og `gh run view`
  erstattes af browseren: `open https://github.com/mortensillesen/fragtvaegt-sandbox/actions`
  og en beskrivelse af, hvad han skal se (rød kørsel, derefter grøn, derefter siden).
  Læseteksten forklarer de tre dele (udløser, port, deploy) i ord uden YAML-nøgler.
  Cloudflare-trinnene i sidebar og øvelse beholdes som Mortens egen del.
* 10: `cat` af byggeklodserne bliver en bestilling: "Læs de tre filer ... og forklar i
  én linje hver, hvad de gør. Ændr intet." Aktiveringsblokken (cp-kæden) beholdes som ét
  "tænd"-trin. `/takstopdatering 5` beholdes. Kopiering og nulstilling af takstfilen mellem
  de to kørsler bliver en bestilling til agenten, og sammenligningen (diff) bliver en
  bestilling: "Sammenlign kursus/takster-foerste.json med data/takster.json felt for felt
  og svar identisk eller ikke identisk." (Filnavnet må vælges frit i kursus/-mappen.)
* 11: Forløbet beholdes. `cat CLAUDE.md AGENTKURSUS.md` må beholdes (små tekstfiler), eller
  blive en bestilling om at opsummere dem. `python3 -m http.server 8123` beholdes med en
  forklaring (starter en lille lokal server, så siden kan åbnes i browseren, stoppes med
  Ctrl+C). `git branch --show-current` beholdes som sikkerhedstjek; resten af den kommando
  (log og status) fjernes eller bliver en bestilling.
* 12: Ren skriveøvelse. Læseteksten: fjern indstillingsnavne og filnavne, behold begreberne.
* 13: Shell-løkken erstattes af en bestilling i sandboxen: "Hent alle branches fra origin, gå
  gennem alle branches, der hedder arbejde/modul-*, og vis en tabel med branch og antal commits
  ud over startpunktet. Ændr intet." Dashboardet beholdes. Læseteksten: /usage i stedet for
  eventuelle andre kommandoer, ingen OpenTelemetry-detaljer ud over navnet.
* 14: `cat kursus/destillat/opdater_takst.py` bliver en bestilling om at forklare scriptet.
  `time python3 kursus/destillat/opdater_takst.py 5` beholdes (forklar: time måler, hvor lang
  tid det tog). Kæden med mkdir, cp og claude -p bliver et "tænd"-trin (mkdir og cp som i
  byggeklodsernes README) og en interaktiv bestilling i claude.
