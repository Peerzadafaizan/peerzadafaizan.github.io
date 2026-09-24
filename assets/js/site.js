/* Site behaviour: footer year, theme toggle, mobile nav, active-section highlight, scroll reveal, contact form.
   Theme restore + font loading live in head.js (runs before first paint). */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "pfa-theme";

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var effectiveIsDark = current ? current === "dark" : prefersDark;
      var next = effectiveIsDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var byId = {};
    navAnchors.forEach(function (a) { byId[a.getAttribute("href").replace("#", "")] = a; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // Reveal-on-scroll is a progressive enhancement only: elements are visible by default in CSS, and are only
  // "armed" (hidden, then faded/slid in) once we've successfully set up an observer for them. If anything above
  // this point threw, or IntersectionObserver isn't supported, or the user prefers reduced motion, content simply
  // stays visible — it is never hidden with no way to bring it back.
  try {
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) {
        el.classList.add("armed");
        revealObserver.observe(el);
      });
    }
  } catch (e) {}

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#cf-name").value.trim();
      var email = form.querySelector("#cf-email").value.trim();
      var subject = form.querySelector("#cf-subject").value.trim();
      var message = form.querySelector("#cf-message").value.trim();
      if (!name || !email || !subject || !message) {
        if (status) { status.textContent = "Please fill in every field before sending."; status.classList.add("show"); }
        return;
      }
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      var mailto = "mailto:peerfaizan2388@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      if (status) { status.textContent = "Opening your email client to send this message…"; status.classList.add("show"); }
    });
  }
})();
