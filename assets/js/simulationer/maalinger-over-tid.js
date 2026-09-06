/* Simulation, modul 13: fire maalinger over tolv uger med haendelser. Scriptet, illustrative tal. */
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
  var UGER = 12;
  var MAAL = [
    { id: "forsoeg", navn: "Forsøg per opgave", basis: 2.0, enhed: "" },
    { id: "roede", navn: "Andel røde kørsler", basis: 10, enhed: " %" },
    { id: "pris", navn: "Omkostning per løst opgave", basis: 0.4, enhed: " $" },
    { id: "dag", navn: "Omkostning per dag", basis: 8, enhed: " $" }
  ];
  var HAEND = [
    { id: "model", navn: "Ny model i uge 5", effekt: function (m, u) { if (u < 5) return 1; return m.id === "forsoeg" ? 0.8 : m.id === "pris" ? 0.85 : 1; } },
    { id: "repo", navn: "Projektet vokser fra uge 3", effekt: function (m, u) { if (u < 3) return 1; var f = 1 + (u - 3) * 0.06; return m.id === "forsoeg" || m.id === "pris" ? f : m.id === "dag" ? f * 1.1 : 1; } },
    { id: "skill", navn: "Skill, der ikke vedligeholdes, fra uge 6", effekt: function (m, u) { if (u < 6) return 1; return m.id === "roede" ? 1 + (u - 6) * 0.35 : m.id === "forsoeg" ? 1 + (u - 6) * 0.12 : 1; } },
    { id: "brug", navn: "Dobbelt så mange brugere fra uge 8", effekt: function (m, u) { if (u < 8) return 1; return m.id === "dag" ? 2 : 1; } }
  ];
  var til = {};
  var tabel = el("table");
  function opdater() {
    tabel.textContent = "";
    var hoved = el("tr", null, [el("th", { text: "Måling" })]);
    for (var u = 1; u <= UGER; u++) hoved.appendChild(el("th", { text: "u" + u }));
    hoved.appendChild(el("th", { text: "Reagerer" }));
    tabel.appendChild(el("thead", null, [hoved]));
    var tb = el("tbody");
    MAAL.forEach(function (m) {
      var tr = el("tr", null, [el("td", { text: m.navn })]);
      var foersteUge = null;
      for (var u = 1; u <= UGER; u++) {
        var v = m.basis;
        HAEND.forEach(function (h) { if (til[h.id]) v *= h.effekt(m, u); });
        var afv = Math.abs(v / m.basis - 1) >= 0.2;
        if (afv && foersteUge === null) foersteUge = u;
        tr.appendChild(el("td", { class: afv ? "fejl" : "", text: (m.id === "roede" ? Math.round(v) : Math.round(v * 100) / 100) + m.enhed }));
      }
      tr.appendChild(el("td", { text: foersteUge ? "uge " + foersteUge : "" }));
      tb.appendChild(tr);
    });
    tabel.appendChild(tb);
  }
  var valg = el("ul", { class: "lag" }, HAEND.map(function (h) {
    var inp = el("input", { type: "checkbox", id: "haend-" + h.id });
    inp.addEventListener("change", function () { til[h.id] = inp.checked; opdater(); });
    return el("li", null, [inp, el("label", { for: "haend-" + h.id, text: h.navn })]);
  }));
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Slå hændelser til, og se hvilken måling der reagerer først. En rød celle afviger mindst 20 procent fra udgangspunktet." }),
    valg,
    el("div", { class: "tabel-wrap" }, [tabel]),
    el("p", { class: "note-lille", text: "Tallene er opdigtede. Pointen er den sidste kolonne: omkostning per dag reagerer på flere brugere, og det er godt. Forsøg per opgave og røde kørsler reagerer på det, der er galt. Derfor er det dem, du følger." })
  ]));
  opdater();
})();
