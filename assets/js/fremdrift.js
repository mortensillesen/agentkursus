/* Fremdrift i localStorage. Noegle: agentkursus.fremdrift.v1
   Per modul: laest, oevelseUdfoert, quizScore, forbrugtMinutter, tidsstempel.
   Eksport og import kommer i Fase 8. Ingen UI i Fase 0. */
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
    } catch (e) {
      return tom();
    }
  }

  function gem(data) {
    try {
      window.localStorage.setItem(NOEGLE, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function opdaterModul(id, felter) {
    var data = laes();
    var nu = data.moduler[id] || {};
    Object.keys(felter).forEach(function (k) { nu[k] = felter[k]; });
    nu.tidsstempel = new Date().toISOString();
    data.moduler[id] = nu;
    return gem(data);
  }

  window.Fremdrift = { NOEGLE: NOEGLE, laes: laes, gem: gem, opdaterModul: opdaterModul };
})();
