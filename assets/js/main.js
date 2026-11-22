/* Placeholder mirror: day/night toggle and the mobile navigation drawer. */
(function () {
  "use strict";
  var root = document.documentElement;

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  var nav = document.querySelector("nav.x-site-nav");
  var drawer = document.querySelector(".nav-drawer");
  var menuBtn = document.querySelector(".menu-btn");
  var overlay = document.querySelector(".overlay");
  var logo = document.querySelector(".nav-logo");
  var previousOverflow = "";
  var isOpen = false;
  var drawerTween = 0;

  function drawerTarget() {
    return Math.min(320, Math.round(window.innerWidth * 0.85));
  }

  // revanced.app grows the drawer out of the left edge (width 0 -> 20rem)
  // instead of sliding it; the content is squeezed while it opens.
  function animateDrawer(to, done) {
    if (!drawer) return;
    cancelAnimationFrame(drawerTween);
    var from = parseFloat(drawer.style.width) || 0;
    // the left inset grows with the panel: the buttons start flush with the
    // page edge and are pushed inwards while the drawer slides out
    var padMax = 16;
    // keep the labels on one line while the panel width changes
    drawer.classList.add("freezing");
    var startPad = to === 0 ? padMax : 0;
    drawer.style.paddingLeft = startPad + "px";
    var startTime = 0;
    drawer.style.visibility = "visible";
    drawer.style.overflow = "hidden";
    function step(now) {
      if (!startTime) startTime = now;
      var duration = to === 0 ? 240 : 360;
      var p = Math.min(1, (now - startTime) / duration);
      var eased = to === 0
        ? 1 - Math.pow(1 - p, 3)
        : 1 - Math.pow(1 - p, 6);
      var width = from + (to - from) * eased;
      drawer.style.width = width + "px";
      var pad = startPad + ((to === 0 ? 0 : padMax) - startPad) * eased;
      drawer.style.paddingLeft = pad.toFixed(2) + "px";
      if (to === 0 && width < 44) drawer.style.visibility = "hidden";
      if (p < 1) {
        drawerTween = requestAnimationFrame(step);
      } else {
        drawer.style.width = to + "px";
        drawer.style.overflow = to === 0 ? "hidden" : "hidden auto";
        drawer.style.paddingLeft = "";
        drawer.classList.remove("freezing");
        if (to === 0) {
          drawer.style.visibility = "hidden";
          drawer.style.width = "0px";
        }
        if (done) done();
      }
    }
    drawerTween = requestAnimationFrame(step);
  }


  function openMenu() {
    if (!drawer || !menuBtn) return;
    previousOverflow = root.style.overflow;
    drawer.classList.remove("desktop-only");
    drawer.classList.add("open");
    menuBtn.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    if (overlay) {
      overlay.hidden = false;
      requestAnimationFrame(function () { overlay.classList.add("show"); });
    }
    if (logo) logo.classList.add("hidden");
    root.style.overflow = "hidden";
    isOpen = true;
    animateDrawer(drawerTarget());
  }

  function closeMenu() {
    if (!drawer || !menuBtn) return;
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (overlay) {
      overlay.classList.remove("show");
      window.setTimeout(function () {
        if (!isOpen) overlay.hidden = true;
      }, 300);
    }
    if (logo) logo.classList.remove("hidden");
    root.style.overflow = previousOverflow;
    animateDrawer(0);
  }

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-controls", "site-navigation");
    menuBtn.addEventListener("click", function () {
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
  }

  if (overlay) overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  // Crossing the breakpoint must not animate: at desktop widths the drawer is
  // a normal flex container, at mobile it has to start collapsed at width 0.
  function syncNavMode() {
    if (!drawer) return;
    if (window.innerWidth > 768) {
      cancelAnimationFrame(drawerTween);
      drawer.style.width = "";
      drawer.style.visibility = "";
      drawer.style.overflow = "";
      if (isOpen) closeMenu();
      return;
    }
    if (!isOpen) {
      cancelAnimationFrame(drawerTween);
      drawer.style.width = "0px";
      drawer.style.visibility = "hidden";
    }
  }
  window.addEventListener("resize", syncNavMode);
  syncNavMode();

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 4);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Homepage hero wave: collapses as soon as the wave leaves the viewport
     bottom, exactly like revanced.app. */
  var wave = document.querySelector(".wave-container");
  if (wave) {
    var hero = document.querySelector("main.x-home");
    var links = document.querySelector(".external-links");
    var syncWave = function () {
      var visible = !(wave.getBoundingClientRect().bottom < window.innerHeight - 1);
      wave.classList.toggle("visible", visible);
      if (hero) hero.classList.toggle("collapsed", !visible);
      if (links) links.classList.toggle("hidden", !visible);
    };
    window.addEventListener("scroll", syncWave, { passive: true });
    window.addEventListener("resize", syncWave);
    syncWave();
  }
})();

