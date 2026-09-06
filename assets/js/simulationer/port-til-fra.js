/* Simulation, modul 06: to koersler, med og uden port. Scriptet. */
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
  var UDEN = [
    { t: "Bestilling: \"Vej skal runde ned, ikke op. Ret det, og commit.\"" },
    { t: "Agenten ændrer afrundingen for vej, så den runder ned i stedet for op." },
    { t: "Agenten committer med beskeden \"Rund vej ned\"." },
    { t: "Committen går igennem. Ingen tests blev kørt, ingen sagde noget.", k: "fejl" },
    { t: "Testen for afrundingen af vej fejler nu, men ingen ser det, før nogen tilfældigvis kører testene." },
    { t: "Ændringen bliver lagt ud. Der er ingen port på GitHub endnu, så siden opdateres.", k: "fejl" },
    { t: "Resultat: en kunde med 100,3 kg bliver faktureret for 100 kg. Fejlen står i historikken med en pæn commitbesked.", k: "fejl" }
  ];
  var MED = [
    { t: "Bestilling: den samme. Forskellen er, at porten før commit er tændt." },
    { t: "Agenten ændrer afrundingen for vej, så den runder ned i stedet for op." },
    { t: "Agenten committer med beskeden \"Rund vej ned\"." },
    { t: "Porten kører testene. Testen for afrundingen af vej fejler: den ventede 101 kg og fik 100. Commit afvist.", k: "fejl" },
    { t: "Agenten læser portens svar. Observation, og så en vurdering: README siger op til hele kilo. Bestillingen modsiger reglen." },
    { t: "Agenten genopretter oprundingen, forklarer hvorfor, og committer noget, der ikke bryder reglen.", k: "ok" },
    { t: "Resultat: porten fangede det, agenten rettede sig selv, og du fik en forklaring i stedet for en faktureringsfejl.", k: "ok" }
  ];
  var port = true, i = 0;
  var tjek = el("input", { type: "checkbox", id: "sim-port", checked: "" });
  tjek.addEventListener("change", function () { port = tjek.checked; i = 0; vis(); });
  var ol = el("ol", { "aria-live": "polite" });
  var naeste = el("button", { type: "button", text: "Næste trin" });
  var taeller = el("span", { class: "taeller" });
  function vis() {
    var liste = port ? MED : UDEN;
    ol.textContent = "";
    liste.forEach(function (t, j) { ol.appendChild(el("li", { class: (j >= i ? "skjult " : "") + (t.k || ""), text: t.t })); });
    taeller.textContent = i + " af " + liste.length;
    naeste.textContent = i >= liste.length ? "Forfra" : "Næste trin";
  }
  naeste.addEventListener("click", function () { i = i >= (port ? MED : UDEN).length ? 0 : i + 1; vis(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("div", { class: "raekke" }, [tjek, el("label", { for: "sim-port", text: "Port aktiv (testene køres, før noget kan committes)" })]),
    el("div", { class: "kolonne" }, [el("h4", { text: port ? "Med port" : "Uden port" }), ol]),
    el("div", { class: "raekke" }, [naeste, taeller]),
    el("p", { class: "note-lille", text: "Slå porten fra, og spil forløbet igen. Forskellen er ikke agenten. Det er, om nogen siger nej, før fejlen bliver til historik." })
  ]));
  tjek.addEventListener("change", function () { holder.querySelector(".kolonne h4").textContent = port ? "Med port" : "Uden port"; });
  vis();
})();
