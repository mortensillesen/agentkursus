/* Simulation, modul 05: samme opgave med indsat data og med en forbindelse. Scriptet. */
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
  var aendret = false;
  function forloeb() {
    return {
      indsat: [
        { t: "Du åbner takstsystemet i browseren, finder zone 5 og klipper taksterne ind i din bestilling: fly 128,00, soe 3,10." },
        { t: "Agenten læser takstfilen for at se, hvordan en zone er skrevet op." },
        { t: "Agenten skriver zone 5 ind med de tal, du gav den." },
        { t: "Agenten kører testene og melder tilbage." },
        aendret ? { t: "Taksten for fly blev reguleret til 131,00, mens du arbejdede. Agenten ved det ikke, for den fik tallet af dig. Repoet har nu et forkert tal, og ingen af jer opdager det.", k: "fejl" } : { t: "Fire trin, hvoraf det første var dit. Det virker, så længe tallene ikke ændrer sig." }
      ],
      forbindelse: [
        { t: "Du skriver: \"Brug takstserveren til at finde zone 5.\"" },
        { t: "Agenten kalder værktøjet liste_zoner. Svar: zone 5, Oversøisk, tilbyder fly og soe." },
        { t: "Agenten kalder hent_takst for fly og for soe. Svar: 128,00 og 3,10." },
        { t: "Agenten skriver zone 5 ind, kører testene og melder tilbage, også at vej ikke tilbydes." },
        aendret ? { t: "Taksten blev reguleret til 131,00. Agenten slog op, da den skulle bruge tallet, og fik 131,00. Repoet er rigtigt.", k: "ok" } : { t: "Fem trin, alle agentens. Du klippede intet ind. Og du fik at vide, at vej ikke findes i zone 5, hvilket du selv kunne have overset." }
      ]
    };
  }
  var kolonner = el("div", { class: "kolonner" });
  function tegn() {
    var f = forloeb();
    kolonner.textContent = "";
    [["Indsat data", f.indsat], ["Forbindelse (MCP)", f.forbindelse]].forEach(function (par) {
      kolonner.appendChild(el("div", { class: "kolonne" }, [el("h4", { text: par[0] }), el("ol", null, par[1].map(function (t) { return el("li", { class: t.k || "", text: t.t }); }))]));
    });
  }
  var knap = el("button", { type: "button", text: "Lad taksten ændre sig midt i opgaven" });
  knap.addEventListener("click", function () { aendret = !aendret; knap.textContent = aendret ? "Nulstil taksten" : "Lad taksten ændre sig midt i opgaven"; tegn(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Opgaven: tilføj zone 5 til takstfilen. Zone 5 findes kun i det eksterne takstsystem." }),
    kolonner,
    el("div", { class: "raekke" }, [knap]),
    el("table", { class: "sammenlign" }, [
      el("thead", null, [el("tr", null, [el("th", { text: "" }), el("th", { text: "Indsat" }), el("th", { text: "Forbindelse" })])]),
      el("tbody", null, [
        el("tr", null, [el("td", { text: "Trin i alt" }), el("td", { text: "4, det første er dit" }), el("td", { text: "5, alle agentens" })]),
        el("tr", null, [el("td", { text: "Tåler at tallene ændrer sig" }), el("td", { text: "Nej" }), el("td", { text: "Ja" })]),
        el("tr", null, [el("td", { text: "Kræver tillid til fremmed kode" }), el("td", { text: "Nej" }), el("td", { text: "Ja, serveren kører med dine rettigheder" })]),
        el("tr", null, [el("td", { text: "Fanger at vej ikke tilbydes" }), el("td", { text: "Kun hvis du selv så det" }), el("td", { text: "Ja, serveren siger det" })])
      ])
    ])
  ]));
  tegn();
})();
