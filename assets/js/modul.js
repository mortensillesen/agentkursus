/* Rendrer en modulside ud fra indhold/moduler/<id>.json og indhold/kursus.json.
   Siden angiver modul-id i <body data-modul="01">. Tekst haardkodes aldrig i HTML. */
(function () {
  "use strict";

  /* ---------- smaa hjaelpere ---------- */
  function el(tag, attrs, born) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (born || []).forEach(function (b) { if (b) e.appendChild(typeof b === "string" ? document.createTextNode(b) : b); });
    return e;
  }

  /* inline-markering: `kode` bliver til <code>. Intet andet. */
  function inline(tekst) {
    var frag = document.createDocumentFragment();
    String(tekst).split(/(`[^`]+`)/g).forEach(function (del) {
      if (del.length > 2 && del[0] === "`" && del[del.length - 1] === "`") frag.appendChild(el("code", { text: del.slice(1, -1) }));
      else if (del) frag.appendChild(document.createTextNode(del));
    });
    return frag;
  }
  function p(tekst, klasse) { var e = el("p", klasse ? { class: klasse } : null); e.appendChild(inline(tekst)); return e; }

  function kopiBlok(tekst, etiket) {
    var pre = el("pre", null, [el("code", { text: tekst })]);
    var knap = el("button", { type: "button", class: "sekundaer", text: "Kopiér", "aria-label": "Kopiér " + (etiket || "tekst") });
    knap.addEventListener("click", function () {
      var faerdig = function () { knap.textContent = "Kopieret"; setTimeout(function () { knap.textContent = "Kopiér"; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tekst).then(faerdig, faerdig);
      else { var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); faerdig(); }
    });
    return el("div", { class: "kopi" }, [el("span", { class: "etiket", text: etiket || "" }), pre, knap]);
  }

  /* En blok er en streng (afsnit) eller et objekt med type. */
  function blok(b) {
    if (typeof b === "string") return p(b, "brod");
    switch (b.type) {
      case "h3": return el("h3", { text: b.tekst });
      case "liste": return el(b.nummereret ? "ol" : "ul", null, (b.punkter || []).map(function (t) { var li = el("li"); li.appendChild(inline(t)); return li; }));
      case "citat": return el("blockquote", null, [p(b.tekst), el("p", { class: "kilde" }, [b.url ? el("a", { href: b.url, text: b.kilde, rel: "noopener" }) : el("span", { text: b.kilde })])]);
      case "kode": return kopiBlok(b.tekst, b.etiket || "kommando");
      case "note": return el("div", { class: "note" }, [p(b.tekst)]);
      case "advarsel": return el("div", { class: "advarsel" }, [p(b.tekst)]);
      case "tabel": return el("div", { class: "tabel-wrap" }, [el("table", null, [
        el("thead", null, [el("tr", null, (b.hoved || []).map(function (h) { return el("th", { text: h }); }))]),
        el("tbody", null, (b.raekker || []).map(function (r) { return el("tr", null, r.map(function (c) { var td = el("td"); td.appendChild(inline(c)); return td; })); }))
      ])]);
      default: return p(b.tekst || "", "brod");
    }
  }
  function blokke(liste) { return (liste || []).map(blok); }

  function sektion(id, nr, titel, born) {
    return el("section", { id: id, class: id, "aria-labelledby": id + "-h" }, [el("h2", { id: id + "-h" }, [el("span", { class: "nr", text: String(nr) }), el("span", { text: titel })])].concat(born));
  }

  /* ---------- fremdrift ---------- */
  var F = window.Fremdrift;
  function modulData(id) { var d = F ? F.laes() : { moduler: {} }; return d.moduler[id] || {}; }
  function gemModul(id, felter) { if (F) F.opdaterModul(id, felter); opdaterToplinje(); }

  function opdaterToplinje() {
    var bar = document.querySelector(".top .bar > span");
    var tekst = document.querySelector(".top .fremdrift-tekst");
    if (!bar || !window.KURSUS) return;
    var d = F ? F.laes() : { moduler: {} };
    var antal = window.KURSUS.moduler.filter(function (m) { return d.moduler[m.id] && d.moduler[m.id].gennemfoert; }).length;
    var total = window.KURSUS.moduler.length;
    bar.style.width = Math.round(100 * antal / total) + "%";
    if (tekst) tekst.textContent = antal + " af " + total + " gennemført";
  }

  /* ---------- sektioner ---------- */
  function simulation(m) {
    var sim = m.simulation || {};
    var holder = el("div", { id: "simulation", "data-simulation": sim.id || "", class: "simulation" });
    var born = [];
    if (sim.beskrivelse) born.push(p(sim.beskrivelse, "brod"));
    if (sim.maksMinutter) born.push(p("Maks " + sim.maksMinutter + " minutter.", "meta"));
    born.push(holder);
    var bygget = (window.KURSUS && window.KURSUS.simulationerBygget) || [];
    if (sim.id && bygget.indexOf(sim.id) >= 0) {
      var s = document.createElement("script");
      s.src = "../../assets/js/simulationer/" + sim.id + ".js";
      s.onerror = function () { holder.appendChild(p("Simulationen er ikke bygget endnu. Læs videre, øvelsen kræver den ikke.", "pladsholder")); };
      document.body.appendChild(s);
    } else if (sim.id) {
      holder.appendChild(p("Simulationen er ikke bygget endnu. Læs videre, øvelsen kræver den ikke.", "pladsholder"));
    } else {
      holder.appendChild(p("Ingen simulation i dette modul.", "pladsholder"));
    }
    return born;
  }

  function oevelse(m) {
    var oe = m.oevelse || {};
    var born = [];
    if (oe.intro) born = born.concat(blokke(oe.intro));
    if (m.startbranch && m.nulstilKommando) {
      born.push(p("Startbranch: `" + m.startbranch + "`. Stil sandbox-repoet om til modulets startpunkt, før du begynder. Kommandoen smider ikke noget væk, den laver en ny arbejdsbranch.", "brod"));
      born.push(kopiBlok(m.nulstilKommando, "nulstil"));
    }
    if (oe.forventetMinutter) born.push(p("Forventet tid: " + oe.forventetMinutter + " minutter, heraf under to minutters agenttid.", "meta"));
    born.push(el("ol", { class: "trin" }, (oe.trin || []).map(function (t) {
      var li = el("li");
      li.appendChild(p(t.tekst));
      if (t.kommando) li.appendChild(kopiBlok(t.kommando, "kommando"));
      if (t.prompt) li.appendChild(kopiBlok(t.prompt, "prompt"));
      if (t.note) li.appendChild(el("div", { class: "note" }, [p(t.note)]));
      return li;
    })));
    if (oe.skema) born.push(skema(m.id, oe.skema));
    if (oe.efter) born = born.concat(blokke(oe.efter));
    return born;
  }

  /* Skema: et lille regneark, gemt i fremdrift under moduler[id].skema */
  function skema(id, def) {
    var wrap = el("div", { class: "skema" });
    if (def.titel) wrap.appendChild(el("h3", { text: def.titel }));
    if (def.intro) wrap.appendChild(p(def.intro, "brod"));
    var gemt = modulData(id).skema || [];
    var raekker = gemt.length ? gemt : [];
    var min = def.minRaekker || 5;
    while (raekker.length < min) raekker.push({});
    var tabel = el("table"), tbody = el("tbody");
    tabel.appendChild(el("thead", null, [el("tr", null, def.kolonner.map(function (k) { return el("th", { text: k.label }); }))]));
    tabel.appendChild(tbody);
    var status = el("div", { class: "status", role: "status" });

    function gem() {
      var data = Array.prototype.map.call(tbody.querySelectorAll("tr"), function (tr) {
        var r = {};
        Array.prototype.forEach.call(tr.querySelectorAll("[data-kol]"), function (inp) { r[inp.getAttribute("data-kol")] = inp.value; });
        return r;
      });
      gemModul(id, { skema: data });
      tjek(data);
    }
    function tjek(data) {
      var krav = def.krav;
      if (!krav) return;
      var n = data.filter(function (r) { return (r[krav.kolonne] || "") === krav.vaerdi; }).length;
      var ok = n >= krav.min;
      status.className = "status " + (ok ? "ok" : "mangler");
      status.textContent = (ok ? "Opfyldt: " : "Mangler: ") + n + " af mindst " + krav.min + " rækker med " + krav.label + ".";
    }
    function raekke(r) {
      var tr = el("tr");
      def.kolonner.forEach(function (k) {
        var inp;
        if (k.type === "select") {
          inp = el("select", { "data-kol": k.id, "aria-label": k.label });
          inp.appendChild(el("option", { value: "", text: "vælg" }));
          (k.valg || []).forEach(function (v) { inp.appendChild(el("option", { value: v, text: v })); });
          inp.value = r[k.id] || "";
        } else {
          inp = el("input", { type: "text", "data-kol": k.id, "aria-label": k.label, placeholder: k.pladsholder || "" });
          inp.value = r[k.id] || "";
        }
        inp.addEventListener("change", gem);
        inp.addEventListener("input", gem);
        tr.appendChild(el("td", null, [inp]));
      });
      return tr;
    }
    raekker.forEach(function (r) { tbody.appendChild(raekke(r)); });
    wrap.appendChild(el("div", { class: "tabel-wrap" }, [tabel]));
    var tilfoej = el("button", { type: "button", class: "sekundaer", text: "Tilføj række" });
    tilfoej.addEventListener("click", function () { tbody.appendChild(raekke({})); gem(); });
    wrap.appendChild(el("div", { class: "raekke" }, [tilfoej, status]));
    tjek(raekker);
    return wrap;
  }

  function verifikation(m) {
    var v = m.verifikation || {};
    var born = [];
    if (v.intro) born.push(p(v.intro, "brod"));
    born.push(el("ul", null, (v.kriterier || []).map(function (t) { var li = el("li"); li.appendChild(inline(t)); return li; })));
    if (v.kommando) born.push(kopiBlok(v.kommando, "kommando"));
    if (v.forventetOutput) born.push(p("Forventet output: " + v.forventetOutput, "brod"));
    if (v.hvisDetFejler) born.push(el("div", { class: "note" }, [p(v.hvisDetFejler)]));
    return born;
  }

  function quiz(m) {
    var sp = m.quiz || [];
    var form = el("form", { class: "quiz" });
    var gemt = modulData(m.id);
    sp.forEach(function (q, i) {
      var fs = el("fieldset", null, [el("legend", { text: (i + 1) + ". " + q.spoergsmaal })]);
      q.svar.forEach(function (s, j) {
        var inp = el("input", { type: "radio", name: "q" + i, value: String(j), id: "q" + i + "s" + j });
        fs.appendChild(el("label", { for: "q" + i + "s" + j }, [inp, s]));
      });
      fs.appendChild(el("div", { class: "forklaring", hidden: "" }));
      form.appendChild(fs);
    });
    var resultat = el("p", { class: "resultat", role: "status" });
    if (gemt.quizScore !== undefined) resultat.textContent = "Senest: " + gemt.quizScore + " af " + sp.length + " rigtige.";
    var knap = el("button", { type: "submit", text: "Tjek svar" });
    form.appendChild(el("div", { class: "raekke" }, [knap, resultat]));
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var rigtige = 0, besvaret = 0;
      sp.forEach(function (q, i) {
        var valgt = form.querySelector('input[name="q' + i + '"]:checked');
        var boks = form.querySelectorAll("fieldset")[i].querySelector(".forklaring");
        if (!valgt) { boks.hidden = true; return; }
        besvaret++;
        var j = Number(valgt.value);
        var ok = j === q.korrekt;
        if (ok) rigtige++;
        boks.hidden = false;
        boks.className = "forklaring " + (ok ? "ok" : "fejl");
        boks.textContent = (ok ? "Rigtigt. " : "Forkert. ") + (q.forklaring[j] || "") + (ok ? "" : " Rigtigt svar: " + q.svar[q.korrekt] + ". " + (q.forklaring[q.korrekt] || ""));
      });
      if (besvaret < sp.length) resultat.textContent = "Besvar alle " + sp.length + " spørgsmål. " + rigtige + " af " + besvaret + " besvarede er rigtige.";
      else { resultat.textContent = rigtige + " af " + sp.length + " rigtige."; gemModul(m.id, { quizScore: rigtige, quizMaks: sp.length }); }
    });
    return [form];
  }

  function kilder(m) {
    return [el("ul", null, (m.kilder || []).map(function (k) {
      var li = el("li", null, [el("a", { href: k.url, text: k.titel, rel: "noopener" })]);
      if (k.note) li.appendChild(document.createTextNode(". " + k.note));
      if (k.hentet) li.appendChild(el("span", { class: "meta", text: " Hentet " + k.hentet + "." }));
      return li;
    }))];
  }

  function fremdrift(m, kursus) {
    var d = modulData(m.id);
    var kort = el("div", { class: "kort" });
    function tjek(navn, label) {
      var inp = el("input", { type: "checkbox", id: "fr-" + navn });
      inp.checked = !!d[navn];
      inp.addEventListener("change", function () { var f = {}; f[navn] = inp.checked; gemModul(m.id, f); });
      return el("label", { class: "tjek", for: "fr-" + navn }, [inp, label]);
    }
    kort.appendChild(tjek("laest", "Jeg har læst Hvorfor og Kernen"));
    kort.appendChild(tjek("oevelseUdfoert", "Øvelsen er gennemført og verificeret"));
    var quizTekst = d.quizScore !== undefined ? "Quiz: " + d.quizScore + " af " + d.quizMaks + " rigtige." : "Quiz: ikke taget endnu.";
    kort.appendChild(p(quizTekst, "meta"));

    /* stopur og minutter */
    var minutter = el("input", { type: "number", min: "0", step: "1", id: "fr-min", "aria-label": "Forbrugte minutter" });
    minutter.value = d.forbrugtMinutter !== undefined ? d.forbrugtMinutter : "";
    minutter.addEventListener("change", function () { gemModul(m.id, { forbrugtMinutter: Number(minutter.value) || 0 }); });
    var ur = el("span", { class: "ur", text: "00:00" });
    var start = el("button", { type: "button", class: "sekundaer", text: "Start ur" });
    var tick = null, startTid = null, akk = d.urMs || 0;
    function vis() { var s = Math.round((akk + (startTid ? Date.now() - startTid : 0)) / 1000); ur.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
    vis();
    start.addEventListener("click", function () {
      if (startTid) { akk += Date.now() - startTid; startTid = null; clearInterval(tick); start.textContent = "Start ur"; gemModul(m.id, { urMs: akk }); minutter.value = Math.max(1, Math.round(akk / 60000)); gemModul(m.id, { forbrugtMinutter: Number(minutter.value) }); }
      else { startTid = Date.now(); tick = setInterval(vis, 1000); start.textContent = "Stop ur"; }
    });
    kort.appendChild(el("div", { class: "raekke" }, [el("label", { for: "fr-min", text: "Forbrugt tid i minutter" }), minutter, ur, start]));

    var status = el("p", { class: "gennemfoert", role: "status" });
    var faerdig = el("button", { type: "button", text: d.gennemfoert ? "Markér som ikke gennemført" : "Markér modul som gennemført" });
    function visStatus() { status.textContent = d.gennemfoert ? "Gennemført " + (d.tidsstempel || "").slice(0, 10) + "." : ""; faerdig.textContent = d.gennemfoert ? "Markér som ikke gennemført" : "Markér modul som gennemført"; }
    faerdig.addEventListener("click", function () { d.gennemfoert = !d.gennemfoert; gemModul(m.id, { gennemfoert: d.gennemfoert }); d = modulData(m.id); visStatus(); });
    visStatus();
    kort.appendChild(el("div", { class: "raekke" }, [faerdig, status]));

    var born = [kort];
    /* navigation */
    var idx = kursus.moduler.findIndex(function (x) { return x.id === m.id; });
    var forrige = idx > 0 ? kursus.moduler[idx - 1] : null, naeste = idx < kursus.moduler.length - 1 ? kursus.moduler[idx + 1] : null;
    var nav = el("nav", { class: "modulnav", "aria-label": "Forrige og næste modul" });
    nav.appendChild(forrige && forrige.status !== "planlagt" ? el("a", { href: "../" + forrige.slug + "/", text: "Forrige: " + forrige.id + " " + forrige.titel }) : el("span", { text: forrige ? "Forrige: " + forrige.id + " (kommer)" : "" }));
    nav.appendChild(naeste && naeste.status !== "planlagt" ? el("a", { href: "../" + naeste.slug + "/", text: "Næste: " + naeste.id + " " + naeste.titel }) : el("span", { text: naeste ? "Næste: " + naeste.id + " (kommer)" : "" }));
    born.push(nav);
    return born;
  }

  function live(m) {
    var L = m.live;
    if (!L) return [];
    var liste = el("ul");
    var note = el("p", { class: "meta" });
    var wrap = el("div", { class: "live" }, [L.intro ? p(L.intro, "brod") : null, liste, note]);
    function vis(poster, erFallback) {
      liste.textContent = "";
      (poster || []).forEach(function (c) {
        liste.appendChild(el("li", null, [el("span", { class: "sha", text: c.sha }), el("span", { text: c.besked }), el("span", { class: "dato", text: c.dato })]));
      });
      note.textContent = erFallback ? (L.fallbackNote || "Eksempeldata. Live-koblingen er ikke aktiv, og det blokerer ikke noget.") : (L.liveNote || "Hentet live fra dit repo.");
    }
    vis(L.fallback, true);
    if (window.Live) window.Live.hent(L.endpoint).then(function (r) { if (r.ok && Array.isArray(r.data)) vis(r.data, false); });
    return [wrap];
  }

  /* ---------- render ---------- */
  function render(m, kursus) {
    window.KURSUS = kursus;
    document.title = m.id + " " + m.titel + " | " + kursus.titel;
    var main = document.querySelector("main");
    main.textContent = "";
    var del = kursus.dele.filter(function (d) { return d.nr === m.del; })[0];
    main.appendChild(p("Modul " + m.id + " af " + kursus.moduler.length + (del ? ". Del " + del.nr + ": " + del.titel + ", dag " + del.dag : ""), "meta"));
    main.appendChild(el("h1", { text: m.titel }));
    main.appendChild(el("p", { class: "meta" }, [el("b", { text: "Cirka " + m.tidsestimat + " minutter. " }), el("span", { text: m.undertitel || "" })]));
    if (m.laeringsmaal && m.laeringsmaal.length) {
      main.appendChild(el("div", { class: "laeringsmaal" }, [el("h3", { text: "Efter modulet kan du" }), el("ul", null, m.laeringsmaal.map(function (t) { var li = el("li"); li.appendChild(inline(t)); return li; }))]));
    }
    main.appendChild(sektion("hvorfor", 1, "Hvorfor", blokke(m.hvorfor)));
    var kernen = blokke(m.kernen);
    if (m.sidebar) kernen.push(el("aside", { class: "sidebar", "aria-label": m.sidebar.titel }, [el("h3", { text: m.sidebar.titel })].concat(blokke(m.sidebar.afsnit))));
    main.appendChild(sektion("kernen", 2, "Kernen", kernen));
    main.appendChild(sektion("se-det-ske", 3, "Se det ske", simulation(m)));
    main.appendChild(sektion("goer-det-selv", 4, "Gør det selv", oevelse(m)));
    main.appendChild(sektion("verificer", 5, "Verificér", verifikation(m)));
    if (m.live) main.appendChild(sektion("live", "live", m.live.titel || "Dine egne data", live(m)));
    main.appendChild(sektion("tjek-forstaaelse", 6, "Tjek forståelse", quiz(m)));
    main.appendChild(sektion("kilder", 7, "Kilder", kilder(m)));
    main.appendChild(sektion("fremdrift", 8, "Fremdrift", fremdrift(m, kursus)));
    var fod = document.querySelector("footer .verificeret");
    if (fod) fod.textContent = "Sidst verificeret: " + (m.sidstVerificeret || "ukendt");
    opdaterToplinje();
  }

  function fejl(besked) {
    var main = document.querySelector("main");
    main.textContent = "";
    main.appendChild(el("h1", { text: "Modulet kunne ikke indlæses" }));
    main.appendChild(p(besked, "brod"));
    main.appendChild(p("Kører du lokalt, skal siden serveres fra en lokal server, fx `python3 -m http.server`.", "brod"));
  }

  var id = document.body.getAttribute("data-modul");
  if (!id) { fejl("Siden mangler data-modul på body."); return; }
  Promise.all([
    fetch("../../indhold/moduler/" + id + ".json").then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status + " for " + id + ".json"); return r.json(); }),
    fetch("../../indhold/kursus.json").then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status + " for kursus.json"); return r.json(); })
  ]).then(function (res) { render(res[0], res[1]); })
    .catch(function (e) { fejl("Kunne ikke hente indholdet (" + e.message + ")."); });
})();
