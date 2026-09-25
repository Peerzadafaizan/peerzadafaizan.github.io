/* Runs synchronously in <head>, before first paint.
   Applies the visitor's saved theme so there is no light/dark flash.
   (The Google Fonts stylesheet is a normal <link rel="stylesheet"> in index.html; fonts use display=swap.) */
(function () {
  "use strict";
  try {
    var stored = localStorage.getItem("pfa-theme");
    if (stored === "dark" || stored === "light") document.documentElement.setAttribute("data-theme", stored);
  } catch (e) {}
})();
