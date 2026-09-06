/* Simulation, modul 14: generel agent mod destillat, med og uden aendret svarformat. Scriptet. */
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
  var kol = el("div", { class: "kolonner" });
  function tegn() {
    kol.textContent = "";
    var generel = [
      { t: "Læser skillens seks trin ind i konteksten" },
      { t: "Spørger takstserveren, hvilke zoner den kender, og læser svaret" },
      { t: "Henter taksten for fly og sø, og læser svarene" },
      aendret ? { t: "Svaret hedder nu \"128,00 kr/kg (fly, zone 5)\". Agenten læser det nye svar og fortsætter.", k: "ok" } : { t: "Skriver taksterne ind i takstfilen" },
      { t: "Hooken kører testene. Subagenten regner efter." },
      { t: "Cirka 8 turns, 70 til 80 sekunder, 0,3 til 0,5 dollar", k: aendret ? "ok" : "" }
    ];
    var destillat = [
      { t: "Sender de samme tre faste forespørgsler til takstserveren, hver gang" },
      { t: "Trækker tallet ud af svaret \"zone 5 (Oversoeisk), fly: 128.00 DKK per kg\"" },
      aendret ? { t: "Svaret hedder nu \"128,00 kr/kg (fly, zone 5)\". Programmet finder intet tal og stopper med en fejl.", k: "fejl" } : { t: "Skriver taksterne ind i takstfilen og kører testene" },
      aendret ? { t: "Du opdager det, fordi kommandoen selv melder, at den fejlede, ikke fordi resultatet er forkert. Rettelsen er tre linjer.", k: "fejl" } : { t: "1 sekund, 0 modelkald, 0 dollar", k: "ok" },
      { t: "Subagenten kaldes til skønnet: 2 turns, 49 sekunder, 0,18 dollar" }
    ];
    kol.appendChild(el("div", { class: "kolonne" }, [el("h4", { text: "Generel agent (modul 10)" }), el("ol", null, generel.map(function (t) { return el("li", { class: t.k || "", text: t.t }); }))]));
    kol.appendChild(el("div", { class: "kolonne" }, [el("h4", { text: "Destillat (modul 14)" }), el("ol", null, destillat.map(function (t) { return el("li", { class: t.k || "", text: t.t }); }))]));
  }
  var knap = el("button", { type: "button", text: "Lad serveren ændre måden, den svarer på" });
  knap.addEventListener("click", function () { aendret = !aendret; knap.textContent = aendret ? "Sæt svaret tilbage" : "Lad serveren ændre måden, den svarer på"; tegn(); });
  holder.appendChild(el("div", { class: "sim" }, [
    el("p", { text: "Samme opgave, to løsninger. Tallene er fra kursets egne kørsler. Knappen viser prisen for destillation." }),
    kol,
    el("div", { class: "raekke" }, [knap]),
    el("p", { class: "note-lille", text: "Destillatet vinder på pris, tid og forudsigelighed. Agenten vinder, den dag noget ændrer sig. Det er handlen, og den skal træffes med åbne øjne." })
  ]));
  tegn();
})();
