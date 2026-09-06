/* Simulation, modul 10: systemet med fem dele. Sluk en del og se hvad der falder ud. Scriptet. */
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
    { id: "claudemd", navn: "Instruksen CLAUDE.md", rolle: "hvordan testene køres her, og at README er facit" },
    { id: "skill", navn: "Proceduren /takstopdatering", rolle: "de faste trin, du starter med én kommando" },
    { id: "mcp", navn: "Forbindelsen til takstsystemet", rolle: "dagens takster, hentet i stedet for klippet ind" },
    { id: "hook", navn: "Hooken efter hver skrivning", rolle: "testene kører, uden at nogen beder om det" },
    { id: "agent", navn: "Subagenten takst-tester", rolle: "frisk kontekst, regner efter, ændrer intet" }
  ];
  var TRIN = [
    { tekst: "Du starter hele opgaven med én kommando", kraever: ["skill"], uden: "du skriver alle trinnene selv, og glemmer et af dem" },
    { tekst: "Zonens takster er dagens tal", kraever: ["mcp"], uden: "du klipper tal ind, og de kan være forældede" },
    { tekst: "Kun de transportformer, zonen faktisk tilbyder, skrives ind", kraever: ["mcp", "skill"], uden: "agenten gætter, om zonen overhovedet har vej" },
    { tekst: "Testene kører, så snart takstfilen er skrevet, uanset hvad", kraever: ["hook"], uden: "testkørslen er et råd, agenten kan springe over" },
    { tekst: "Agenten kører den rigtige testkommando første gang", kraever: ["claudemd"], uden: "den gætter, hvordan man kører testene i dette projekt" },
    { tekst: "En anden bedømmer resultatet med frisk kontekst", kraever: ["agent"], uden: "den, der skrev, bedømmer sit eget arbejde" },
    { tekst: "Samme oversigt tilbage hver gang", kraever: ["skill", "agent"], uden: "svaret ser forskelligt ud fra kørsel til kørsel" }
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
  var nulstil = el("button", { type: "button", class: "sekundaer", text: "Tænd alle dele igen" });
  nulstil.addEventListener("click", function () { DELE.forEach(function (d) { til[d.id] = true; document.getElementById("del-" + d.id).checked = true; }); opdater(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Den tilbagevendende opgave: opdatér takster for en zone. Fem dele bærer den. Sluk en del, og se hvad der falder ud." }),
    dele,
    el("h4", { text: "Hvad systemet leverer lige nu" }),
    liste,
    el("div", { class: "raekke" }, [nulstil]),
    el("p", { class: "note-lille", text: "Prøv at slukke hooken alene. Alt ser stadig ud til at virke. Det er forskellen på et råd og en garanti: du opdager den først den dag, agenten springer trinnet over." })
  ]));
  opdater();
})();
