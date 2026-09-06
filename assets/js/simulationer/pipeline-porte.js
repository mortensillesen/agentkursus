/* Simulation, modul 09: pipeline med tre porte. Slaa dem til og fra. Scriptet. */
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
  var PORTE = [
    { id: "tests", navn: "Port 1: testene kører på GitHub", fanger: ["afrunding"] },
    { id: "review", navn: "Port 2: et menneske ser ændringen igennem før merge", fanger: ["scope", "regel"] },
    { id: "deploy", navn: "Port 3: siden lægges kun op, når porten er grøn", fanger: ["halvfaerdig"] }
  ];
  var AENDRINGER = [
    { id: "afrunding", tekst: "Agenten runder vægten ned for vej i stedet for op", type: "En test fejler" },
    { id: "scope", tekst: "Agenten retter også noget, der lå uden for bestillingen", type: "Testene er grønne, men ændringen er større end bestilt" },
    { id: "regel", tekst: "Agenten ændrer reglen i README, så beregneren passer til den", type: "Testene er grønne, men reglen er nu forkert" },
    { id: "halvfaerdig", tekst: "Arbejdet sendes af sted halvfærdigt, med en test der stadig fejler", type: "Rød kørsel, men er deploy koblet til den?" },
    { id: "ren", tekst: "En korrekt rettelse med et bevis, der kan køres igen", type: "Alt grønt" }
  ];
  var til = { tests: true, review: true, deploy: true };
  var liste = el("ul", { class: "handlinger", "aria-live": "polite" });
  function opdater() {
    liste.textContent = "";
    var slap = 0;
    AENDRINGER.forEach(function (a) {
      var stoppetAf = PORTE.filter(function (p) { return til[p.id] && p.fanger.indexOf(a.id) >= 0; });
      var naaede = stoppetAf.length === 0;
      var farlig = a.id !== "ren" && naaede;
      if (farlig) slap++;
      var li = el("li", { class: farlig ? "mistet" : "ok" }, [el("span", { text: a.tekst })]);
      li.appendChild(el("span", { class: "aarsag", text: farlig ? "nåede produktion. " + a.type : (a.id === "ren" ? "nåede produktion, som den skulle" : "stoppet af " + stoppetAf.map(function (p) { return p.navn; }).join(" og ")) }));
      liste.appendChild(li);
    });
    status.textContent = slap === 0 ? "Intet forkert slap igennem." : slap + " forkert" + (slap > 1 ? "e ændringer" : " ændring") + " nåede produktion.";
    status.className = "status " + (slap === 0 ? "ok" : "mangler");
  }
  var status = el("div", { class: "status", role: "status" });
  var porte = el("ul", { class: "lag" }, PORTE.map(function (p) {
    var inp = el("input", { type: "checkbox", id: "port-" + p.id, checked: "" });
    inp.addEventListener("change", function () { til[p.id] = inp.checked; opdater(); });
    return el("li", null, [inp, el("label", { for: "port-" + p.id, text: p.navn })]);
  }));
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Fem ændringer er på vej mod produktion. Sluk en port, og se hvilke der slipper igennem." }),
    porte, liste, status,
    el("p", { class: "note-lille", text: "Læg mærke til, at testene ikke fanger alt. To af ændringerne er grønne og alligevel forkerte. Dem fanger kun et menneske, der ser ændringen igennem. Det er derfor, review ikke er valgfrit, når noget skal merges til main." })
  ]));
  opdater();
})();
