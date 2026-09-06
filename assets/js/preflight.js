/* Rendrer pre-flight-siden fra indhold/preflight.json. Afkrydsninger gemmes i fremdrift under preflight. */
(function () {
  "use strict";
  function el(tag, attrs, born) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (born || []).forEach(function (b) { if (b) e.appendChild(typeof b === "string" ? document.createTextNode(b) : b); });
    return e;
  }
  function kopi(tekst, etiket) {
    var pre = el("pre", null, [el("code", { text: tekst })]);
    var knap = el("button", { type: "button", class: "sekundaer", text: "Kopiér", "aria-label": "Kopiér " + etiket });
    knap.addEventListener("click", function () {
      var f = function () { knap.textContent = "Kopieret"; setTimeout(function () { knap.textContent = "Kopiér"; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tekst).then(f, f); else f();
    });
    return el("div", { class: "kopi" }, [el("span", { class: "etiket", text: etiket }), pre, knap]);
  }
  var F = window.Fremdrift;
  function gemt() { var d = F ? F.laes() : {}; return d.preflight || {}; }
  function gemPunkt(id, v) { if (!F) return; var d = F.laes(); d.preflight = d.preflight || {}; d.preflight[id] = v; d.preflight.tidsstempel = new Date().toISOString(); F.gem(d); }

  function render(p) {
    var main = document.querySelector("main");
    main.textContent = "";
    main.appendChild(el("h1", { text: p.titel }));
    main.appendChild(el("p", { class: "meta", text: p.intro }));
    var s = p.script;
    main.appendChild(el("h2", null, [el("span", { class: "nr", text: "1" }), el("span", { text: "Scriptet" })]));
    main.appendChild(el("p", { class: "brod", text: s.intro }));
    main.appendChild(kopi(s.hent, "hent og læs"));
    main.appendChild(kopi(s.koer, "kør"));
    main.appendChild(el("div", { class: "note" }, [el("p", { text: s.efter })]));

    main.appendChild(el("h2", null, [el("span", { class: "nr", text: "2" }), el("span", { text: "Punkterne, ét ad gangen" })]));
    var status = el("div", { class: "status", role: "status" });
    var g = gemt();
    var liste = el("ol", { class: "trin" });
    function opdater() {
      var d = gemt(), n = p.punkter.filter(function (x) { return d[x.id]; }).length;
      status.className = "status " + (n === p.punkter.length ? "ok" : "mangler");
      status.textContent = n + " af " + p.punkter.length + " punkter bekræftet." + (n === p.punkter.length ? " Du er klar til dag 1." : "");
    }
    p.punkter.forEach(function (x) {
      var inp = el("input", { type: "checkbox", id: "pf-" + x.id });
      inp.checked = !!g[x.id];
      inp.addEventListener("change", function () { gemPunkt(x.id, inp.checked); opdater(); });
      var li = el("li", null, [
        el("label", { class: "tjek", for: "pf-" + x.id }, [inp, el("b", { text: x.titel })]),
        kopi(x.kommando, "kommando"),
        el("p", { class: "brod" }, [el("b", { text: "Forventet: " }), x.forventet]),
        el("p", { class: "meta" }, [el("b", { text: "Hvis det fejler: " }), x.hvisFejl])
      ]);
      liste.appendChild(li);
    });
    main.appendChild(liste);
    main.appendChild(status);
    opdater();

    main.appendChild(el("h2", null, [el("span", { class: "nr", text: "3" }), el("span", { text: "Om tidsestimaterne" })]));
    main.appendChild(el("p", { class: "brod", text: p.tid.intro }));
    var fod = document.querySelector("footer .verificeret");
    if (fod) fod.textContent = "Sidst verificeret: " + p.sidstVerificeret;
  }
  fetch("indhold/preflight.json").then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }).then(render)
    .catch(function (e) { var m = document.querySelector("main"); m.textContent = ""; m.appendChild(el("h1", { text: "Siden kunne ikke indlæses" })); m.appendChild(el("p", { text: "Kunne ikke hente indhold/preflight.json (" + e.message + ")." })); });
})();
