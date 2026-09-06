/* Simulation, modul 10: systemdiagram med fem dele. Slaa en del fra og se hvad der falder ud. Scriptet. */
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
  var DELE = [
    { id: "claudemd", navn: "CLAUDE.md", rolle: "testkommandoen og at README er facit" },
    { id: "skill", navn: "Skill /takstopdatering", rolle: "de seks faste trin" },
    { id: "mcp", navn: "MCP-takstserver", rolle: "forbindelsen til taksterne" },
    { id: "hook", navn: "Hook efter hver skrivning", rolle: "tests uden at nogen beder om det" },
    { id: "agent", navn: "Subagent takst-tester", rolle: "frisk kontekst, regner efter, ændrer intet" }
  ];
  var TRIN = [
    { tekst: "Du starter opgaven med én kommando", kraever: ["skill"], uden: "du skriver seks trin selv, og glemmer et" },
    { tekst: "Zonens takster hentes friske", kraever: ["mcp"], uden: "du klipper tal ind, som kan være forældede" },
    { tekst: "Kun de transportformer, zonen tilbyder, skrives ind", kraever: ["mcp", "skill"], uden: "agenten gætter, om vej findes" },
    { tekst: "Testene kører, når filen er skrevet, uanset hvad", kraever: ["hook"], uden: "testkørslen er et råd, der kan springes over" },
    { tekst: "Agenten kører den rigtige testkommando første gang", kraever: ["claudemd"], uden: "den prøver pytest, som ikke er på PATH" },
    { tekst: "En anden bedømmer resultatet med frisk kontekst", kraever: ["agent"], uden: "den, der skrev, bedømmer sit eget arbejde" },
    { tekst: "Samme oversigt hver gang", kraever: ["skill", "agent"], uden: "formatet varierer fra kørsel til kørsel" }
  ];
  var til = {};
  DELE.forEach(function (d) { til[d.id] = true; });
  var liste = el("ul", { class: "handlinger", "aria-live": "polite" });
  function opdater() {
    liste.textContent = "";
    TRIN.forEach(function (t) {
      var mangler = t.kraever.filter(function (k) { return !til[k]; });
      var li = el("li", { class: mangler.length ? "mistet" : "ok" }, [el("span", { text: t.tekst })]);
      li.appendChild(el("span", { class: "aarsag", text: mangler.length ? "falder ud: " + t.uden : "" }));
      liste.appendChild(li);
    });
  }
  var dele = el("ul", { class: "lag" }, DELE.map(function (d) {
    var inp = el("input", { type: "checkbox", id: "del-" + d.id, checked: "" });
    inp.addEventListener("change", function () { til[d.id] = inp.checked; opdater(); });
    return el("li", null, [inp, el("label", { for: "del-" + d.id }, [el("b", { text: d.navn + ": " }), d.rolle])]);
  }));
  var nulstil = el("button", { type: "button", class: "sekundaer", text: "Alle dele til igen" });
  nulstil.addEventListener("click", function () { DELE.forEach(function (d) { til[d.id] = true; document.getElementById("del-" + d.id).checked = true; }); opdater(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Den tilbagevendende opgave: opdatér takster for en zone. Fem dele bærer den. Slå en del fra, og se hvad der falder ud." }),
    dele,
    el("h4", { text: "Hvad systemet leverer lige nu" }),
    liste,
    el("div", { class: "raekke" }, [nulstil]),
    el("p", { class: "note-lille", text: "Prøv at slå hooken fra alene. Alt ser stadig ud til at virke. Det er forskellen på et råd og en garanti: du ser den først den dag, agenten springer trinnet over." })
  ]));
  opdater();
})();