/* ---- announcements page: archive toggle + site-wide sitemap search ---- */
(function () {
  var toggle = document.querySelector(".archive-toggle");
  var panel = document.querySelector(".archive-content");
  if (toggle && panel) {
    var chev = toggle.querySelector(".archive-chevron");
    var startOpen = toggle.getAttribute("aria-expanded") === "true" ||
                    panel.style.maxHeight === "none";
    var open = false;
    panel.style.overflow = "hidden";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    var apply = function (state) {
      open = state;
      panel.style.maxHeight = state ? panel.scrollHeight + "px" : "0px";
      if (chev) chev.classList.toggle("open", state);
      toggle.setAttribute("aria-expanded", state ? "true" : "false");
    };
    var flip = function () { apply(!open); };
    /* initialise without a 0-px dip: the page may already render expanded */
    panel.style.transition = "none";
    apply(startOpen);
    void panel.offsetHeight;
    panel.style.transition = "";
    toggle.addEventListener("click", flip);
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    window.addEventListener("resize", function () {
      if (open) panel.style.maxHeight = panel.scrollHeight + "px";
    });
    window.addEventListener("load", function () {
      if (open) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  }

  var input = document.querySelector(".search-container input");
  if (!input) return;

  /* site map used by the header search: every mirrored page */
  var PAGES = [
    { title: "首页", href: "index.html", keys: "home index start main hero landing 首页" },
    { title: "加入我们", href: "joinus.html", keys: "join download joinus apk install patch 加入" },
    { title: "关于我们", href: "aboutus.html", keys: "about contributors people team repositories 关于" },
    { title: "赞助我们", href: "donate.html", keys: "donate sponsor support team crypto 赞助" },
    { title: "Announcements", href: "announcements.html", keys: "announcements news archive list posts" },
    { title: "\u65b0\u578b\u65e0\u7ebf\u7535\u7b80\u8bed QBG", href: "pages/bd7qbg.html", keys: "qbg bd7qbg \u4e1a\u4f59\u65e0\u7ebf\u7535 \u5929\u9988" },
    { title: "2027\u5c4a\u65b0\u751f\u52a0\u7fa4\u9a8c\u8bc1", href: "pages/2027.html", keys: "2027 \u65b0\u751f \u52a0\u7fa4 \u9a8c\u8bc1" },
    { title: "\u516c\u544a\u6807\u51c6\u6a21\u677f", href: "pages/article.html", keys: "article template \u6807\u9898 \u6a21\u677f" },
    { title: "2023\u5e74\u5b9e\u9a8c\u6587\u521b\u9884\u552e", href: "pages/culture-creative-2023.html", keys: "\u6587\u521b \u9884\u552e \u4f17\u7b79 \u5468\u8fb9" },
    { title: "\u79d1\u6280\u6559\u5ba4\u4f7f\u7528\u5b89\u6392", href: "pages/use-scheduling.html", keys: "\u79d1\u6280\u6559\u5ba4 \u4f7f\u7528 \u5b89\u6392 \u9ad8\u8003" }
  ];

  var box = document.createElement("div");
  box.setAttribute("role", "listbox");
  box.style.cssText = "position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:60;" +
    "background:var(--surface-two,#1a191f);border:1px solid var(--border,#2c2c38);" +
    "border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.25);overflow:hidden;display:none;";
  var wrap = input.closest(".search-container") || input.parentElement;
  wrap.style.position = "relative";
  wrap.appendChild(box);

  var rows = [];
  var active = -1;

  var paint = function () {
    box.innerHTML = "";
    rows = [];
    var q = input.value.trim().toLowerCase();
    var hits = PAGES.filter(function (p) {
      return !q || (p.title + " " + p.keys).toLowerCase().indexOf(q) > -1;
    });
    hits.forEach(function (p) {
      var row = document.createElement("div");
      row.setAttribute("role", "option");
      row.style.cssText = "padding:10px 14px;display:flex;align-items:center;justify-content:space-between;" +
        "gap:12px;cursor:pointer;color:var(--text-one,#eee);font-size:.95rem;";
      var name = document.createElement("span");
      name.textContent = p.title;
      var path = document.createElement("span");
      path.textContent = p.href;
      path.style.cssText = "color:var(--text-four,#8b93a1);font-size:.8rem;";
      row.appendChild(name);
      row.appendChild(path);
      row.addEventListener("mousedown", function (e) { e.preventDefault(); });
      row.addEventListener("click", function () { window.location.href = p.href; });
      row.addEventListener("mouseenter", function () { setActive(rows.indexOf(row)); });
      box.appendChild(row);
      rows.push(row);
    });
    active = rows.length ? 0 : -1;
    setActive(active);
    box.style.display = hits.length ? "block" : "none";
  };

  var setActive = function (i) {
    rows.forEach(function (r, k) {
      r.style.background = k === i ? "var(--surface-four,#262633)" : "transparent";
    });
    active = i;
  };

  input.setAttribute("autocomplete", "off");
  input.addEventListener("focus", paint);
  input.addEventListener("input", paint);
  input.addEventListener("keydown", function (e) {
    if (!rows.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((active + 1) % rows.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((active - 1 + rows.length) % rows.length); }
    else if (e.key === "Enter") { e.preventDefault(); rows[Math.max(active, 0)].click(); }
    else if (e.key === "Escape") { box.style.display = "none"; input.blur(); }
  });
  document.addEventListener("mousedown", function (e) {
    if (!wrap.contains(e.target)) box.style.display = "none";
  });
})();

/* ---- contributors page: repo accordion (same principle as the announcements archive) ---- */
(function () {
  var boxes = document.querySelectorAll(".repos .container");
  Array.prototype.forEach.call(boxes, function (box) {
    var head = box.querySelector(".title");
    var grid = box.querySelector(".contributors");
    var arrow = head ? head.querySelector(".arrow") : null;
    if (!head || !grid) return;

    grid.style.overflow = "hidden";
    grid.style.transition = "max-height .35s cubic-bezier(.4, 0, .2, 1), opacity .25s linear";

    var open = true;

    var apply = function (state) {
      if (state) {
        grid.style.maxHeight = grid.scrollHeight + "px";
        grid.style.opacity = "1";
      } else {
        grid.style.maxHeight = "0px";
        grid.style.opacity = "0";
      }
      head.classList.toggle("closed", !state);
      if (arrow) arrow.classList.toggle("rotated", !state);
      head.setAttribute("aria-expanded", state ? "true" : "false");
    };

    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    apply(open);

    var flip = function () { open = !open; apply(open); };
    head.addEventListener("click", function (event) {
      event.preventDefault();
      flip();
    });
    head.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flip(); }
    });
    window.addEventListener("resize", function () { if (open) grid.style.maxHeight = grid.scrollHeight + "px"; });
    window.addEventListener("load", function () { if (open) grid.style.maxHeight = grid.scrollHeight + "px"; });
  });
})();

/* ---- footer: terms & privacy modal ---- */
(function () {
  var modal = document.getElementById("terms-modal");
  var opener = document.querySelector("[data-open-terms]");
  if (!modal || !opener) return;
  var panel = modal.querySelector(".terms-dialog");
  var closeBtn = modal.querySelector(".terms-close");
  var lastFocus = null;
  var show = function () {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("terms-open");
    if (panel && panel.focus) panel.focus();
  };
  var hide = function () {
    modal.hidden = true;
    document.documentElement.classList.remove("terms-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  opener.addEventListener("click", function (e) { e.preventDefault(); show(); });
  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close-terms")) hide();
  });
  if (closeBtn) closeBtn.addEventListener("click", hide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) hide();
  });
})();
