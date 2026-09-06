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
    { t: "Opgave: \"Vej skal runde ned, ikke op. Ret det og commit.\"" },
    { t: "Agenten ændrer math.ceil til math.floor i afrund_vaegt." },
    { t: "Agenten kører git commit -m \"Rund vej ned\"." },
    { t: "Committen accepteres. Ingen tests kørte, ingen spurgte.", k: "fejl" },
    { t: "test_vej_afrundes_op_til_hele_kilo fejler nu, men ingen ser det før næste gang, nogen kører testene." },
    { t: "Pushes til main. CI findes ikke endnu. Siden deployes.", k: "fejl" },
    { t: "Resultat: en kunde med 100,3 kg faktureres for 100 kg. Fejlen ligger i historikken med en pæn commitbesked.", k: "fejl" }
  ];
  var MED = [
    { t: "Opgave: samme. Porten er aktiv: git config core.hooksPath kursus/hooks." },
    { t: "Agenten ændrer math.ceil til math.floor i afrund_vaegt." },
    { t: "Agenten kører git commit -m \"Rund vej ned\"." },
    { t: "pre-commit kører testene. test_vej_afrundes_op_til_hele_kilo fejler: forventede 101, fik 100. Commit afvist.", k: "fejl" },
    { t: "Agenten læser hookens output. Observation, vurdering: README siger op til hele kg. Opgaven modsiger README." },
    { t: "Agenten genopretter math.ceil, forklarer hvorfor, og committer en ændring, der ikke bryder reglen.", k: "ok" },
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
    el("div", { class: "raekke" }, [tjek, el("label", { for: "sim-port", text: "Port aktiv (pre-commit kører testene)" })]),
    el("div", { class: "kolonne" }, [el("h4", { text: port ? "Med port" : "Uden port" }), ol]),
    el("div", { class: "raekke" }, [naeste, taeller]),
    el("p", { class: "note-lille", text: "Slå porten fra, og spil forløbet igen. Forskellen er ikke agenten. Det er, om nogen siger nej, før fejlen bliver til historik." })
  ]));
  tjek.addEventListener("change", function () { holder.querySelector(".kolonne h4").textContent = port ? "Med port" : "Uden port"; });
  vis();
})();
