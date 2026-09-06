/* Simulation, modul 04: svag og staerk briefing side om side. Scriptede forloeb. */
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
  var SVAG = {
    titel: "Svag: \"Priserne runder forkert. Fiks det.\"",
    trin: [
      { t: "Søger efter \"round\" i hele repoet. Finder både afrund_vaegt i beregner.py og round() i pris.py." },
      { t: "Kører testene. Ser én fejl i test_fly_afrundes_op_til_naermeste_halve_kilo." },
      { t: "Antager, at den fejlende test er det, du mener med \"priserne runder forkert\"." },
      { t: "Retter math.floor til math.ceil i beregner.py. Testene bliver grønne.", k: "fejl" },
      { t: "Ser også round() i pris.py, men har intet eksempel og ingen regel at holde det op imod. Lader det være." },
      { t: "Rapporterer: \"Afrundingsfejlen er rettet, alle tests består.\"", k: "fejl" },
      { t: "Resultat: en anden fejl end den, du mente, er rettet. Den, du mente, er der stadig, og suiten er grøn. Du opdager det først, når en kunde faktureres 494 i stedet for 495.", k: "fejl" }
    ]
  };
  var STAERK = {
    titel: "Stærk: mål, kendt tilstand, afgrænsning, acceptkriterium, rækkefølge, bevis",
    trin: [
      { t: "Læser README-reglen om halve kroner og pris.py, som briefingen peger på. Læser ikke beregner.py, den er uden for afgrænsningen." },
      { t: "Skriver testen med eksemplet soe, zone 1, 10x10x10:105, forventet 495. Kører den: fejler med 494. Fejlen er nu bevist." },
      { t: "Kører hele suiten før ændringen: 2 fejl, den nye og den kendte i beregner." },
      { t: "Retter afrundingen i beregn_pris til halve-op. Rører ikke afrund_vaegt.", k: "ok" },
      { t: "Kører hele suiten: 1 fejl, den kendte. Præcis som briefingen sagde." },
      { t: "Rapporterer med testoutputtet indsat og en linje om, at den kendte fejl i beregner er ladt være med vilje.", k: "ok" },
      { t: "Resultat: den fejl, du mente, er rettet og dækket af en test. Intet andet er rørt. Du kan verificere det på ti sekunder.", k: "ok" }
    ]
  };
  var i = 0;
  function kolonne(k) {
    var ol = el("ol", null, k.trin.map(function (t) { return el("li", { class: "skjult" + (t.k ? " " + t.k : ""), text: t.t }); }));
    return { wrap: el("div", { class: "kolonne" }, [el("h4", { text: k.titel }), ol]), ol: ol };
  }
  var a = kolonne(SVAG), b = kolonne(STAERK);
  var naeste = el("button", { type: "button", text: "Vis næste trin" });
  var alle = el("button", { type: "button", class: "sekundaer", text: "Vis alle" });
  var taeller = el("span", { class: "taeller" });
  function vis() {
    [a, b].forEach(function (k) { Array.prototype.forEach.call(k.ol.children, function (li, j) { li.classList.toggle("skjult", j >= i); }); });
    taeller.textContent = i + " af " + SVAG.trin.length + " trin";
    naeste.textContent = i >= SVAG.trin.length ? "Forfra" : "Vis næste trin";
  }
  naeste.addEventListener("click", function () { i = i >= SVAG.trin.length ? 0 : i + 1; vis(); });
  alle.addEventListener("click", function () { i = SVAG.trin.length; vis(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Samme opgave, samme kode, to briefinger. Trinnene foldes ud parvis." }),
    el("div", { class: "kolonner" }, [a.wrap, b.wrap]),
    el("div", { class: "raekke" }, [naeste, alle, taeller]),
    el("p", { class: "note-lille", text: "Den svage kørsel er ikke dum. Den er rationel ud fra det, den fik. Den rettede den eneste fejl, der havde et signal. Alt det, den manglede, står i tjeklisten." })
  ]));
  vis();
})();
