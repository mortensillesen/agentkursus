/* Fremdrift i localStorage. Noegle: agentkursus.fremdrift.v1
   Per modul: laest, oevelseUdfoert, quizScore, quizMaks, forbrugtMinutter, urMs, skema, tjekliste, gennemfoert, tidsstempel.
   Eksport og import, fordi localStorage forsvinder uden varsel. */
(function () {
  "use strict";
  var NOEGLE = "agentkursus.fremdrift.v1";

  function tom() { return { version: 1, moduler: {} }; }

  function laes() {
    try {
      var raa = window.localStorage.getItem(NOEGLE);
      if (!raa) return tom();
      var data = JSON.parse(raa);
      if (!data || typeof data !== "object" || !data.moduler) return tom();
      return data;
    } catch (e) { return tom(); }
  }

  function gem(data) {
    try { window.localStorage.setItem(NOEGLE, JSON.stringify(data)); return true; } catch (e) { return false; }
  }

  function opdaterModul(id, felter) {
    var data = laes();
    var nu = data.moduler[id] || {};
    Object.keys(felter).forEach(function (k) { nu[k] = felter[k]; });
    nu.tidsstempel = new Date().toISOString();
    data.moduler[id] = nu;
    return gem(data);
  }

  /* Eksport: en JSON-tekst med dato, klar til fil eller udklipsholder. */
  function eksporter() {
    var data = laes();
    data.eksporteret = new Date().toISOString();
    return JSON.stringify(data, null, 2);
  }

  /* Import: erstatter alt, eller fletter modul for modul. Returnerer { ok, antal } eller { ok: false, fejl }. */
  function importer(tekst, flet) {
    var ind;
    try { ind = JSON.parse(tekst); } catch (e) { return { ok: false, fejl: "Filen er ikke gyldig JSON." }; }
    if (!ind || typeof ind !== "object" || !ind.moduler || typeof ind.moduler !== "object") return { ok: false, fejl: "Filen mangler feltet moduler." };
    var data = flet ? laes() : tom();
    Object.keys(ind.moduler).forEach(function (id) { if (/^\d\d$/.test(id) && ind.moduler[id] && typeof ind.moduler[id] === "object") data.moduler[id] = ind.moduler[id]; });
    if (ind.preflight && typeof ind.preflight === "object") data.preflight = ind.preflight;
    return gem(data) ? { ok: true, antal: Object.keys(data.moduler).length } : { ok: false, fejl: "Kunne ikke gemme i browseren." };
  }

  function nulstil() { try { window.localStorage.removeItem(NOEGLE); return true; } catch (e) { return false; } }

  window.Fremdrift = { NOEGLE: NOEGLE, laes: laes, gem: gem, opdaterModul: opdaterModul, eksporter: eksporter, importer: importer, nulstil: nulstil };
})();
