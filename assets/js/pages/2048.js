/* ==========================================================================
   HKEMS-STMO · 2048
   Classic merge puzzle with keyboard and swipe input, undo and two targets.
   ========================================================================== */
(function () {
  "use strict";

  var HK = window.HK;
  var SIZE = 4;
  var BEST_KEY = "hkems-2048-best";

  function Game(options) {
    this.board = document.getElementById("game-board");
    this.container = document.getElementById("game-tiles");
    this.scoreNode = document.getElementById("game-score");
    this.bestNode = document.getElementById("game-best");
    this.targetNode = document.getElementById("game-target");
    this.overlay = document.getElementById("game-overlay");
    this.overlayTitle = document.getElementById("overlay-title");
    this.overlayText = document.getElementById("overlay-text");
    this.continueBtn = document.getElementById("overlay-continue");
    this.restartBtn = document.getElementById("overlay-restart");
    this.target = options && options.target ? options.target : 2048;
    this.best = Number(HK.store.get(BEST_KEY, 0)) || 0;
    this.elMap = {};
    this.history = [];
    this.grid = [];
    this.tiles = [];
    this.score = 0;
    this.nextId = 1;
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    this.touchStart = null;
  }

  Game.prototype.reset = function () {
    this.grid = [];
    for (var r = 0; r < SIZE; r++) {
      this.grid.push([null, null, null, null]);
    }
    this.score = 0;
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    this.history = [];
    if (this.container) this.container.innerHTML = "";
    this.elMap = {};
    this.spawn();
    this.spawn();
    this.sync();
    this.hideOverlay();
    this.paintScore();
  };

  Game.prototype.spawn = function () {
    var empty = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (!this.grid[r][c]) empty.push({ r: r, c: c });
      }
    }
    if (!empty.length) return null;
    var spot = empty[Math.floor(Math.random() * empty.length)];
    var tile = {
      id: this.nextId++,
      value: Math.random() < 0.9 ? 2 : 4,
      r: spot.r,
      c: spot.c,
      merged: false
    };
    this.grid[spot.r][spot.c] = tile;
    return tile;
  };

  Game.prototype.flatten = function () {
    var list = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (this.grid[r][c]) list.push(this.grid[r][c]);
      }
    }
    return list;
  };

  Game.prototype.lines = function (dir) {
    var lines = [];
    var r;
    var c;
    if (dir === "left" || dir === "right") {
      for (r = 0; r < SIZE; r++) {
        var row = [];
        for (c = 0; c < SIZE; c++) row.push({ r: r, c: dir === "left" ? c : SIZE - 1 - c });
        lines.push(row);
      }
    } else {
      for (c = 0; c < SIZE; c++) {
        var col = [];
        for (r = 0; r < SIZE; r++) col.push({ r: dir === "up" ? r : SIZE - 1 - r, c: c });
        lines.push(col);
      }
    }
    return lines;
  };

  Game.prototype.snapshot = function () {
    return {
      score: this.score,
      cells: this.flatten().map(function (tile) {
        return { value: tile.value, r: tile.r, c: tile.c };
      }),
      won: this.won
    };
  };

  Game.prototype.move = function (dir) {
    if (this.over) return false;
    var self = this;
    var before = this.snapshot();
    var moved = false;
    var gained = 0;

    this.lines(dir).forEach(function (line) {
      var present = [];
      line.forEach(function (position) {
        var tile = self.grid[position.r][position.c];
        if (tile) present.push(tile);
      });

      var mergedLine = [];
      var index = 0;
      while (index < present.length) {
        var current = present[index];
        var next = present[index + 1];
        if (next && next.value === current.value) {
          current.value *= 2;
          current.merged = true;
          gained += current.value;
          mergedLine.push(current);
          index += 2;
        } else {
          mergedLine.push(current);
          index += 1;
        }
      }

      line.forEach(function (position, lineIndex) {
        var previous = self.grid[position.r][position.c];
        var tile = mergedLine[lineIndex] || null;
        if (!tile) {
          if (previous) moved = true;
          self.grid[position.r][position.c] = null;
          return;
        }
        if (previous !== tile || tile.r !== position.r || tile.c !== position.c) moved = true;
        tile.r = position.r;
        tile.c = position.c;
        self.grid[position.r][position.c] = tile;
      });
    });

    if (!moved) {
      this.checkGameOver();
      return false;
    }

    this.score += gained;
    this.history.push(before);
    if (this.history.length > 12) this.history.shift();
    this.spawn();
    this.sync();
    this.paintScore();
    this.checkWin();
    if (!this.won || this.keepPlaying) this.checkGameOver();
    return true;
  };

  Game.prototype.undo = function () {
    var previous = this.history.pop();
    if (!previous) {
      HK.toast("没有可以撤销的步骤");
      return;
    }
    this.grid = [];
    for (var r = 0; r < SIZE; r++) {
      this.grid.push([null, null, null, null]);
    }
    if (this.container) this.container.innerHTML = "";
    this.elMap = {};
    this.score = previous.score;
    this.won = previous.won;
    this.over = false;
    previous.cells.forEach(
      function (cell) {
        var tile = { id: this.nextId++, value: cell.value, r: cell.r, c: cell.c, merged: false };
        this.grid[cell.r][cell.c] = tile;
      }.bind(this)
    );
    this.hideOverlay();
    this.sync();
    this.paintScore();
  };

  Game.prototype.paintScore = function () {
    if (this.scoreNode) this.scoreNode.textContent = HK.formatNumber(this.score);
    if (this.score > this.best) {
      this.best = this.score;
      HK.store.set(BEST_KEY, this.best);
    }
    if (this.bestNode) this.bestNode.textContent = HK.formatNumber(this.best);
    if (this.targetNode) this.targetNode.textContent = String(this.target);
  };

  Game.prototype.sync = function () {
    if (!this.container) return;
    var seen = {};
    var self = this;
    this.tiles = this.flatten();
    this.tiles.forEach(function (tile) {
      var element = self.elMap[tile.id];
      if (!element) {
        element = document.createElement("div");
        element.className = "tile tile--new";
        element.setAttribute("data-value", tile.value);
        element.textContent = tile.value;
        self.container.appendChild(element);
        self.elMap[tile.id] = element;
        window.setTimeout(function () {
          element.classList.remove("tile--new");
        }, 220);
      }
      element.style.setProperty("--row", tile.r);
      element.style.setProperty("--col", tile.c);
      if (element.getAttribute("data-value") !== String(tile.value)) {
        element.setAttribute("data-value", tile.value);
        element.textContent = tile.value;
      }
      if (tile.merged) {
        tile.merged = false;
        element.classList.add("tile--merged");
        window.setTimeout(function () {
          element.classList.remove("tile--merged");
        }, 260);
      }
    });

    Object.keys(this.elMap).forEach(function (id) {
      if (seen[id]) return;
      var element = self.elMap[id];
      if (!element) return;
      if (self.grid.some(function (row) { return row.some(function (tile) { return tile && String(tile.id) === id; }); })) return;
      element.remove();
      delete self.elMap[id];
    });
  };

  Game.prototype.checkWin = function () {
    if (this.keepPlaying) return;
    var reached = this.flatten().some(
      function (tile) {
        return tile.value >= this.target;
      }.bind(this)
    );
    if (!reached || this.won) return;
    this.won = true;
    HK.audio.chime();
    this.showOverlay("达成 " + this.target + "！", "继续玩可以挑战更大的数字。", true);
  };

  Game.prototype.checkGameOver = function () {
    if (this.over) return;
    if (this.flatten().length >= SIZE * SIZE) {
      var stuck = true;
      for (var r = 0; r < SIZE && stuck; r++) {
        for (var c = 0; c < SIZE; c++) {
          var value = this.grid[r][c].value;
          var right = c < SIZE - 1 ? this.grid[r][c + 1].value : null;
          var down = r < SIZE - 1 ? this.grid[r + 1][c].value : null;
          if (value === right || value === down) {
            stuck = false;
            break;
          }
        }
      }
      if (!stuck) return;
    } else {
      return;
    }
    this.over = true;
    HK.audio.error();
    this.showOverlay("没有可移动的数字了", "本局得分 " + HK.formatNumber(this.score) + "，再来一局？", false);
  };

  Game.prototype.showOverlay = function (title, text, canContinue) {
    if (!this.overlay) return;
    if (this.overlayTitle) this.overlayTitle.textContent = title;
    if (this.overlayText) this.overlayText.textContent = text;
    if (this.continueBtn) this.continueBtn.hidden = !canContinue;
    this.overlay.classList.add("is-visible");
  };

  Game.prototype.hideOverlay = function () {
    if (this.overlay) this.overlay.classList.remove("is-visible");
  };

  Game.prototype.setTarget = function (target) {
    this.target = target;
    this.reset();
  };

  Game.prototype.bind = function () {
    var self = this;

    document.getElementById("new-game").addEventListener("click", function () {
      self.reset();
      HK.toast("新的一局开始了");
    });

    document.getElementById("undo-game").addEventListener("click", function () {
      self.undo();
    });

    if (this.continueBtn) {
      this.continueBtn.addEventListener("click", function () {
        self.keepPlaying = true;
        self.hideOverlay();
      });
    }
    if (this.restartBtn) {
      this.restartBtn.addEventListener("click", function () {
        self.reset();
      });
    }

    document.querySelectorAll("[data-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll("[data-target]").forEach(function (other) {
          other.setAttribute("aria-selected", other === button ? "true" : "false");
        });
        self.setTarget(Number(button.getAttribute("data-target")));
        HK.toast("目标已切换为 " + self.target);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      var map = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down"
      };
      var dir = map[event.key];
      if (!dir) return;
      event.preventDefault();
      self.move(dir);
    });

    if (this.board) {
      this.board.addEventListener(
        "pointerdown",
        function (event) {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          self.touchStart = { x: event.clientX, y: event.clientY };
        },
        { passive: true }
      );

      this.board.addEventListener(
        "pointerup",
        function (event) {
          if (!self.touchStart) return;
          var dx = event.clientX - self.touchStart.x;
          var dy = event.clientY - self.touchStart.y;
          self.touchStart = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          if (Math.abs(dx) > Math.abs(dy)) self.move(dx > 0 ? "right" : "left");
          else self.move(dy > 0 ? "down" : "up");
        },
        { passive: true }
      );
    }
  };

  function init() {
    var board = document.getElementById("game-board");
    if (!board) return;
    var game = new Game({ target: 2048 });
    game.bind();
    game.reset();
    window.HKGame2048 = game;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
