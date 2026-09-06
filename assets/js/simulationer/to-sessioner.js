/* Simulation, modul 08: to sessioner efter hinanden. Hvad foeres videre, hvad tabes. Scriptet. */
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
  var VIDEN = [
    { id: "instruksen", navn: "Testkommandoen står i instruksen CLAUDE.md", fra: "instruksen" },
    { id: "statusfilen", navn: "Session 1 skrev STATUS.md med Gjort, Mangler, Beslutninger, Næste skridt", fra: "statusfilen" },
    { id: "commits", navn: "Session 1 committede undervejs med beskrivende beskeder", fra: "commits" },
    { id: "hukommelsen", navn: "Auto memory: du rettede agenten til at bruge den rigtige testkommando", fra: "hukommelsen" }
  ];
  var SPOERGSMAAL = [
    { sp: "Hvad var opgaven?", kilder: ["statusfilen"] },
    { sp: "Hvilke dele er færdige?", kilder: ["statusfilen", "commits"] },
    { sp: "Hvorfor blev reglen for flere kolli taget fra README og ikke fra koden?", kilder: ["statusfilen"] },
    { sp: "Hvordan kører man testene her?", kilder: ["instruksen", "hukommelsen"] },
    { sp: "Hvad prøvede session 1, som ikke virkede?", kilder: ["statusfilen"] },
    { sp: "Hvad blev der ellers sagt i samtalen i session 1?", kilder: [] }
  ];
  var til = {};
  VIDEN.forEach(function (v) { til[v.id] = v.id === "instruksen"; });
  var liste = el("ul", { class: "handlinger", "aria-live": "polite" });
  function opdater() {
    liste.textContent = "";
    SPOERGSMAAL.forEach(function (q) {
      var ok = q.kilder.some(function (k) { return til[k]; });
      var li = el("li", { class: ok ? "ok" : "mistet" }, [el("span", { text: q.sp })]);
      li.appendChild(el("span", { class: "aarsag", text: ok ? "kan besvares fra " + q.kilder.filter(function (k) { return til[k]; }).join(", ") : (q.kilder.length ? "tabt, session 2 må spørge dig" : "tabt for altid, og det er i orden. Samtalen er historik, ikke viden") }));
      liste.appendChild(li);
    });
  }
  var valg = el("ul", { class: "lag" }, VIDEN.map(function (v) {
    var inp = el("input", { type: "checkbox", id: "viden-" + v.id });
    inp.checked = til[v.id];
    inp.addEventListener("change", function () { til[v.id] = inp.checked; opdater(); });
    return el("li", null, [inp, el("label", { for: "viden-" + v.id, text: v.navn })]);
  }));
  holder.appendChild(el("div", { class: "sim" }, [
    el("div", { class: "kolonner" }, [
      el("div", { class: "kolonne" }, [el("h4", { text: "Det, session 1 efterlod" }), valg]),
      el("div", { class: "kolonne" }, [el("h4", { text: "Det, session 2 kan svare på" }), liste])
    ]),
    el("p", { class: "note-lille", text: "Slå statusfilen til, og se hvor mange linjer der bliver grønne. Slå den fra igen: commits og auto memory fortæller, hvad der blev gjort, ikke hvad der blev besluttet og hvorfor. Det er den forskel, en overdragelse skal dække." })
  ]));
  opdater();
})();
