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
    { fase: "mål", ser: "Din prompt: \"Tilføj --json til kommandolinjen i fragtvaegt/cli.py, kør kommandoen bagefter og vis outputtet. Rør ikke andre filer.\"", goer: "Agenten uddrager målet: JSON-output fra CLI'en, bevist med en kørsel, kun én fil." },
    { fase: "kontekst", ser: "CLAUDE.md, mappestrukturen og git-tilstanden er allerede i vinduet. cli.py er det ikke.", goer: "Beslutter at læse cli.py, før den rører noget." },
    { fase: "handling", ser: "Tool call: Read fragtvaegt/cli.py", goer: "Læser filen.", kode: "Read(\"fragtvaegt/cli.py\")" },
    { fase: "observation", ser: "68 linjer. argparse med transportform, zone, kolli og --tillaeg. Resultatet udskrives med fem print-linjer.", goer: "Ser, at der ikke findes noget flag endnu, og at r allerede er en dict." },
    { fase: "vurdering", ser: "Målet kræver et nyt flag og en gren, der udskriver r som JSON.", goer: "Plan: tilføj --json til parseren, og udskriv json.dumps(r), når flaget er sat." },
    { fase: "handling", ser: "Tool call: Edit fragtvaegt/cli.py", goer: "Tilføjer p.add_argument(\"--json\", action=\"store_true\") og en if-gren med json.dumps(r).", kode: "Edit(\"fragtvaegt/cli.py\")" },
    { fase: "observation", ser: "Værktøjet svarer: filen er opdateret.", goer: "Ved endnu ikke, om det virker. Redigering er ikke bevis." },
    { fase: "handling", ser: "Tool call: Bash python3 -m fragtvaegt fly 2 60x40x50:12 --json", goer: "Kører kommandoen for at se resultatet.", kode: "python3 -m fragtvaegt fly 2 60x40x50:12 --json" },
    { fase: "observation", ser: "Traceback: NameError: name 'json' is not defined", goer: "Kommandoen fejlede. Fejlen står i outputtet.", fejl: true },
    { fase: "vurdering", ser: "json.dumps bruges, men modulet er ikke importeret øverst i filen.", goer: "Her ville en agent uden observation have meldt færdig. Denne læser fejlen og retter årsagen.", fejl: true },
    { fase: "handling", ser: "Tool call: Edit fragtvaegt/cli.py", goer: "Tilføjer import json øverst.", kode: "Edit(\"fragtvaegt/cli.py\")" },
    { fase: "handling", ser: "Tool call: Bash, samme kommando igen", goer: "Kører kommandoen igen. Samme tjek, ny tilstand.", kode: "python3 -m fragtvaegt fly 2 60x40x50:12 --json" },
    { fase: "observation", ser: "{\"fragtpligtig_vaegt\": 20.0, \"vaegtpris\": 1100.0, \"gebyr\": 250, \"tillaeg\": 0.0, \"total\": 1350, \"valuta\": \"DKK\"}", goer: "Outputtet er gyldig JSON med de forventede tal.", ok: true },
    { fase: "vurdering", ser: "Målet er nået: flaget findes, kørslen viste JSON, kun cli.py er ændret.", goer: "Stopper løkken og rapporterer med outputtet som bevis.", ok: true }
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
    el("p", { class: "note-lille", text: "Trin 9 og 10 er den indbyggede fejl. Læg mærke til, at fejlen kun bliver fundet, fordi agenten kørte kommandoen og læste outputtet." })
  ]));
  vis();
})();
