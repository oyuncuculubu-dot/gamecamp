/* TikFinity AZ — environment shim.
 * Local (http://localhost:4000/widgets/...): relative URLs.
 * Remote (https://*.github.io/... or file://): talks to the local studio at http://127.0.0.1:4000
 * (Chromium treats 127.0.0.1 as a secure context, so this is allowed from https pages). */
(function (root) {
  'use strict';
  var qs = new URLSearchParams(root.location.search);
  var remote = root.location.protocol === 'file:' || /\.github\.io$/i.test(root.location.hostname) || qs.has('studio');
  var port = qs.get('port') || '4000';
  var API = remote ? (qs.get('studio') || ('http://127.0.0.1:' + port)).replace(/\/+$/, '') : '';
  function asset(u) {
    if (!u) return u;
    u = String(u);
    if (remote && u.charAt(0) === '/' && u.indexOf('/assets/') === 0) return u.slice(1); // relative to /w/
    return u;
  }
  // Fetch state + live SSE stream with auto-reconnect (studio may not be running yet).
  function connect(onData, opts) {
    opts = opts || {};
    var es = null, timer = null, delay = 1000;
    function loadState() {
      return fetch(API + '/api/state', { cache: 'no-store' }).then(function (r) { return r.json(); })
        .then(function (d) { if (opts.onState) opts.onState(d); else onData(d); return true; });
    }
    function schedule() {
      if (timer) return;
      timer = setTimeout(function () { timer = null; start(); }, delay);
      delay = Math.min(delay * 2, 10000);
    }
    function start() {
      if (es) { try { es.close(); } catch (_) {} es = null; }
      loadState().catch(function () {});
      if (typeof EventSource !== 'function' || opts.noLive) return;
      try { es = new EventSource(API + '/events'); } catch (_) { return schedule(); }
      es.onopen = function () { delay = 1000; };
      es.onmessage = function (ev) { try { onData(JSON.parse(ev.data)); } catch (_) {} };
      es.onerror = function () { if (es && es.readyState === 2) { es = null; schedule(); } };
    }
    start();
  }
  root.TF = { remote: remote, API: API, asset: asset, connect: connect };
})(window);
