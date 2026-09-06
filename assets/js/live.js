/* Live-kobling til Cloudflare Worker (agentkursus-api).
   Adressen laeses fra kursus.json (feltet workerUrl) via window.KURSUS, saa den kan aendres uden at roere JS.
   Kontrakt: Live.hent(endpoint) returnerer altid et objekt, aldrig en fejl:
   { ok: true, data } eller { ok: false, fallback: true, aarsag }.
   Fremdrift maa aldrig afhaenge af svaret. */
(function () {
  "use strict";
  var TIMEOUT_MS = 4000;

  function workerUrl() {
    var k = window.KURSUS;
    var u = k && typeof k.workerUrl === "string" ? k.workerUrl.trim() : "";
    return u ? u.replace(/\/+$/, "") : null;
  }

  function hent(endpoint) {
    var base = workerUrl();
    if (!base || typeof window.fetch !== "function" || typeof AbortController !== "function") {
      return Promise.resolve({ ok: false, fallback: true, aarsag: "ingen-worker" });
    }
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    return window.fetch(base + endpoint, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("http-" + r.status)); })
      .then(function (data) { return { ok: true, data: data }; })
      .catch(function (e) { return { ok: false, fallback: true, aarsag: String(e && e.message || e) }; })
      .then(function (res) { clearTimeout(timer); return res; });
  }

  window.Live = { hent: hent, workerUrl: workerUrl, TIMEOUT_MS: TIMEOUT_MS };
})();
