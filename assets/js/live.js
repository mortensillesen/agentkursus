/* Live-kobling til Cloudflare Worker (agentkursus-api). Bygges i Fase 6.
   Kontrakt: Live.hent(endpoint) returnerer altid et objekt, aldrig en fejl.
   { ok: true, data } eller { ok: false, fallback: true, aarsag }.
   Fremdrift maa aldrig afhaenge af svaret. */
(function () {
  "use strict";
  var WORKER_URL = null;        // saettes i Fase 6
  var TIMEOUT_MS = 4000;

  function hent(endpoint) {
    if (!WORKER_URL || typeof window.fetch !== "function" || typeof AbortController !== "function") {
      return Promise.resolve({ ok: false, fallback: true, aarsag: "ingen-worker" });
    }
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    return window.fetch(WORKER_URL + endpoint, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("http-" + r.status)); })
      .then(function (data) { return { ok: true, data: data }; })
      .catch(function (e) { return { ok: false, fallback: true, aarsag: String(e && e.message || e) }; })
      .finally(function () { clearTimeout(timer); });
  }

  window.Live = { hent: hent, TIMEOUT_MS: TIMEOUT_MS };
})();
