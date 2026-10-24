/* ==========================================================================
   HKEMS-STMO · Home page
   Scroll-snap carousel with autoplay, keyboard and pointer support.
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;

  function initCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".carousel__dot"));
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    if (!track || slides.length < 2) return;

    var index = 0;
    var timer = null;
    var paused = false;
    var INTERVAL = 6500;

    function slideLeft(slide) {
      return slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    }

    function goTo(nextIndex, smooth) {
      index = (nextIndex + slides.length) % slides.length;
      track.scrollTo({ left: slideLeft(slides[index]), behavior: smooth === false ? "auto" : "smooth" });
      syncDots();
    }

    function syncDots() {
      dots.forEach(function (dot, i) {
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
        dot.tabIndex = i === index ? 0 : -1;
      });
    }

    function nearestIndex() {
      var center = track.scrollLeft + track.clientWidth / 2;
      var best = 0;
      var bestDistance = Infinity;
      slides.forEach(function (slide, i) {
        var slideCenter = slideLeft(slide) + slide.offsetWidth / 2;
        var distance = Math.abs(slideCenter - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      return best;
    }

    var scrollTick = false;
    track.addEventListener(
      "scroll",
      function () {
        if (scrollTick) return;
        scrollTick = true;
        window.requestAnimationFrame(function () {
          scrollTick = false;
          var found = nearestIndex();
          if (found !== index) {
            index = found;
            syncDots();
          }
        });
      },
      { passive: true }
    );

    function start() {
      stop();
      if (paused || document.hidden) return;
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, INTERVAL);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    if (prev) prev.addEventListener("click", function () { goTo(index - 1); start(); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); start(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        start();
      });
    });

    root.addEventListener("pointerenter", function () {
      paused = true;
      stop();
    });
    root.addEventListener("pointerleave", function () {
      paused = false;
      start();
    });
    root.addEventListener("focusin", function () {
      paused = true;
      stop();
    });
    root.addEventListener("focusout", function () {
      paused = false;
      start();
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
        start();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
        start();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    syncDots();
    if (!reduced) start();
  }

  function init() {
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
