/* ==========================================================================
   HKEMS-STMO · Whack-a-mole
   A 45 second reflex game. The mole is a hand-drawn SVG, no image assets.
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;
  var HOLES = 9;
  var ROUND_SECONDS = 45;
  var BEST_KEY = "hkems-mole-best";

  var MOLE_SVG =
    '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<ellipse cx="26" cy="46" rx="12" ry="12" fill="#8d6e63"/>' +
    '<ellipse cx="94" cy="46" rx="12" ry="12" fill="#8d6e63"/>' +
    '<ellipse cx="60" cy="72" rx="40" ry="42" fill="#a1887f"/>' +
    '<ellipse cx="60" cy="84" rx="26" ry="20" fill="#d7ccc8"/>' +
    '<ellipse cx="60" cy="74" rx="8" ry="6" fill="#4e342e"/>' +
    '<path d="M52 88h16v10a8 8 0 01-16 0z" fill="#fff8f5"/>' +
    '<path d="M60 88v10" stroke="#d7ccc8" stroke-width="2"/>' +
    '<circle cx="45" cy="60" r="6" fill="#3e2723"/>' +
    '<circle cx="75" cy="60" r="6" fill="#3e2723"/>' +
    '<circle cx="47" cy="58" r="1.8" fill="#fff"/>' +
    '<circle cx="77" cy="58" r="1.8" fill="#fff"/>' +
    '<ellipse cx="28" cy="104" rx="12" ry="8" fill="#8d6e63"/>' +
    '<ellipse cx="92" cy="104" rx="12" ry="8" fill="#8d6e63"/>' +
    "</svg>";

  function init() {
    var grid = document.getElementById("mole-grid");
    if (!grid) return;

    var scoreNode = document.getElementById("mole-score");
    var timeNode = document.getElementById("mole-time");
    var comboNode = document.getElementById("mole-combo");
    var bestNode = document.getElementById("mole-best");
    var overlay = document.getElementById("mole-overlay");
    var overlayTitle = document.getElementById("mole-overlay-title");
    var overlayText = document.getElementById("mole-overlay-text");
    var startBtn = document.getElementById("mole-start");
    var restartBtn = document.getElementById("mole-restart");
    var flash = document.getElementById("mole-flash");

    var holes = [];
    var running = false;
    var score = 0;
    var combo = 0;
    var bestCombo = 0;
    var timeLeft = ROUND_SECONDS;
    var tickTimer = null;
    var popTimer = null;
    var best = Number(HK.store.get(BEST_KEY, 0)) || 0;

    for (var i = 0; i < HOLES; i++) {
      var hole = document.createElement("div");
      hole.className = "hole";
      hole.setAttribute("data-hole", String(i));
      hole.innerHTML =
        '<span class="hole__score">+10</span>' +
        '<button class="hole__mole" type="button" tabindex="-1" aria-label="打地鼠">' +
        MOLE_SVG +
        "</button>";
      grid.appendChild(hole);
      holes.push({ node: hole, mole: hole.querySelector(".hole__mole"), busy: false, timer: null, hit: false });
    }

    function paintHud() {
      if (scoreNode) scoreNode.textContent = String(score);
      if (timeNode) timeNode.textContent = String(Math.max(0, timeLeft));
      if (comboNode) comboNode.textContent = combo > 1 ? "x" + combo : "—";
      if (bestNode) bestNode.textContent = String(best);
    }

    function showOverlay(title, text, buttonLabel) {
      if (!overlay) return;
      if (overlayTitle) overlayTitle.textContent = title;
      if (overlayText) overlayText.textContent = text;
      if (startBtn) {
        startBtn.textContent = buttonLabel;
        startBtn.hidden = false;
      }
      overlay.hidden = false;
      overlay.removeAttribute("aria-hidden");
    }

    function hideOverlay() {
      if (!overlay) return;
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
    }

    function upMole(entry) {
      entry.busy = true;
      entry.hit = false;
      entry.node.classList.add("is-up");
      entry.mole.tabIndex = 0;
      entry.mole.setAttribute("aria-hidden", "false");
      var stay = Math.max(620, 1500 - (ROUND_SECONDS - timeLeft) * 18) + Math.random() * 300;
      entry.timer = window.setTimeout(function () {
        if (entry.hit) return;
        entry.node.classList.remove("is-up");
        entry.mole.tabIndex = -1;
        entry.mole.setAttribute("aria-hidden", "true");
        entry.busy = false;
        if (combo > 0) {
          combo = 0;
          paintHud();
        }
      }, stay);
    }

    function schedulePop() {
      if (!running) return;
      var delay = Math.max(360, 880 - (ROUND_SECONDS - timeLeft) * 9) + Math.random() * 260;
      popTimer = window.setTimeout(function () {
        if (!running) return;
        var free = holes.filter(function (entry) {
          return !entry.busy;
        });
        if (free.length) upMole(free[Math.floor(Math.random() * free.length)]);
        schedulePop();
      }, delay);
    }

    function hitMole(entry) {
      if (!running || entry.hit || !entry.node.classList.contains("is-up")) return;
      entry.hit = true;
      entry.busy = false;
      window.clearTimeout(entry.timer);
      combo += 1;
      bestCombo = Math.max(bestCombo, combo);
      var points = 10 + Math.max(0, combo - 1) * 5;
      score += points;

      var scoreTag = entry.node.querySelector(".hole__score");
      if (scoreTag) scoreTag.textContent = "+" + points;

      entry.node.classList.add("is-hit");
      HK.audio.hit();
      if (combo > 1 && flash) {
        flash.textContent = "连击 x" + combo;
        flash.classList.add("is-visible");
        window.clearTimeout(flash._timer);
        flash._timer = window.setTimeout(function () {
          flash.classList.remove("is-visible");
        }, 900);
      }

      window.setTimeout(function () {
        entry.node.classList.remove("is-hit", "is-up");
        entry.mole.tabIndex = -1;
        entry.mole.setAttribute("aria-hidden", "true");
      }, 160);

      paintHud();
    }

    grid.addEventListener("click", function (event) {
      var mole = event.target.closest(".hole__mole");
      if (!mole) return;
      var node = mole.closest(".hole");
      var index = Number(node.getAttribute("data-hole"));
      hitMole(holes[index]);
    });

    grid.addEventListener(
      "pointerdown",
      function (event) {
        var mole = event.target.closest(".hole__mole");
        if (!mole) return;
        event.preventDefault();
        var node = mole.closest(".hole");
        hitMole(holes[Number(node.getAttribute("data-hole"))]);
      },
      { passive: false }
    );

    function start() {
      holes.forEach(function (entry) {
        window.clearTimeout(entry.timer);
        entry.busy = false;
        entry.hit = false;
        entry.node.classList.remove("is-up", "is-hit");
        entry.mole.tabIndex = -1;
      });
      window.clearTimeout(popTimer);
      window.clearInterval(tickTimer);
      score = 0;
      combo = 0;
      bestCombo = 0;
      timeLeft = ROUND_SECONDS;
      running = true;
      paintHud();
      hideOverlay();
      HK.audio.resume();
      tickTimer = window.setInterval(function () {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          timeLeft = 0;
          paintHud();
          end();
          return;
        }
        paintHud();
      }, 1000);
      schedulePop();
      var firstFree = holes[Math.floor(Math.random() * holes.length)];
      window.setTimeout(function () {
        if (running) upMole(firstFree);
      }, 320);
    }

    function end() {
      running = false;
      window.clearInterval(tickTimer);
      window.clearTimeout(popTimer);
      holes.forEach(function (entry) {
        window.clearTimeout(entry.timer);
        entry.busy = false;
        entry.node.classList.remove("is-up", "is-hit");
        entry.mole.tabIndex = -1;
      });
      if (score > best) {
        best = score;
        HK.store.set(BEST_KEY, best);
      }
      paintHud();
      HK.audio.chime();
      showOverlay(
        "时间到！本局 " + score + " 分",
        bestCombo > 1 ? "最高连击 x" + bestCombo + " · 历史最高 " + best + " 分" : "历史最高 " + best + " 分",
        "再来一局"
      );
    }

    if (startBtn) {
      startBtn.addEventListener("click", start);
      startBtn.hidden = false;
    }
    if (restartBtn) restartBtn.addEventListener("click", start);

    paintHud();
    showOverlay("打地鼠", "45 秒内敲中冒头的鼹鼠，连击可以拿到更高分。手机可以直接点，电脑用鼠标。", "开始游戏");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
