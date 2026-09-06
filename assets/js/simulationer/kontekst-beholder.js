/* Simulation, modul 03: kontekstvinduet som beholder. Tal for opstart er fra dokumentationens simulation, resten er skoen. */
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
  var MAKS = 200000;
  var OPSTART = [
    { navn: "Systemprompt", tokens: 4200 },
    { navn: "Auto memory", tokens: 680 },
    { navn: "Oplysninger om maskinen", tokens: 280 },
    { navn: "Navne på forbindelserne (MCP)", tokens: 120 },
    { navn: "CLAUDE.md (tynd)", tokens: 100 }
  ];
  var VALG = [
    { navn: "Din bestilling", tokens: 150 },
    { navn: "Læs beregneren", tokens: 900 },
    { navn: "Læs testfilen for pris", tokens: 700 },
    { navn: "Svar fra testene, kort", tokens: 400 },
    { navn: "Hele takstfilen", tokens: 500 },
    { navn: "CLAUDE.md (udbygget) i stedet for tynd", tokens: 500 },
    { navn: "Fejllog på 4000 linjer, indsat", tokens: 60000, advarsel: true },
    { navn: "Research i 20 filer i hovedvinduet", tokens: 25000, advarsel: true },
    { navn: "Samme research hos en subagent, kun resuméet", tokens: 600 },
    { navn: "Tre mislykkede forsøg på samme fejl", tokens: 9000, advarsel: true }
  ];
  var poster = OPSTART.slice();
  var maaler = el("div", { class: "maaler", role: "img", "aria-label": "Fyldning af kontekstvinduet" });
  var fyld = el("span", { class: "fyld" });
  maaler.appendChild(fyld);
  var status = el("p", { "aria-live": "polite" });
  var liste = el("ul", { class: "handlinger" });
  function sum() { return poster.reduce(function (s, p) { return s + p.tokens; }, 0); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function opdater() {
    var s = sum(), pct = Math.min(100, Math.round(100 * s / MAKS));
    fyld.style.width = pct + "%";
    fyld.className = "fyld" + (pct >= 90 ? " fuld" : pct >= 60 ? " advarsel" : "");
    status.textContent = fmt(s) + " af " + fmt(MAKS) + " tokens, " + pct + " %. Tilbage til arbejdet: " + fmt(Math.max(0, MAKS - s)) + "." + (pct >= 60 ? " Kvaliteten falder herfra, og en automatisk komprimering nærmer sig." : "");
    liste.textContent = "";
    poster.forEach(function (p) { liste.appendChild(el("li", { class: p.advarsel ? "mistet" : "ok" }, [el("span", { text: p.navn }), el("span", { class: "aarsag", text: fmt(p.tokens) + " tokens" })])); });
  }
  var chips = el("div", { class: "chips" }, VALG.map(function (v) {
    var b = el("button", { type: "button", class: "sekundaer", text: "+ " + v.navn });
    b.addEventListener("click", function () { poster.push({ navn: v.navn, tokens: v.tokens, advarsel: v.advarsel }); opdater(); });
    return b;
  }));
  var kompakt = el("button", { type: "button", text: "/compact" });
  kompakt.addEventListener("click", function () {
    var samtale = poster.slice(OPSTART.length);
    var s = samtale.reduce(function (a, p) { return a + p.tokens; }, 0);
    poster = OPSTART.slice();
    if (s > 0) poster.push({ navn: "Resumé af samtalen efter /compact", tokens: Math.min(3000, Math.max(300, Math.round(s * 0.05))) });
    opdater();
  });
  var ryd = el("button", { type: "button", class: "sekundaer", text: "/clear" });
  ryd.addEventListener("click", function () { poster = OPSTART.slice(); opdater(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Bordet er 200.000 tokens stort. Opstarten er allerede lagt frem. Læg ting på bordet, og se, hvor meget plads der er tilbage til selve arbejdet." }),
    maaler, status,
    el("h4", { text: "Læg på bordet" }), chips,
    el("div", { class: "raekke" }, [kompakt, ryd]),
    el("h4", { text: "Det ligger der nu" }), liste,
    el("p", { class: "note-lille", text: "Læg fejlloggen ind og se, hvor meget plads den ene beslutning koster. Læg derefter mærke til forskellen på de to research-knapper: samme arbejde, men subagenten sender kun resuméet tilbage. /compact rydder ikke bordet, den lægger et resumé i stedet for samtalen. /clear tager alt fra samtalen væk." })
  ]));
  opdater();
})();
