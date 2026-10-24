/* ==========================================================================
   HKEMS-STMO · Footer component
   Renders the site footer, the back-to-top FAB and the user agreement
   dialog. The agreement opens automatically on the first visit.
   Include once per page:  <footer id="site-footer"></footer>
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;
  var CONSENT_KEY = "hkems-consent";

  var COLUMNS = [
    {
      title: "站点",
      links: [
        { label: "首页", file: "index.html" },
        { label: "最新动态", file: "index.html#news" },
        { label: "关于我们", file: "index.html#about" },
        { label: "联系我们", file: "index.html#contact" }
      ]
    },
    {
      title: "内容",
      links: [
        { label: "科技教室使用安排", file: "pages/activity/use-scheduling.html" },
        { label: "2023 年实验文创预售", file: "pages/activity/culture-creative-2023.html" },
        { label: "无线电简语 QBG", file: "pages/prank/BD7QBG.html" }
      ]
    },
    {
      title: "更多",
      links: [
        { label: "2048", file: "pages/games/2048.html" },
        { label: "社团联系方式（PDF）", file: "assets/docs/club-contact.pdf", external: true }
      ]
    }
  ];

  function href(file) {
    var root = document.documentElement.getAttribute("data-root") || "";
    var base = root ? root.replace(/\/$/, "") + "/" : "";
    return base + file;
  }

  var POLICY = [
    "<strong>用户协议</strong>",
    "1. 本站内容仅供参考，请谨慎采纳；因采用本站内容造成的损失，本站不承担责任。",
    "2. 本站遵守互联网信息服务管理相关法律法规，并对站内内容进行审核；境外使用者应同时遵守所在地法律。",
    "3. 本站不欢迎辱骂、人身攻击、谣言、歧视等不友善行为，也不允许未经允许的广告。",
    "4. 本站保留因发展需要调整、暂停或终止部分服务的权利。",
    "<strong>隐私政策</strong>",
    "本站不设置账号体系，不主动收集个人身份信息。页面中可能使用浏览器本地存储（localStorage）保存深色模式、游戏最高分与协议同意状态，这些数据只保存在你的设备上。",
    "如页面嵌入第三方内容（例如哔哩哔哩视频），播放时数据将由该第三方按其隐私政策处理。"
  ].join("<br><br>");

  function render() {
    var host = document.getElementById("site-footer");
    if (!host || host.dataset.rendered) return;
    host.dataset.rendered = "1";
    host.className = "site-footer";

    var columns = COLUMNS.map(function (column) {
      var links = column.links
        .map(function (link) {
          var attrs = link.external ? ' target="_blank" rel="noopener"' : "";
          return '<a href="' + href(link.file) + '"' + attrs + ">" + link.label + "</a>";
        })
        .join("");
      return (
        '<div class="footer__col">' +
        '<p class="footer__title">' +
        column.title +
        "</p>" +
        '<div class="footer__links">' +
        links +
        "</div></div>"
      );
    }).join("");

    host.innerHTML =
      '<div class="container">' +
      '<div class="footer__grid">' +
      '<div class="footer__brand">' +
      '<img src="' +
      href("assets/images/brand/logo-wide.png") +
      '" alt="海口实验中学科技社" width="168" height="35" loading="lazy">' +
      '<div class="footer__deploy">' +
      "<p>成立于 1998 年，由海口实验中学学生自发组织的科学技术类社团。</p>" +
      '<a href="https://vercel.com/new/clone?repository-url=https://github.com/HKEMS-STMO/New-official-website" target="_blank" rel="noopener noreferrer">' +
      '<img src="https://vercel.com/button" alt="Deploy with Vercel" width="104" height="32" loading="lazy">' +
      "</a>" +
      '<a href="https://app.netlify.com/start/deploy?repository=https://github.com/HKEMS-STMO/New-official-website" target="_blank" rel="noopener noreferrer">' +
      '<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" width="128" height="32" loading="lazy">' +
      "</a>" +
      "</div>" +
      "</div>" +
      columns +
      "</div>" +
      '<div class="footer__bottom">' +
      '<span>© <span data-current-year>2026</span> 海口实验中学科技社 · HKEMS-STMO</span>' +
      '<span class="footer__bottom-links">' +
      '<button class="btn btn--text btn--sm" type="button" id="open-policy">用户协议与隐私政策</button>' +
      '<a class="btn btn--text btn--sm" href="' +
      href("sitemap.xml") +
      '">站点地图</a>' +
      '<a class="btn btn--text btn--sm" href="mailto:HKEMS-STMO@outlook.com">HKEMS-STMO@outlook.com</a>' +
      "</span>" +
      "</div>" +
      "</div>";

    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });

    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "fab fab-back-to-top";
    fab.setAttribute("aria-label", "返回页首");
    fab.innerHTML = HK.icon("arrow-up");
    document.body.appendChild(fab);
    HK.ripple(fab);
    fab.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ------------------------------------------------------------------ *
     * User agreement
     * ------------------------------------------------------------------ */
    var dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.id = "policy-dialog";
    dialog.setAttribute("aria-labelledby", "policy-title");
    dialog.innerHTML =
      '<div class="dialog__head">' +
      '<div><h2 class="dialog__title" id="policy-title">用户协议与隐私政策</h2>' +
      '<p class="dialog__sub">更新于 2024 年 4 月 5 日 · 2024 届社长马志伟编撰</p></div>' +
      '<button class="icon-btn" type="button" data-dismiss aria-label="关闭">' +
      HK.icon("close") +
      "</button>" +
      "</div>" +
      '<div class="dialog__body">' +
      POLICY +
      "</div>" +
      '<div class="dialog__actions">' +
      '<button class="btn btn--text" type="button" id="policy-decline">不同意</button>' +
      '<button class="btn btn--filled" type="button" id="policy-agree">同意并继续</button>' +
      "</div>";
    document.body.appendChild(dialog);

    var agreeBtn = dialog.querySelector("#policy-agree");
    var declineBtn = dialog.querySelector("#policy-decline");
    var dismissBtn = dialog.querySelector("[data-dismiss]");

    function saveConsent(accepted) {
      HK.store.set(CONSENT_KEY, { accepted: accepted, at: new Date().toISOString() });
    }

    function openPolicy(auto) {
      dialog.dataset.mode = auto ? "first-run" : "manual";
      declineBtn.hidden = !auto;
      agreeBtn.textContent = auto ? "同意并继续" : "关闭";
      HK.openDialog(dialog);
      if (auto) window.setTimeout(function () { agreeBtn.focus(); }, 80);
    }

    agreeBtn.addEventListener("click", function () {
      if (dialog.dataset.mode === "first-run") {
        saveConsent(true);
        HK.toast("已同意用户协议");
      }
      HK.closeDialog(dialog);
    });

    declineBtn.addEventListener("click", function () {
      saveConsent(false);
      HK.closeDialog(dialog);
    });

    dismissBtn.addEventListener("click", function () {
      HK.closeDialog(dialog);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) HK.closeDialog(dialog);
    });

    var trigger = document.getElementById("open-policy");
    if (trigger) {
      trigger.addEventListener("click", function () {
        openPolicy(false);
      });
    }

    if (HK.store.get(CONSENT_KEY, null) === null) {
      window.setTimeout(function () {
        openPolicy(true);
      }, 600);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
