/* ==========================================================================
   HKEMS-STMO · Article helpers
   Builds the table of contents, tracks reading position and lazy-loads
   third-party video embeds only after an explicit click.
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;

  function initToc() {
    var toc = document.getElementById("article-toc");
    var article = document.querySelector(".article");
    if (!toc || !article) return;

    var headings = Array.prototype.slice.call(article.querySelectorAll("h2[id], h3[id]"));
    if (!headings.length) {
      toc.hidden = true;
      return;
    }

    toc.innerHTML =
      '<p class="toc__title">本文目录</p>' +
      headings
        .map(function (heading) {
          return (
            '<a class="toc__link" href="#' +
            heading.id +
            '" data-toc="' +
            heading.id +
            '">' +
            heading.textContent +
            "</a>"
          );
        })
        .join("");

    var links = Array.prototype.slice.call(toc.querySelectorAll(".toc__link"));
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var target = document.getElementById(link.getAttribute("data-toc"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", "#" + target.id);
      });
    });

    if (!("IntersectionObserver" in window)) return;

    var visible = new Map();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        var bestId = null;
        var bestRatio = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (!bestId && headings.length) bestId = headings[0].id;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("data-toc") === bestId);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  function initEmbeds() {
    document.querySelectorAll("[data-embed]").forEach(function (placeholder) {
      placeholder.addEventListener("click", function (event) {
        event.preventDefault();
        var holder = placeholder.closest(".video-embed");
        if (!holder) return;
        var src = placeholder.getAttribute("data-embed");
        if (!src) return;
        var iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        iframe.title = placeholder.getAttribute("data-title") || "嵌入视频";
        holder.innerHTML = "";
        holder.appendChild(iframe);
        HK.toast("已加载外部视频，数据由对应平台提供");
      });
    });
  }

  function init() {
    initToc();
    initEmbeds();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
