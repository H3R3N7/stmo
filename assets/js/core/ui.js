/* ==========================================================================
   HKEMS-STMO · Shared UI kit
   Icons, ripples, scroll state, reveal, snackbar, dialogs, storage, audio.
   Exposed as window.HK for the layout components and page modules.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------- *
   * Icon set — 24px outlined glyphs, stroked with currentColor.
   * ---------------------------------------------------------------------- */
  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>',
    "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-left": '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    "chevron-right": '<path d="M9 6l6 6-6 6"/>',
    "chevron-left": '<path d="M15 6l-6 6 6 6"/>',
    external:
      '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    chat: '<path d="M20 15a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2h12a2 2 0 012 2z"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    reset: '<path d="M20 11a8 8 0 10-2.4 5.7"/><path d="M20 4v7h-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>',
    hourglass: '<path d="M7 3h10M7 21h10"/><path d="M8 3c0 4.4 4 5.4 4 9s-4 4.6-4 9"/><path d="M16 3c0 4.4-4 5.4-4 9s4 4.6 4 9"/>',
    alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3.2l2 1.8"/><path d="M5 4L3 6M19 4l2 2"/>',
    stopwatch: '<circle cx="12" cy="13.5" r="6.5"/><path d="M12 10.5v3.4l2 1.4"/><path d="M9.5 3h5M10 3l.6 4M14 3l-.6 4"/>',
    users:
      '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.4a3.5 3.5 0 010 6.7"/><path d="M17.5 14.3c2 .8 3.5 2.8 3.5 5.2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.4v.6"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5.5A1.5 1.5 0 0013.5 4H5.5A1.5 1.5 0 004 5.5v8A1.5 1.5 0 005.5 15"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20"/>',
    gamepad:
      '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="16" cy="11.5" r="1"/><circle cx="18" cy="14" r="1"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v5.2L5.2 17A2 2 0 007 20h10a2 2 0 001.8-3L14 8.2V3"/><path d="M7.6 14h8.8"/>',
    sparkles: '<path d="M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7z"/><path d="M18 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 10-5.7-5.7L11.4 7"/><path d="M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 1011 18.7l1.6-1.6"/>',
    send: '<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.4 18-4.1-7.5-7.5-4z"/>',
    volume: '<path d="M4 10v4h3l4 3V7L7 10z"/><path d="M15 9a4 4 0 010 6M17.5 6.5a7.5 7.5 0 010 11"/>',
    "volume-off": '<path d="M4 10v4h3l4 3V7L7 10z"/><path d="M16 10l4 4M20 10l-4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    maximize: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    home: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.2A4 4 0 0112 8a4 4 0 017 2.8C19 15.6 12 20 12 20z"/>',
    shield: '<path d="M12 3l7 3v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
    code: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>',
    star: '<path d="M12 4l2.4 5 5.6.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8z"/>',
    hash: '<path d="M10 3L8 21M16 3l-2 18M4 9h16M3 15h16"/>',
    wrench: '<path d="M15.5 3a5 5 0 014.2 7.7l-9.4 9.4a2 2 0 01-2.8 0l-2.6-2.6a2 2 0 010-2.8l9.4-9.4A5 5 0 0115.5 3z"/><circle cx="15.5" cy="8.5" r="1.8"/>'
  };

  var HK = window.HK || {};

  function icon(name, className) {
    var glyph = ICONS[name];
    if (!glyph) glyph = ICONS.info;
    return (
      '<svg class="icon' + (className ? " " + className : "") + '" aria-hidden="true" focusable="false"><use href="#i-' +
      name +
      '"></use></svg>'
    );
  }

  function mountSprite() {
    if (document.getElementById("hk-icon-sprite")) return;
    var symbols = Object.keys(ICONS)
      .map(function (name) {
        return '<symbol id="i-' + name + '" viewBox="0 0 24 24">' + ICONS[name] + "</symbol>";
      })
      .join("");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "hk-icon-sprite");
    svg.setAttribute("class", "icon-sprite");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = symbols;
    document.body.insertBefore(svg, document.body.firstChild);
  }

  /* ---------------------------------------------------------------------- *
   * Safe storage
   * ---------------------------------------------------------------------- */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        /* storage unavailable — non fatal */
      }
    },
    remove: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        /* ignore */
      }
    }
  };

  /* ---------------------------------------------------------------------- *
   * Ripple
   * ---------------------------------------------------------------------- */
  var RIPPLE_SELECTOR = ".btn, .icon-btn, .drawer__link, .app-nav__link, [data-ripple]";

  function attachRipple(el) {
    if (el.dataset.rippleBound) return;
    el.dataset.rippleBound = "1";
    el.addEventListener("pointerdown", function (event) {
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.15;
      var ink = document.createElement("span");
      ink.className = "ripple";
      ink.style.width = ink.style.height = size + "px";
      ink.style.left = event.clientX - rect.left - size / 2 + "px";
      ink.style.top = event.clientY - rect.top - size / 2 + "px";
      el.appendChild(ink);
      window.setTimeout(function () {
        ink.remove();
      }, 640);
    });
  }

  function initRipples(scope) {
    (scope || document).querySelectorAll(RIPPLE_SELECTOR).forEach(attachRipple);
  }

  /* ---------------------------------------------------------------------- *
   * Scroll driven chrome
   * ---------------------------------------------------------------------- */
  function initScrollChrome() {
    var bar = null;
    var progress = null;
    var fab = null;
    var ticking = false;

    function resolve() {
      if (!bar) bar = document.querySelector(".top-app-bar");
      if (!progress) progress = document.querySelector(".scroll-progress");
      if (!fab) fab = document.querySelector(".fab-back-to-top");
    }

    function update() {
      resolve();
      var scrolled = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.classList.toggle("is-scrolled", scrolled > 8);
      if (progress) {
        var ratio = height > 0 ? Math.min(scrolled / height, 1) : 0;
        progress.style.setProperty("--progress", ratio.toFixed(4));
      }
      if (fab) fab.classList.toggle("is-visible", scrolled > 560);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------------------------------------------------------------------- *
   * Reveal on scroll
   * ---------------------------------------------------------------------- */
  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-revealed");
      });
      return;
    }

    nodes.forEach(function (node) {
      if (node.dataset.revealDelay) node.style.setProperty("--reveal-delay", node.dataset.revealDelay + "ms");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  /* ---------------------------------------------------------------------- *
   * Snackbar
   * ---------------------------------------------------------------------- */
  var snackbarTimer = null;

  function toast(message, options) {
    var opts = options || {};
    var node = document.querySelector(".snackbar");
    if (!node) {
      node = document.createElement("div");
      node.className = "snackbar";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    node.innerHTML = "";
    var text = document.createElement("span");
    text.textContent = message;
    node.appendChild(text);
    if (opts.action && opts.onAction) {
      var action = document.createElement("button");
      action.type = "button";
      action.className = "snackbar__action";
      action.textContent = opts.action;
      action.addEventListener("click", opts.onAction);
      node.appendChild(action);
    }
    node.classList.add("is-visible");
    window.clearTimeout(snackbarTimer);
    snackbarTimer = window.setTimeout(function () {
      node.classList.remove("is-visible");
    }, opts.duration || 2600);
  }

  /* ---------------------------------------------------------------------- *
   * Dialogs
   * ---------------------------------------------------------------------- */
  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  function initDialogs() {
    document.querySelectorAll("dialog.dialog").forEach(function (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.querySelectorAll("[data-close-dialog]").forEach(function (button) {
        button.addEventListener("click", function () {
          closeDialog(dialog);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- *
   * Copy helper
   * ---------------------------------------------------------------------- */
  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      try {
        var area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /* ---------------------------------------------------------------------- *
   * Audio — one lazily created context shared by every page
   * ---------------------------------------------------------------------- */
  var audioCtx = null;
  var muted = store.get("hkems-sound", true) === false;

  function context() {
    if (audioCtx) return audioCtx;
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
  }

  function tone(frequency, duration, options) {
    if (muted) return;
    var ctx = context();
    if (!ctx) return;
    var opts = options || {};
    if (ctx.state === "suspended") ctx.resume();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = opts.type || "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (opts.slideTo) {
      osc.frequency.exponentialRampToValueAtTime(opts.slideTo, ctx.currentTime + duration);
    }
    var peak = (opts.gain || 0.18) * (opts.attack || 1);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  var audio = {
    get muted() {
      return muted;
    },
    setMuted: function (value) {
      muted = !!value;
      store.set("hkems-sound", !muted);
      return muted;
    },
    toggle: function () {
      return audio.setMuted(!muted);
    },
    resume: function () {
      var ctx = context();
      if (ctx && ctx.state === "suspended") ctx.resume();
    },
    chime: function () {
      tone(880, 0.5, { gain: 0.18 });
      window.setTimeout(function () {
        tone(1174.7, 0.7, { gain: 0.14 });
      }, 220);
      window.setTimeout(function () {
        tone(1568, 0.9, { gain: 0.1 });
      }, 440);
    },
    tick: function () {
      tone(1200, 0.05, { gain: 0.05, type: "square" });
    },
    knock: function () {
      tone(180, 0.18, { gain: 0.35, type: "triangle", slideTo: 90 });
      tone(320, 0.06, { gain: 0.12, type: "square" });
    },
    hit: function () {
      tone(520, 0.09, { gain: 0.16, type: "square", slideTo: 380 });
    },
    error: function () {
      tone(220, 0.22, { gain: 0.14, type: "sawtooth", slideTo: 160 });
    }
  };

  /* ---------------------------------------------------------------------- *
   * Misc helpers
   * ---------------------------------------------------------------------- */
  function formatNumber(value) {
    return new Intl.NumberFormat("zh-CN").format(value);
  }

  function rootPath(page) {
    var root = document.documentElement.getAttribute("data-root") || "";
    var base = root ? root.replace(/\/$/, "") + "/" : "";
    return base + page;
  }

  function initIcons(scope) {
    (scope || document).querySelectorAll("[data-icon]").forEach(function (node) {
      if (node.dataset.iconReady) return;
      node.innerHTML = icon(node.dataset.icon);
      node.dataset.iconReady = "1";
    });
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-copy");
        copyText(value)
          .then(function () {
            toast("已复制：" + value);
          })
          .catch(function () {
            toast("复制失败，请手动选择文本");
          });
      });
    });
  }

  function init() {
    mountSprite();
    initIcons();
    initRipples();
    initScrollChrome();
    initReveal();
    initDialogs();
    initCopyButtons();
    document.documentElement.classList.add("js-ready");
    var year = document.querySelector("[data-current-year]");
    if (year) year.textContent = new Date().getFullYear();
  }

  HK.icon = icon;
  HK.sprite = mountSprite;
  HK.applyIcons = initIcons;
  HK.ripple = initRipples;
  HK.toast = toast;
  HK.openDialog = openDialog;
  HK.closeDialog = closeDialog;
  HK.copy = copyText;
  HK.store = store;
  HK.audio = audio;
  HK.formatNumber = formatNumber;
  HK.rootPath = rootPath;
  HK.icons = ICONS;

  window.HK = HK;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
