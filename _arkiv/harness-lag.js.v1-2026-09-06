/* Simulation, modul 02: harnessens lag. Slaa et lag fra og se, hvilke handlinger agenten mister. */
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
  var LAG = [
    { id: "filio", navn: "Terminal og fil-IO", tekst: "adgang til mappen og kommandolinjen" },
    { id: "tools", navn: "Tool calls", tekst: "Read, Edit, Bash, Grep og de andre indbyggede værktøjer" },
    { id: "perm", navn: "Permissions", tekst: "hvad der må ske uden at spørge dig" },
    { id: "hooks", navn: "Hooks", tekst: "shell-kommandoer på faste tidspunkter i løkken" },
    { id: "mcp", navn: "MCP", tekst: "forbindelser til eksterne systemer" },
    { id: "claudemd", navn: "Projektkontekst (CLAUDE.md)", tekst: "det, agenten ved fra start" }
  ];
  var HANDLINGER = [
    { tekst: "Læse cli.py", kraever: ["filio", "tools"] },
    { tekst: "Redigere cli.py", kraever: ["filio", "tools"] },
    { tekst: "Køre testene", kraever: ["filio", "tools"] },
    { tekst: "Kende testkommandoen uden at gætte", kraever: ["claudemd"] },
    { tekst: "Blive stoppet, før den sletter en fil", kraever: ["perm"] },
    { tekst: "Få testene kørt automatisk efter hver redigering", kraever: ["hooks", "tools"] },
    { tekst: "Slå takster op i det eksterne takstsystem", kraever: ["mcp", "tools"] },
    { tekst: "Svare på et spørgsmål om koden med ren tekst", kraever: [] }
  ];
  var tilstand = {};
  LAG.forEach(function (l) { tilstand[l.id] = true; });
  var liste = el("ul", { class: "handlinger", "aria-live": "polite" });
  function opdater() {
    liste.textContent = "";
    HANDLINGER.forEach(function (h) {
      var mangler = h.kraever.filter(function (k) { return !tilstand[k]; });
      var li = el("li", { class: mangler.length ? "mistet" : "ok" }, [el("span", { text: h.tekst })]);
      if (mangler.length) li.appendChild(el("span", { class: "aarsag", text: "mister: " + mangler.map(function (k) { return LAG.filter(function (l) { return l.id === k; })[0].navn; }).join(", ") }));
      else if (!h.kraever.length) li.appendChild(el("span", { class: "aarsag", text: "kræver kun modellen" }));
      liste.appendChild(li);
    });
    Array.prototype.forEach.call(lagListe.children, function (li) { li.className = tilstand[li.getAttribute("data-lag")] ? "" : "fra"; });
  }
  var lagListe = el("ul", { class: "lag" }, LAG.map(function (l) {
    var inp = el("input", { type: "checkbox", id: "lag-" + l.id, checked: "" });
    inp.addEventListener("change", function () { tilstand[l.id] = inp.checked; opdater(); });
    return el("li", { "data-lag": l.id }, [inp, el("label", { for: "lag-" + l.id }, [el("b", { text: l.navn + ": " }), l.tekst])]);
  }));
  var nulstil = el("button", { type: "button", class: "sekundaer", text: "Slå alle lag til igen" });
  nulstil.addEventListener("click", function () { LAG.forEach(function (l) { tilstand[l.id] = true; document.getElementById("lag-" + l.id).checked = true; }); opdater(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Slå et lag fra, og se hvad agenten mister. Modellen er der stadig, den kan bare mindre." }),
    lagListe,
    el("h4", { text: "Hvad agenten kan lige nu" }),
    liste,
    el("div", { class: "raekke" }, [nulstil]),
    el("p", { class: "note-lille", text: "Prøv at slå Permissions fra alene. Agenten kan stadig alt, men intet stopper den. Prøv derefter kun Projektkontekst: den kan alt, men gætter kommandoerne." })
  ]));
  opdater();
})();
