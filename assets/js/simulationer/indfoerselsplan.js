/* Simulation, modul 12: indfoerselsplan med tempo og kontrol. Scriptet. */
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
  var FELTER = ["permissions", "data", "godkendelse", "kompetence", "tillid"];
  function vurder(tempo, kontrol) {
    /* tempo 1..3: pilot, afdeling, alle. kontrol 1..3: ingen regler, styrede indstillinger, styrede indstillinger og porte */
    var r = {};
    r.permissions = kontrol === 1 ? (tempo === 1 ? "ok: få personer, du kan se hvad de gør" : "risiko: mange maskiner uden fælles regler") : "ok: styrede indstillinger gælder på alle maskiner";
    r.data = kontrol === 1 ? "risiko: ingen har besluttet, hvilke projekter og servere der er tilladt" : (tempo === 3 ? "ok, hvis listen over tilladte servere er kort og vedligeholdt" : "ok: listen over tilladte servere er lille");
    r.godkendelse = kontrol === 3 ? "ok: pull requests og porten på GitHub, før noget lander" : (tempo === 1 ? "acceptabelt: i en pilot kan et menneske nå at læse hver ændring" : "risiko: ændringer lander uden port");
    r.kompetence = tempo === 1 ? "ok: få personer, der kan læres op i at skrive kriterier og læse transkripter" : (tempo === 2 ? "pres: en hel afdeling kræver oplæring og en, der kan hjælpe" : "risiko: kompetencespringet rammer alle på én gang");
    r.tillid = tempo === 1 ? "ok: det første nederlag er lille og lærerigt" : (kontrol === 3 ? "acceptabelt: portene begrænser skaden" : "risiko: det første offentlige nederlag afgør stemningen for alle");
    return r;
  }
  var tempo = 1, kontrol = 2;
  var liste = el("ul", { class: "handlinger", "aria-live": "polite" });
  function opdater() {
    var r = vurder(tempo, kontrol);
    liste.textContent = "";
    FELTER.forEach(function (f) {
      var t = r[f];
      liste.appendChild(el("li", { class: t.indexOf("risiko") === 0 ? "mistet" : "ok" }, [el("b", { text: f + ": " }), el("span", { text: t })]));
    });
  }
  function valg(navn, vaerdier, sat, paa) {
    var wrap = el("div", { class: "raekke", role: "group", "aria-label": navn }, [el("b", { text: navn + ": " })]);
    vaerdier.forEach(function (v, j) {
      var b = el("button", { type: "button", class: j + 1 === sat ? "" : "sekundaer", text: v, "aria-pressed": j + 1 === sat ? "true" : "false" });
      b.addEventListener("click", function () { paa(j + 1); Array.prototype.forEach.call(wrap.querySelectorAll("button"), function (x, k) { x.className = k === j ? "" : "sekundaer"; x.setAttribute("aria-pressed", k === j ? "true" : "false"); }); opdater(); });
      wrap.appendChild(b);
    });
    return wrap;
  }
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Skru på tempo og kontrol, og se konsekvensen for hvert af de fem felter." }),
    valg("Tempo", ["Pilot, 3 personer", "Én afdeling", "Alle på én gang"], tempo, function (v) { tempo = v; }),
    valg("Kontrol", ["Ingen fælles regler", "Styrede indstillinger", "Styrede indstillinger og porte"], kontrol, function (v) { kontrol = v; }),
    liste,
    el("p", { class: "note-lille", text: "Læg mærke til, at kompetence og tillid ikke kan løses med kontrol. De løses med tempo. Det er derfor, dokumentationen anbefaler en lille pilotgruppe og et udgangspunkt at måle imod, før udrulningen udvides." })
  ]));
  opdater();
})();
