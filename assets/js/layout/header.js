/* ==========================================================================
   HKEMS-STMO · Header component
   Renders the MD3 top app bar, the navigation drawer and the ⌘K site search.
   Include once per page:  <header id="site-header"></header>
   Page context comes from <html data-root=".." data-page="home">.
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;

  var NAV = [
    { id: "home", label: "首页", file: "index.html", icon: "home" },
    { id: "news", label: "动态", file: "index.html#news", icon: "sparkles" },
    { id: "about", label: "关于", file: "index.html#about", icon: "users" },
    { id: "contact", label: "联系", file: "index.html#contact", icon: "mail" }
  ];

  var SEARCH_INDEX = [
    {
      title: "首页",
      path: "index.html",
      desc: "海口实验中学科技社官方网站首页：最新动态、社团简介与联系方式。",
      tags: "首页 home 科技社 hkems stmo 海口实验中学"
    },
    {
      title: "科技教室使用安排",
      path: "pages/activity/use-scheduling.html",
      desc: "高考期间科技教室作为桌椅书籍存放处的分区规划与时间安排。",
      tags: "活动 通知 教室 使用 安排 高考"
    },
    {
      title: "2023 年实验文创预售",
      path: "pages/activity/culture-creative-2023.html",
      desc: "校园文化便利贴、信稿纸、校徽钥匙扣与立牌的众筹预售活动。",
      tags: "文创 预售 周边 钥匙扣 便签 立牌 活动"
    },
    {
      title: "科技社规划备忘录",
      path: "pages/admin/memo.html",
      desc: "社团发展规划与日常记录的页面。",
      tags: "规划 备忘录 社团"
    },
    {
      title: "新型无线电简语 “QBG”",
      path: "pages/prank/BD7QBG.html",
      desc: "一段来自业余无线电圈的玩笑：QBG 的释义与起源。",
      tags: "无线电 简语 QBG BD7QBG 文章 趣味"
    },
    {
      title: "2048",
      path: "pages/games/2048.html",
      desc: "支持 2048 与 128 两种目标的数字合并小游戏。",
      tags: "游戏 2048 数字 小游戏"
    },
    {
      title: "打地鼠",
      path: "pages/games/whack-a-mole.html",
      desc: "45 秒限时打地鼠，看看你能拿到多少分。",
      tags: "游戏 打地鼠 反应 小游戏"
    }
  ];

  function href(file) {
    var root = document.documentElement.getAttribute("data-root") || "";
    var base = root ? root.replace(/\/$/, "") + "/" : "";
    return base + file;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function activeId() {
    var page = document.documentElement.getAttribute("data-page") || "home";
    if (page === "article") return "news";
    return page;
  }

  function navLinkMarkup(item, mobile) {
    var current = item.id === activeId();
    var attrs = current ? ' aria-current="page"' : "";
    if (mobile) {
      return (
        '<a class="drawer__link" href="' +
        href(item.file) +
        '"' +
        attrs +
        ">" +
        HK.icon(item.icon) +
        "<span>" +
        esc(item.label) +
        "</span></a>"
      );
    }
    return '<a class="app-nav__link" href="' + href(item.file) + '"' + attrs + ">" + esc(item.label) + "</a>";
  }

  function renderBar(host) {
    var items = NAV.map(function (item) {
      return navLinkMarkup(item, false);
    }).join("");

    host.innerHTML =
      '<div class="top-app-bar__inner">' +
      '<a class="brand" href="' +
      href("index.html") +
      '" aria-label="海口实验中学科技社首页">' +
      '<img class="brand__mark" src="' +
      href("assets/images/brand/logo-mark.webp") +
      '" alt="" width="38" height="38" decoding="async">' +
      '<span class="brand__text">' +
      '<span class="brand__name">海口实验中学科技社</span>' +
      '<span class="brand__sub">HKEMS · STMO</span>' +
      "</span></a>" +
      '<nav class="app-nav" aria-label="主导航">' +
      items +
      "</nav>" +
      '<div class="app-bar__actions">' +
      '<button class="icon-btn" type="button" id="open-search" aria-label="搜索站点（Ctrl 或 Command 加 K）" title="搜索 (Ctrl/⌘ K)">' +
      HK.icon("search") +
      "</button>" +
      '<button class="icon-btn" type="button" id="toggle-theme" aria-label="切换深色模式" title="切换深浅色">' +
      HK.icon("moon") +
      "</button>" +
      '<button class="icon-btn menu-btn" type="button" id="open-drawer" aria-label="打开导航菜单" aria-controls="site-drawer" aria-expanded="false">' +
      HK.icon("menu") +
      "</button>" +
      "</div>" +
      "</div>";

    host.addEventListener("click", function (event) {
      var toggle = event.target.closest("#toggle-theme");
      if (!toggle) return;
      var theme = window.HKTheme.toggle();
      syncThemeButton(theme);
    });

    document.addEventListener("hk:themechange", function (event) {
      syncThemeButton(event.detail.theme);
    });
    syncThemeButton(window.HKTheme.current);
  }

  function syncThemeButton(theme) {
    var button = document.getElementById("toggle-theme");
    if (!button) return;
    var dark = theme === "dark";
    button.innerHTML = HK.icon(dark ? "sun" : "moon");
    button.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function renderDrawer() {
    var links = NAV.map(function (item) {
      return navLinkMarkup(item, true);
    }).join("");

    var drawer = document.createElement("div");
    drawer.innerHTML =
      '<div class="drawer-scrim" data-close-drawer></div>' +
      '<aside class="drawer" id="site-drawer" aria-label="站点导航" aria-hidden="true">' +
      '<div class="drawer__head">' +
      '<a class="brand" href="' +
      href("index.html") +
      '">' +
      '<img class="brand__mark" src="' +
      href("assets/images/brand/logo-mark.webp") +
      '" alt="" width="32" height="32" loading="lazy">' +
      '<span class="brand__text"><span class="brand__name">科技社</span><span class="brand__sub">HKEMS · STMO</span></span>' +
      "</a>" +
      '<button class="icon-btn" type="button" data-close-drawer aria-label="关闭导航菜单">' +
      HK.icon("close") +
      "</button>" +
      "</div>" +
      '<p class="drawer__label">浏览</p>' +
      '<nav class="drawer__nav" aria-label="移动端主导航">' +
      links +
      "</nav>" +
      '<div class="drawer__footer">' +
      '<button class="btn btn--text btn--sm" type="button" id="drawer-search">' +
      HK.icon("search", "icon--sm") +
      "搜索</button>" +
      '<a class="btn btn--text btn--sm" href="' +
      href("index.html#contact") +
      '">' +
      HK.icon("mail", "icon--sm") +
      "联系我们</a>" +
      "</div>" +
      "</aside>";

    while (drawer.firstChild) document.body.appendChild(drawer.firstChild);
  }

  function openDrawer() {
    document.body.classList.add("is-drawer-open");
    var drawer = document.getElementById("site-drawer");
    var trigger = document.getElementById("open-drawer");
    if (drawer) drawer.setAttribute("aria-hidden", "false");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    var first = drawer && drawer.querySelector("a, button");
    if (first) window.setTimeout(function () { first.focus(); }, 160);
  }

  function closeDrawer() {
    document.body.classList.remove("is-drawer-open");
    var drawer = document.getElementById("site-drawer");
    var trigger = document.getElementById("open-drawer");
    if (drawer) drawer.setAttribute("aria-hidden", "true");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  /* ---------------------------------------------------------------------- *
   * Search dialog
   * ---------------------------------------------------------------------- */
  var searchState = { items: [], active: -1 };

  function renderSearchResults(query) {
    var box = document.getElementById("search-results");
    if (!box) return;
    var needle = query.trim().toLowerCase();
    var matches = SEARCH_INDEX.filter(function (entry) {
      if (!needle) return true;
      var haystack = (entry.title + " " + entry.desc + " " + entry.tags).toLowerCase();
      return haystack.indexOf(needle) !== -1;
    }).slice(0, 8);

    searchState.items = matches;
    searchState.active = matches.length ? 0 : -1;

    if (!matches.length) {
      box.innerHTML = '<p class="search-empty">没有找到与“' + esc(query) + '”相关的内容。</p>';
      return;
    }

    box.innerHTML = matches
      .map(function (entry, index) {
        return (
          '<a class="search-result' +
          (index === 0 ? " is-active" : "") +
          '" href="' +
          href(entry.path) +
          '" role="option" data-index="' +
          index +
          '">' +
          '<span class="search-result__title">' +
          esc(entry.title) +
          "</span>" +
          '<span class="search-result__desc">' +
          esc(entry.desc) +
          "</span>" +
          '<span class="search-result__path">' +
          esc(entry.path) +
          "</span></a>"
        );
      })
      .join("");
  }

  function highlightResult(index) {
    var results = document.querySelectorAll(".search-result");
    if (!results.length) return;
    index = Math.max(0, Math.min(index, results.length - 1));
    searchState.active = index;
    results.forEach(function (node, i) {
      node.classList.toggle("is-active", i === index);
    });
    results[index].scrollIntoView({ block: "nearest" });
  }

  function renderSearch() {
    var wrapper = document.createElement("dialog");
    wrapper.className = "dialog dialog--wide";
    wrapper.id = "search-dialog";
    wrapper.setAttribute("aria-labelledby", "search-title");
    wrapper.innerHTML =
      '<div class="search-box">' +
      HK.icon("search") +
      '<input id="search-input" type="search" placeholder="搜索页面、文章与工具…" aria-label="搜索站点" autocomplete="off">' +
      '<button class="icon-btn" type="button" data-close-dialog aria-label="关闭搜索">' +
      HK.icon("close") +
      "</button>" +
      "</div>" +
      '<h2 id="search-title" class="visually-hidden">站点搜索</h2>' +
      '<div class="search-results" id="search-results" role="listbox" aria-label="搜索结果"></div>' +
      '<div class="search-hint">' +
      '<kbd>↑</kbd><kbd>↓</kbd> 选择 · <kbd>Enter</kbd> 打开 · <kbd>Esc</kbd> 关闭' +
      "</div>";
    document.body.appendChild(wrapper);

    var input = wrapper.querySelector("#search-input");
    renderSearchResults("");

    input.addEventListener("input", function () {
      renderSearchResults(input.value);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        highlightResult(searchState.active + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        highlightResult(searchState.active - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        var target = searchState.items[searchState.active];
        if (target) window.location.href = href(target.path);
      }
    });

    /* the dialog is created after ui.js has bound its generic close handlers,
       so bind this one explicitly */
    wrapper.querySelectorAll("[data-close-dialog]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        closeSearch();
      });
    });

    wrapper.addEventListener("click", function (event) {
      if (event.target === wrapper) {
        closeSearch();
        return;
      }
      var result = event.target.closest(".search-result");
      if (result) closeSearch();
    });
  }

  function openSearch() {
    var dialog = document.getElementById("search-dialog");
    if (!dialog) return;
    if (document.body.classList.contains("is-drawer-open")) closeDrawer();
    HK.openDialog(dialog);
    var input = document.getElementById("search-input");
    if (input) {
      input.value = "";
      renderSearchResults("");
      window.setTimeout(function () { input.focus(); }, 60);
    }
  }

  function closeSearch() {
    var dialog = document.getElementById("search-dialog");
    if (dialog) HK.closeDialog(dialog);
  }

  /* ---------------------------------------------------------------------- *
   * Boot
   * ---------------------------------------------------------------------- */
  function init() {
    var host = document.getElementById("site-header");
    if (!host || host.dataset.rendered) return;
    host.dataset.rendered = "1";
    HK.sprite();

    var progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    renderBar(host);
    renderDrawer();
    renderSearch();
    HK.ripple(host);

    document.getElementById("open-drawer").addEventListener("click", openDrawer);
    document.getElementById("open-search").addEventListener("click", openSearch);
    document.getElementById("drawer-search").addEventListener("click", function () {
      closeDrawer();
      window.setTimeout(openSearch, 120);
    });

    document.querySelectorAll("[data-close-drawer]").forEach(function (node) {
      node.addEventListener("click", closeDrawer);
    });

    document.querySelectorAll(".drawer__nav a").forEach(function (node) {
      node.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("is-drawer-open")) {
        closeDrawer();
        return;
      }
      var isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
      if (!isTyping && (event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearch();
        return;
      }
      if (!isTyping && event.key === "/" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        openSearch();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeDrawer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
