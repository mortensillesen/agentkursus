/* Simulation, modul 07: fire spor paa en tidsakse, med og uden kollision. Scriptet. */
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
  var SPOR = [
    { navn: "Spor 1: vægt for soe", fil: "tests/test_soe.py", sek: 35 },
    { navn: "Spor 2: flere kolli", fil: "tests/test_flere_kolli.py", sek: 45 },
    { navn: "Spor 3: tillæg", fil: "tests/test_tillaeg.py", sek: 30 },
    { navn: "Spor 4: kommandolinjen", fil: "tests/test_cli.py", sek: 40 }
  ];
  var kollision = false;
  var wrap = el("div");
  function tegn() {
    wrap.textContent = "";
    var spor = SPOR.map(function (s) { return { navn: s.navn, fil: s.fil, sek: s.sek }; });
    if (kollision) { spor[2].fil = "tests/test_pris.py"; spor[3].fil = "tests/test_pris.py"; spor[2].navn = "Spor 3: tillæg, samme fil"; spor[3].navn = "Spor 4: kommandolinjen, samme fil"; }
    var maks = Math.max.apply(null, spor.map(function (s) { return s.sek; }));
    var sekv = spor.reduce(function (a, s) { return a + s.sek; }, 0);
    var tabel = el("table");
    tabel.appendChild(el("thead", null, [el("tr", null, [el("th", { text: "Spor" }), el("th", { text: "Fil" }), el("th", { text: "Tid, sekunder" })])]));
    var tb = el("tbody");
    spor.forEach(function (s, i) {
      var ramt = kollision && i >= 2;
      var bar = el("div", { class: "maaler", "aria-hidden": "true" }, [el("span", { class: "fyld" + (ramt ? " fuld" : "") })]);
      bar.firstChild.style.width = Math.round(100 * s.sek / maks) + "%";
      tb.appendChild(el("tr", { class: ramt ? "fejl" : "" }, [el("td", { text: s.navn }), el("td", null, [el("code", { text: s.fil })]), el("td", null, [bar, el("span", { text: s.sek + " s" + (ramt ? ", skriver oven i spor " + (i === 2 ? "4" : "3") : "") })])]));
    });
    tabel.appendChild(tb);
    wrap.appendChild(el("div", { class: "tabel-wrap" }, [tabel]));
    var opsum = el("table", { class: "sammenlign" });
    opsum.appendChild(el("tbody", null, [
      el("tr", null, [el("td", { text: "Agenten gør det hele selv, ét spor ad gangen" }), el("td", { text: sekv + " s arbejde, alt i ét kontekstvindue" })]),
      el("tr", null, [el("td", { text: "Fire subagenter samtidig" }), el("td", { text: maks + " s plus opstart og samling, cirka fire gange så mange tokens" })]),
      el("tr", null, [el("td", { text: "Resultat" }), el("td", { text: kollision ? "Spor 3 og 4 skrev i samme fil. Den sidste, der skrev, vandt, og halvdelen af testene forsvandt. Suiten er grøn, fordi det, der mangler, ikke bliver testet." : "Fire filer, intet overlap. Hovedagenten kører hele suiten til sidst og samler." })])
    ]));
    wrap.appendChild(opsum);
  }
  var knap = el("button", { type: "button", text: "Lad spor 3 og 4 røre samme fil" });
  knap.addEventListener("click", function () { kollision = !kollision; knap.textContent = kollision ? "Giv hvert spor sin egen fil igen" : "Lad spor 3 og 4 røre samme fil"; tegn(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Fire uafhængige dele af samme opgave. Tidsaksen viser, hvad parallelitet vinder, og knappen viser, hvad den koster, når delingen er forkert." }),
    wrap,
    el("div", { class: "raekke" }, [knap]),
    el("p", { class: "note-lille", text: "Tiderne her er illustrative. I kursets egen måling var den parallelle kørsel langsommere end den sekventielle, fordi opstart og samling kostede mere, end sporene sparede. Derfor måler du selv i øvelsen." })
  ]));
  tegn();
})();
