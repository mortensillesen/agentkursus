/* Rendrer en modulside ud fra indhold/moduler/<id>.json.
   Siden angiver modul-id i <body data-modul="01">. Tekst haardkodes aldrig i HTML. */
(function () {
  "use strict";

  function el(tag, attrs, born) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (born || []).forEach(function (b) { if (b) e.appendChild(b); });
    return e;
  }

  function afsnit(liste, klasse) {
    return (liste || []).map(function (t) { return el("p", { class: klasse || "brod", text: t }); });
  }

  function sektion(id, titel, born) {
    return el("section", { id: id, "aria-labelledby": id + "-h" }, [el("h2", { id: id + "-h", text: titel })].concat(born));
  }

  function render(m) {
    document.title = m.id + " " + m.titel + " | Agentkursus";
    var main = document.querySelector("main");
    main.textContent = "";

    main.appendChild(el("h1", { text: "Modul " + m.id + ": " + m.titel }));
    main.appendChild(el("p", { class: "meta", text: "Del " + m.del + ". Cirka " + m.tidsestimat + " minutter." }));
    if (m.laeringsmaal && m.laeringsmaal.length) {
      main.appendChild(el("h3", { text: "Efter modulet kan du" }));
      main.appendChild(el("ul", null, m.laeringsmaal.map(function (t) { return el("li", { text: t }); })));
    }

    main.appendChild(sektion("hvorfor", "1. Hvorfor", afsnit(m.hvorfor)));
    main.appendChild(sektion("kernen", "2. Kernen", afsnit(m.kernen)));

    var sim = m.simulation || {};
    main.appendChild(sektion("se-det-ske", "3. Se det ske", [
      el("p", { class: "pladsholder", text: sim.beskrivelse || "Simulation kommer." }),
      el("div", { id: "simulation", "data-simulation": sim.id || "" })
    ]));

    var oe = m.oevelse || { trin: [] };
    var oeBorn = [];
    if (m.startbranch) {
      oeBorn.push(el("p", { class: "brod", text: "Startbranch: " + m.startbranch + ". Stil sandbox-repoet om til modulets startpunkt med:" }));
      oeBorn.push(el("pre", null, [el("code", { text: m.nulstilKommando || "" })]));
    }
    if (oe.forventetMinutter) oeBorn.push(el("p", { class: "meta", text: "Forventet tid: " + oe.forventetMinutter + " minutter." }));
    oeBorn.push(el("ol", null, (oe.trin || []).map(function (t) {
      return el("li", null, [el("span", { text: t.tekst }), t.prompt ? el("pre", null, [el("code", { text: t.prompt })]) : null]);
    })));
    main.appendChild(sektion("goer-det-selv", "4. Gør det selv", oeBorn));

    var v = m.verifikation || {};
    var vBorn = [el("ul", null, (v.kriterier || []).map(function (t) { return el("li", { text: t }); }))];
    if (v.kommando) vBorn.push(el("pre", null, [el("code", { text: v.kommando })]));
    if (v.forventetOutput) vBorn.push(el("p", { class: "brod", text: "Forventet output: " + v.forventetOutput }));
    main.appendChild(sektion("verificer", "5. Verificer", vBorn));

    main.appendChild(sektion("tjek-forstaaelse", "6. Tjek forståelse", (m.quiz || []).map(function (q, i) {
      return el("div", { class: "quiz-spoergsmaal" }, [
        el("p", { class: "brod", text: (i + 1) + ". " + q.spoergsmaal }),
        el("ul", null, (q.svar || []).map(function (s) { return el("li", { text: s }); })),
        el("p", { class: "pladsholder", text: "Interaktiv quiz med forklaringer kommer i Fase 2." })
      ]);
    })));

    main.appendChild(sektion("kilder", "7. Kilder", [el("ul", null, (m.kilder || []).map(function (k) {
      return el("li", null, [el("a", { href: k.url, text: k.titel, rel: "noopener" }), el("span", { text: k.hentet ? " (hentet " + k.hentet + ")" : "" })]);
    }))]));

    main.appendChild(sektion("fremdrift", "8. Fremdrift", [
      el("p", { class: "pladsholder", text: "Markering af gennemført modul og tidsregistrering kommer i Fase 2." })
    ]));

    var fod = document.querySelector("footer .verificeret");
    if (fod) fod.textContent = "Sidst verificeret: " + (m.sidstVerificeret || "ukendt");
  }

  function fejl(besked) {
    var main = document.querySelector("main");
    main.textContent = "";
    main.appendChild(el("h1", { text: "Modulet kunne ikke indlæses" }));
    main.appendChild(el("p", { class: "brod", text: besked }));
    main.appendChild(el("p", { class: "brod", text: "Kører du lokalt, skal siden serveres fra en lokal server, fx: python3 -m http.server" }));
  }

  var id = document.body.getAttribute("data-modul");
  if (!id) { fejl("Siden mangler data-modul på body."); return; }
  fetch("../../indhold/moduler/" + id + ".json")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(render)
    .catch(function (e) { fejl("Kunne ikke hente indhold/moduler/" + id + ".json (" + e.message + ")."); });
})();
