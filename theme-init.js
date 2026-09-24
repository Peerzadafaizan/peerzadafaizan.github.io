/* Runs synchronously in <head>, before first paint.
   1) Applies the visitor's saved theme so there is no light/dark flash.
   2) Promotes the preloaded Google Fonts stylesheet once it has loaded (non-render-blocking fonts). */
(function () {
  "use strict";
  try {
    var stored = localStorage.getItem("pfa-theme");
    if (stored === "dark" || stored === "light") document.documentElement.setAttribute("data-theme", stored);
  } catch (e) {}

  var link = document.getElementById("gfonts-css");
  if (!link) return;
  function promote() { if (link.rel !== "stylesheet") link.rel = "stylesheet"; }
  link.addEventListener("load", promote);
  window.setTimeout(promote, 3000);
})();
