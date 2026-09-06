/* Dashboard til modul 13: dine egne tal fra de to dage.
   Lokale tal (fremdrift, quiz, minutter) fra localStorage. Repo-tal (commits, koersler per modul) fra Workeren, med statisk eksempel som fallback.
   Bruges af dashboard.html og af modul 13. Kraever fremdrift.js og live.js, og at KURSUS er indlaest. */
(function () {
  "use strict";
  function el(tag, attrs, born) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (born || []).forEach(function (b) { if (b) e.appendChild(typeof b === "string" ? document.createTextNode(b) : b); });
    return e;
  }
  var EKSEMPEL = { repo: "fragtvaegt-sandbox", moduler: [
    { modul: "02", commits: 2, koersler: { success: 0, failure: 0, ialt: 0 } },
    { modul: "06", commits: 2, koersler: { success: 0, failure: 0, ialt: 0 } },
    { modul: "09", commits: 3, koersler: { success: 1, failure: 2, ialt: 3 } }
  ] };

  function tegn(holder, kursus, repoData, erFallback) {
    var f = window.Fremdrift ? window.Fremdrift.laes() : { moduler: {} };
    var perModul = {};
    (repoData.moduler || []).forEach(function (r) { perModul[r.modul] = r; });
    holder.textContent = "";
    var gennemfoert = 0, minutter = 0, quizRigtige = 0, quizMaks = 0;
    var tb = el("tbody");
    kursus.moduler.forEach(function (m) {
      var d = f.moduler[m.id] || {}, r = perModul[m.id];
      if (d.gennemfoert) gennemfoert++;
      minutter += d.forbrugtMinutter || 0;
      if (d.quizScore !== undefined) { quizRigtige += d.quizScore; quizMaks += d.quizMaks || 0; }
      var over = (d.forbrugtMinutter || 0) > m.tidsestimat;
      tb.appendChild(el("tr", { class: over ? "over" : "" }, [
        el("td", { text: m.id + " " + m.titel }),
        el("td", { text: d.gennemfoert ? "ja" : "" }),
        el("td", { text: d.forbrugtMinutter !== undefined ? d.forbrugtMinutter + " / " + m.tidsestimat : "/ " + m.tidsestimat }),
        el("td", { text: d.quizScore !== undefined ? d.quizScore + " af " + d.quizMaks : "" }),
        el("td", { text: r && r.commits !== null && r.commits !== undefined ? String(r.commits) : "" }),
        el("td", { text: r && r.koersler.ialt ? r.koersler.success + " grønne, " + r.koersler.failure + " røde" : "" })
      ]));
    });
    var flest = (repoData.moduler || []).slice().sort(function (a, b) { return (b.commits || 0) + b.koersler.ialt - (a.commits || 0) - a.koersler.ialt; })[0];
    holder.appendChild(el("div", { class: "kort-raekke" }, [
      el("div", { class: "kort" }, [el("div", { class: "tal", text: gennemfoert + " af " + kursus.moduler.length }), el("div", { class: "tekst", text: "moduler gennemført" })]),
      el("div", { class: "kort" }, [el("div", { class: "tal", text: String(minutter) }), el("div", { class: "tekst", text: "minutter brugt" })]),
      el("div", { class: "kort" }, [el("div", { class: "tal", text: quizMaks ? quizRigtige + " af " + quizMaks : "0" }), el("div", { class: "tekst", text: "quizsvar rigtige" })]),
      el("div", { class: "kort" }, [el("div", { class: "tal", text: flest ? "modul " + flest.modul : "ingen" }), el("div", { class: "tekst", text: "flest forsøg i repoet" })])
    ]));
    holder.appendChild(el("div", { class: "tabel-wrap" }, [el("table", { class: "dashboard" }, [
      el("thead", null, [el("tr", null, ["Modul", "Gennemført", "Minutter brugt / estimat", "Quiz", "Commits i repoet", "Kørsler i Actions"].map(function (h) { return el("th", { text: h }); }))]),
      tb
    ])]));
    holder.appendChild(el("p", { class: "meta", text: erFallback ? "Repo-kolonnerne viser eksempeldata, fordi live-koblingen ikke er aktiv. Fremdrift, minutter og quiz er dine egne tal fra denne browser." : "Repo-kolonnerne er hentet live fra " + repoData.repo + " gennem kursets Worker " + (repoData.hentet ? "kl. " + repoData.hentet.slice(11, 16) + " UTC" : "") + ". Fremdrift, minutter og quiz er dine egne tal fra denne browser." }));
  }

  function start(holder, kursus) {
    holder.appendChild(el("p", { class: "pladsholder", text: "Henter tal ..." }));
    var repo = (kursus.dashboardRepo || "fragtvaegt-sandbox");
    var brug = function (data, fb) { tegn(holder, kursus, data, fb); };
    if (window.Live) window.Live.hent("/oversigt?repo=" + encodeURIComponent(repo)).then(function (r) { if (r.ok && r.data && r.data.moduler) brug(r.data, false); else brug(EKSEMPEL, true); });
    else brug(EKSEMPEL, true);
  }
  window.Dashboard = { start: start };
})();
