/* Simulation, modul 11: et loest behov skaeres til tre opgaver, trin for trin. Scriptet. */
(function () {
  "use strict";
  var holder = document.getElementById("simulation");
  if (!holder) return;
  function el(tag, attrs, born) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (born || []).forEach(function (b) { if (b) e.appendChild(typeof b === "string" ? document.createTextNode(b) : b); });
    return e;
  }
  var TRIN = [
    { etiket: "Behovet, som det blev sagt", tekst: "\"Eleverne skal kunne tage simulatoren med hjem og vise deres beregning til nogen.\"", k: "" },
    { etiket: "Skridt 1: hvad skal være sandt bagefter?", tekst: "Tre svar: en beregning kan deles som link. En beregning kan kopieres som tabel. Man kan se, hvilken transportform der vandt, uden at læse tallene. Tre svar, tre opgaver.", k: "" },
    { etiket: "Opgave 1 med kriterium", tekst: "Del som link: feltværdierne i URL'en, læses ved indlæsning. Accept: åbn den delte adresse i et nyt vindue, og felterne viser samme værdier.", k: "ok" },
    { etiket: "Opgave 2 med kriterium", tekst: "Kopiér tabel: en knap lægger tabellen i udklipsholderen. Accept: indsæt i et regneark, tre kolonner med TDC for fly, vej og sø.", k: "ok" },
    { etiket: "Opgave 3, første forsøg", tekst: "Billigste transportform skal være tydelig. Accept: \"det ser tydeligt ud\".", k: "fejl" },
    { etiket: "Skridt 3 igen: kan en fremmed afgøre det?", tekst: "Nej. Tydeligt er et skøn. Omskriv: rækken med lavest TDC får en markering, og under tabellen står \"Billigst: sø, 12.345 kr under fly\". Accept: ændr fragtprisen for sø, så sø bliver dyrest, og markeringen flytter.", k: "ok" },
    { etiket: "Skridt 4: grænsen", tekst: "Alle tre: kun index.html, rør ikke compute(), rør aldrig main. Bevis: hent siden og vis ændringen. Nu kan agenten få dem, én ad gangen.", k: "ok" },
    { etiket: "Det, der blev afvist", tekst: "\"Simulatoren skal være mere overbevisende\" kom også med i behovet. Det er en beslutning, ikke en opgave. Den går tilbage til den, der sagde det, med spørgsmålet: hvad skal være sandt bagefter?", k: "fejl" }
  ];
  var i = 0;
  var kort = el("div", { class: "trinkort", "aria-live": "polite" });
  var taeller = el("span", { class: "taeller" });
  var naeste = el("button", { type: "button", text: "Næste" });
  var forrige = el("button", { type: "button", class: "sekundaer", text: "Forrige" });
  function vis() {
    var t = TRIN[i];
    kort.className = "trinkort" + (t.k ? " " + t.k : "");
    kort.textContent = "";
    kort.appendChild(el("div", { class: "etiket", text: t.etiket }));
    kort.appendChild(el("p", { text: t.tekst }));
    taeller.textContent = (i + 1) + " af " + TRIN.length;
    forrige.disabled = i === 0;
    naeste.textContent = i === TRIN.length - 1 ? "Forfra" : "Næste";
  }
  naeste.addEventListener("click", function () { i = i === TRIN.length - 1 ? 0 : i + 1; vis(); });
  forrige.addEventListener("click", function () { if (i > 0) { i--; vis(); } });
  holder.appendChild(el("div", { class: "sim" }, [kort, el("div", { class: "raekke" }, [forrige, naeste, taeller]),
    el("p", { class: "note-lille", text: "Det trin, der oftest springes over, er skridt 3: at læse kriteriet som en fremmed. Opgave 3 viser, hvordan det ser ud, når man gør det." })]));
  vis();
})();
