/* Share payloads, captions, and canvas cards. Works in the browser and in Node tests. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.UnhookShare = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var VERSION = 1;

  function b64urlEncode(str) {
    var b64;
    if (typeof Buffer !== "undefined") {
      b64 = Buffer.from(str, "utf8").toString("base64");
    } else {
      b64 = btoa(unescape(encodeURIComponent(str)));
    }
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function b64urlDecode(s) {
    var pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    var b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
    if (typeof Buffer !== "undefined") return Buffer.from(b64, "base64").toString("utf8");
    return decodeURIComponent(escape(atob(b64)));
  }

  function money(n) {
    var v = Math.round(Number(n) || 0);
    return "$" + v.toLocaleString("en-US");
  }

  function yearlyFromMonthly(n) {
    return Math.round((Number(n) || 0) * 12);
  }

  function encodeCard(payload) {
    if (!payload || typeof payload !== "object") throw new Error("payload required");
    var body = { v: VERSION };
    Object.keys(payload).forEach(function (k) {
      if (payload[k] !== undefined && payload[k] !== null && payload[k] !== "") body[k] = payload[k];
    });
    return b64urlEncode(JSON.stringify(body));
  }

  function decodeCard(token) {
    if (!token || typeof token !== "string") return null;
    try {
      var data = JSON.parse(b64urlDecode(token));
      if (!data || data.v !== VERSION) return null;
      if (data.t !== "win" && data.t !== "bleed" && data.t !== "map") return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function cardUrl(payload, origin) {
    var token = encodeCard(payload);
    if (origin) {
      var trimmed = origin.replace(/\/+$/, "");
      return trimmed + "/#card=" + token;
    }
    if (typeof location === "undefined") return "#card=" + token;
    var u = new URL(location.href);
    u.hash = "card=" + token;
    return u.toString();
  }

  function playbookUrl(id, origin) {
    if (origin) return origin.replace(/\/+$/, "") + "/?p=" + encodeURIComponent(id);
    if (typeof location === "undefined") return "?p=" + encodeURIComponent(id);
    var u = new URL(location.href);
    u.search = "?p=" + encodeURIComponent(id);
    u.hash = "";
    return u.toString();
  }

  function captionFor(payload, url) {
    var link = url || "";
    if (payload.t === "win") {
      var y = yearlyFromMonthly(payload.a);
      return (
        "I Unhooked " +
        payload.n +
        ". " +
        money(y) +
        "/year back. They built a maze. I walked out. " +
        link
      ).trim();
    }
    if (payload.t === "bleed") {
      return (
        "I'm leaking " +
        money(payload.y) +
        "/year across " +
        payload.c +
        " subscription" +
        (payload.c === 1 ? "" : "s") +
        ". No bank login. " +
        link
      ).trim();
    }
    return (
      payload.n +
      " hides the cancel button. Here's the actual exit — script, letter, date. " +
      link
    ).trim();
  }

  function xIntent(text) {
    return "https://x.com/intent/tweet?text=" + encodeURIComponent(text);
  }

  function wrapText(ctx, text, maxWidth) {
    var words = String(text || "").split(/\s+/);
    var lines = [];
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var next = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawPaper(ctx, w, h) {
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, w, h);
    var g = ctx.createRadialGradient(w * 0.12, 0, 40, w * 0.12, 0, w * 0.9);
    g.addColorStop(0, "rgba(255,90,31,0.28)");
    g.addColorStop(1, "rgba(9,9,11,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var g2 = ctx.createRadialGradient(w, 80, 20, w, 80, w * 0.7);
    g2.addColorStop(0, "rgba(255,211,106,0.12)");
    g2.addColorStop(1, "rgba(9,9,11,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#2a2a32";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, w - 80, h - 80);
  }

  function drawBrand(ctx, w) {
    ctx.fillStyle = "#ff5a1f";
    ctx.strokeStyle = "#ff5a1f";
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 72, 44, 44);
    ctx.font = "600 22px Outfit, system-ui, sans-serif";
    ctx.fillText("⏻", 84, 102);
    ctx.fillStyle = "#f3efe6";
    ctx.font = "700 28px Outfit, system-ui, sans-serif";
    ctx.fillText("Unhook", 132, 102);
    ctx.fillStyle = "#9a958a";
    ctx.font = "500 18px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText("NO BANK LOGIN", w - 72, 102);
    ctx.textAlign = "left";
  }

  function drawWin(ctx, w, h, payload) {
    drawPaper(ctx, w, h);
    drawBrand(ctx, w);
    var yearly = yearlyFromMonthly(payload.a);
    ctx.fillStyle = "#ff5a1f";
    ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText("UNHOOKED", 72, 220);
    ctx.fillStyle = "#f3efe6";
    ctx.font = "400 92px 'Instrument Serif', Georgia, serif";
    var nameLines = wrapText(ctx, payload.n || "Unknown", w - 144);
    var y = 320;
    nameLines.slice(0, 3).forEach(function (line) {
      ctx.fillText(line, 72, y);
      y += 96;
    });
    ctx.fillStyle = "#ffd36a";
    ctx.font = "italic 36px 'Instrument Serif', Georgia, serif";
    ctx.fillText("They built a maze.", 72, y + 24);
    ctx.fillText("I walked out.", 72, y + 72);
    ctx.fillStyle = "#ffd36a";
    ctx.font = "400 120px 'Instrument Serif', Georgia, serif";
    ctx.fillText(money(yearly), 72, h - 280);
    ctx.fillStyle = "#d6d0c4";
    ctx.font = "500 28px Outfit, system-ui, sans-serif";
    ctx.fillText("back this year  ·  " + money(payload.a) + "/mo", 72, h - 210);
    ctx.fillStyle = "#9a958a";
    ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText(payload.d || "", 72, h - 140);
    ctx.fillStyle = "#9a958a";
    ctx.fillText("Share the exit, not the bank login.", 72, h - 100);
  }

  function drawBleed(ctx, w, h, payload) {
    drawPaper(ctx, w, h);
    drawBrand(ctx, w);
    ctx.fillStyle = "#ff5a1f";
    ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText("STILL BLEEDING", 72, 240);
    ctx.fillStyle = "#ffd36a";
    ctx.font = "400 140px 'Instrument Serif', Georgia, serif";
    ctx.fillText(money(payload.y), 72, 430);
    ctx.fillStyle = "#f3efe6";
    ctx.font = "italic 40px 'Instrument Serif', Georgia, serif";
    ctx.fillText("/ year, still leaving.", 72, 500);
    ctx.fillStyle = "#d6d0c4";
    ctx.font = "500 32px Outfit, system-ui, sans-serif";
    var n = payload.c || 0;
    ctx.fillText(n + " subscription" + (n === 1 ? "" : "s") + " on the list.", 72, 600);
    ctx.fillStyle = "#9a958a";
    ctx.font = "400 28px Outfit, system-ui, sans-serif";
    var trap = wrapText(ctx, "The maze is the product. Track them here — locally. No Plaid. No cut of what you save.", w - 144);
    var y = 680;
    trap.forEach(function (line) {
      ctx.fillText(line, 72, y);
      y += 40;
    });
    ctx.fillStyle = "#c6f28a";
    ctx.font = "700 28px Outfit, system-ui, sans-serif";
    ctx.fillText("Unhook the ones that fight back.", 72, h - 140);
  }

  function drawMap(ctx, w, h, payload) {
    drawPaper(ctx, w, h);
    drawBrand(ctx, w);
    ctx.fillStyle = "#ff5a1f";
    ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText("THE EXIT  ·  " + String(payload.cat || "PLAYBOOK").toUpperCase(), 72, 230);
    ctx.fillStyle = "#f3efe6";
    ctx.font = "400 86px 'Instrument Serif', Georgia, serif";
    var nameLines = wrapText(ctx, payload.n || "Unknown", w - 144);
    var y = 330;
    nameLines.slice(0, 3).forEach(function (line) {
      ctx.fillText(line, 72, y);
      y += 90;
    });
    ctx.fillStyle = "#ffd36a";
    ctx.font = "italic 34px 'Instrument Serif', Georgia, serif";
    var trapLines = wrapText(ctx, payload.trap || "They hid the cancel button.", w - 144);
    y += 20;
    trapLines.slice(0, 5).forEach(function (line) {
      ctx.fillText(line, 72, y);
      y += 44;
    });
    ctx.fillStyle = "#d6d0c4";
    ctx.font = "500 28px Outfit, system-ui, sans-serif";
    ctx.fillText("Script, letter, cancel-by date.", 72, h - 240);
    ctx.fillStyle = "#9a958a";
    ctx.font = "500 22px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText("Send this to someone still paying.", 72, h - 170);
    ctx.fillStyle = "#c6f28a";
    ctx.font = "700 26px Outfit, system-ui, sans-serif";
    ctx.fillText("No bank login. No cut of the savings.", 72, h - 110);
  }

  function renderCard(payload, opts) {
    if (typeof document === "undefined") {
      throw new Error("renderCard needs a document");
    }
    opts = opts || {};
    var w = opts.width || 1080;
    var h = opts.height || 1350;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, w, h);
    if (payload.t === "bleed") drawBleed(ctx, w, h, payload);
    else if (payload.t === "map") drawMap(ctx, w, h, payload);
    else drawWin(ctx, w, h, payload);
    return canvas;
  }

  function todayISO(d) {
    var dt = d || new Date();
    var m = String(dt.getMonth() + 1).padStart(2, "0");
    var day = String(dt.getDate()).padStart(2, "0");
    return dt.getFullYear() + "-" + m + "-" + day;
  }

  return {
    VERSION: VERSION,
    encodeCard: encodeCard,
    decodeCard: decodeCard,
    cardUrl: cardUrl,
    playbookUrl: playbookUrl,
    captionFor: captionFor,
    xIntent: xIntent,
    renderCard: renderCard,
    money: money,
    yearlyFromMonthly: yearlyFromMonthly,
    todayISO: todayISO,
  };
});
