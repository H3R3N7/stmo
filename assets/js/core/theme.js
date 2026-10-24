/* ==========================================================================
   HKEMS-STMO · Theme
   Runs before first paint (blocking script in <head>) so the document never
   flashes the wrong scheme.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "hkems-theme";
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function readStored() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0c1418" : "#f7fafb");
  }

  apply(readStored() || (media.matches ? "dark" : "light"));

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", function (event) {
      if (!readStored()) apply(event.matches ? "dark" : "light");
    });
  }

  window.HKTheme = {
    get current() {
      return root.getAttribute("data-theme") || "light";
    },
    apply: apply,
    toggle: function () {
      var next = this.current === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {
        /* private mode — the choice simply does not persist */
      }
      document.dispatchEvent(new CustomEvent("hk:themechange", { detail: { theme: next } }));
      return next;
    }
  };
})();
