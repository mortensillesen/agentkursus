/* Simulation, modul 01: den agentiske loekke som klikbar sekvens. Scriptet, ingen modelkald. */
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
  var FASER = ["mål", "kontekst", "handling", "observation", "vurdering", "gentag"];
  var TRIN = [
    { fase: "mål", ser: "Din bestilling: \"Tilføj transportformen kurer til beregneren, så den virker hele vejen fra kommandolinjen til prisen. Kør bagefter beregneren for kurer og vis mig outputtet. Ændr ikke noget for fly, vej og soe.\"", goer: "Agenten uddrager målet: en ny transportform, der virker hele vejen til prisen, bevist med en kørsel, og intet andet rørt." },
    { fase: "kontekst", ser: "Projektets instruks (CLAUDE.md), mappestrukturen og git-tilstanden er allerede i vinduet. Takstfilen og beregneren er det ikke.", goer: "Beslutter at læse, før den rører noget." },
    { fase: "handling", ser: "Tool call: læs takstfilen.", goer: "Læser filen.", kode: "Read(\"data/takster.json\")" },
    { fase: "observation", ser: "Filen har fly, vej og soe. For hver af dem står divisor, minimum, gebyr og kr per kg for zone 1 til 4. Ingen kurer.", goer: "Ved nu, hvilke felter en ny transportform skal have, og at tallene fra bestillingen passer til dem." },
    { fase: "vurdering", ser: "Målet kræver kurer i takstfilen med de fem tal, og at afrundingen behandler kurer som fly.", goer: "Plan: skriv kurer ind i takstfilen, og lad afrundingen af vægten følge fly." },
    { fase: "handling", ser: "Tool call: ret takstfilen og afrundingen. To rettelser.", goer: "Skriver kurer ind begge steder.", kode: "Edit(\"data/takster.json\")" },
    { fase: "observation", ser: "Værktøjet svarer: filerne er opdateret.", goer: "Ved endnu ikke, om det virker. En rettelse er ikke et bevis." },
    { fase: "handling", ser: "Tool call: kør beregneren for kurer.", goer: "Kører kommandoen for at se resultatet.", kode: "python3 -m fragtvaegt kurer 2 60x40x50:12" },
    { fase: "observation", ser: "Fejl: transportform kurer er ikke et gyldigt valg. Gyldige valg: fly, vej, soe.", goer: "Kommandoen fejlede. Svaret står i outputtet.", fejl: true },
    { fase: "vurdering", ser: "Beregneren har sin egen liste over tilladte transportformer, og kurer står ikke på den.", goer: "Her ville en agent uden observation have meldt færdig. Denne læser fejlen og leder efter listen.", fejl: true },
    { fase: "handling", ser: "Tool call: søg efter alle steder, hvor de tre transportformer er nævnt.", goer: "Søger i hele pakken.", kode: "Grep(\"soe\")" },
    { fase: "observation", ser: "Listen findes to steder: i kommandolinjen og i beskrivelsen af en forsendelse.", goer: "Begge steder skal have kurer med." },
    { fase: "handling", ser: "Tool call: ret de to lister.", goer: "Tilføjer kurer begge steder.", kode: "Edit(\"fragtvaegt/cli.py\")" },
    { fase: "handling", ser: "Tool call: samme kommando igen.", goer: "Kører beregneren igen. Samme tjek, ny tilstand.", kode: "python3 -m fragtvaegt kurer 2 60x40x50:12" },
    { fase: "observation", ser: "Fragtpligtig vaegt: 24.0 kg. Vaegtpris: 912.00 DKK. Gebyr: 120.00 DKK. Total: 1032 DKK.", goer: "Outputtet viser en pris for kurer, og tallene passer med bestillingen: 24 kg gange 38 kr plus 120 kr.", ok: true },
    { fase: "vurdering", ser: "Målet er nået: kurer virker fra kommandolinjen til prisen, kørslen viste det, og fly, vej og soe er ikke rørt.", goer: "Stopper løkken og rapporterer med outputtet som bevis.", ok: true }
  ];
  var i = 0;
  var faser = el("ul", { class: "faser", "aria-label": "Faser i løkken" }, FASER.map(function (f) { return el("li", { text: f, "data-fase": f }); }));
  var kort = el("div", { class: "trinkort", "aria-live": "polite" });
  var taeller = el("span", { class: "taeller" });
  var forrige = el("button", { type: "button", class: "sekundaer", text: "Forrige" });
  var naeste = el("button", { type: "button", text: "Næste trin" });
  function vis() {
    var t = TRIN[i];
    Array.prototype.forEach.call(faser.children, function (li) { li.className = li.getAttribute("data-fase") === t.fase ? "aktiv" + (t.fejl ? " fejl" : "") : ""; });
    if (i > 0 && TRIN[i - 1].fase === "vurdering" && t.fase === "handling") faser.lastChild.className = "aktiv";
    kort.className = "trinkort" + (t.fejl ? " fejl" : "") + (t.ok ? " ok" : "");
    kort.textContent = "";
    kort.appendChild(el("div", { class: "etiket", text: "Trin " + (i + 1) + ": " + t.fase }));
    kort.appendChild(el("p", null, [el("b", { text: "Agenten ser: " }), t.ser]));
    if (t.kode) kort.appendChild(el("pre", null, [el("code", { text: t.kode })]));
    kort.appendChild(el("p", null, [el("b", { text: "Agenten gør: " }), t.goer]));
    taeller.textContent = (i + 1) + " af " + TRIN.length;
    forrige.disabled = i === 0;
    naeste.textContent = i === TRIN.length - 1 ? "Forfra" : "Næste trin";
  }
  forrige.addEventListener("click", function () { if (i > 0) { i--; vis(); } });
  naeste.addEventListener("click", function () { i = i === TRIN.length - 1 ? 0 : i + 1; vis(); });
  holder.appendChild(el("div", { class: "sim" }, [
    faser, kort,
    el("div", { class: "raekke" }, [forrige, naeste, taeller]),
    el("p", { class: "note-lille", text: "Trin 9 og 10 er den indbyggede fejl. Den bliver kun fundet, fordi agenten kørte beregneren og læste svaret. Du behøver ikke forstå rettelserne. Du skal kunne se, at der kom en observation mellem dem." })
  ]));
  vis();
})();
