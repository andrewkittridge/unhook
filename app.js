(function () {
  "use strict";

  var PLAYBOOKS = window.PLAYBOOKS || [];
  var Share = window.UnhookShare;
  var BLEED_KEY = "unhook.bleed";
  var REQUEST_KEY = "unhook.requests";
  var state = {
    query: "",
    filter: "All",
    bleed: loadBleed(),
    sharePayload: null,
    landing: null,
  };

  var $ = function (sel, el) {
    return (el || document).querySelector(sel);
  };
  var $$ = function (sel, el) {
    return Array.prototype.slice.call((el || document).querySelectorAll(sel));
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function byId(id) {
    return PLAYBOOKS.find(function (p) {
      return p.id === id;
    });
  }

  function loadBleed() {
    try {
      var raw = JSON.parse(localStorage.getItem(BLEED_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveBleed() {
    localStorage.setItem(BLEED_KEY, JSON.stringify(state.bleed));
  }

  function loadRequests() {
    try {
      return JSON.parse(localStorage.getItem(REQUEST_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveRequest(name) {
    var list = loadRequests();
    if (!list.some(function (r) { return r.toLowerCase() === name.toLowerCase(); })) {
      list.push(name);
      localStorage.setItem(REQUEST_KEY, JSON.stringify(list));
    }
  }

  function categories() {
    var set = {};
    PLAYBOOKS.forEach(function (p) {
      set[p.category] = true;
    });
    return ["All"].concat(Object.keys(set).sort());
  }

  function matches(p, q, filter) {
    if (filter && filter !== "All" && p.category !== filter) return false;
    if (!q) return true;
    var hay = (p.name + " " + p.aliases.join(" ") + " " + p.category + " " + p.blurb).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function filtered() {
    var q = state.query.trim().toLowerCase();
    return PLAYBOOKS.filter(function (p) {
      return matches(p, q, state.filter);
    });
  }

  function pillClass(d) {
    if (d === "hard") return "pill d-hard";
    if (d === "mid") return "pill d-mid";
    return "pill d-easy";
  }

  function renderFilters() {
    var el = $("#filters");
    el.innerHTML = categories()
      .map(function (c) {
        return (
          '<button type="button" class="chip' +
          (state.filter === c ? " on" : "") +
          '" data-filter="' +
          esc(c) +
          '">' +
          esc(c) +
          "</button>"
        );
      })
      .join("");
  }

  function renderGrid() {
    var el = $("#grid");
    var rows = filtered();
    if (!rows.length) {
      var q = state.query.trim();
      el.innerHTML =
        '<div class="empty">' +
        (q
          ? "<p>No playbook for <b>" +
            esc(q) +
            "</b> yet.</p><p>Send this search to a friend still paying them. Three people asking is how a company hits the hard list.</p>" +
            '<div class="actions"><button type="button" class="btn" id="share-request">Share this request</button></div>'
          : "<p>Nothing in this filter. Try All.</p>") +
        "</div>";
      return;
    }
    el.innerHTML = rows
      .map(function (p) {
        return (
          '<button type="button" class="card" data-open="' +
          esc(p.id) +
          '">' +
          '<div class="card-top"><h3>' +
          esc(p.name) +
          '</h3><span class="' +
          pillClass(p.difficulty) +
          '">' +
          esc(p.difficulty) +
          "</span></div>" +
          "<p>" +
          esc(p.blurb) +
          "</p>" +
          '<div class="meta">' +
          esc(p.category) +
          " · typically " +
          Share.money(p.typical) +
          "/mo</div>" +
          "</button>"
        );
      })
      .join("");
  }

  function formatDate(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function computeCancelBy(rule, now) {
    now = now || new Date();
    if (!rule) return null;
    if (rule.kind === "before-day") {
      var buffer = rule.mailBuffer || 0;
      var targetDay = Math.max(1, rule.day - buffer);
      var dt = new Date(now.getFullYear(), now.getMonth(), targetDay);
      if (dt < now) dt = new Date(now.getFullYear(), now.getMonth() + 1, targetDay);
      return { date: dt, label: "Mail by " + formatDate(dt), hint: rule.hint };
    }
    if (rule.kind === "notice-days") {
      var hit = new Date(now.getTime() + rule.noticeDays * 86400000);
      return { date: hit, label: "Notice hits " + formatDate(hit), hint: rule.hint };
    }
    return { date: null, label: rule.hint, hint: rule.hint };
  }

  function fillTemplate(str, fields) {
    return String(str || "").replace(/\{\{(\w+)\}\}/g, function (_, k) {
      return fields[k] != null && fields[k] !== "" ? fields[k] : "[" + k + "]";
    });
  }

  function letterFields(p) {
    var box = $("#letter-fields");
    if (!box) return {};
    var fields = {
      today: formatDate(new Date()),
      fullName: ($("#lf-fullName") && $("#lf-fullName").value) || "",
      address: ($("#lf-address") && $("#lf-address").value) || "",
      phone: ($("#lf-phone") && $("#lf-phone").value) || "",
      to: ($("#lf-to") && $("#lf-to").value) || p.letter.defaultTo,
    };
    (p.letter.extraFields || []).forEach(function (f) {
      var input = $("#lf-" + f.key);
      fields[f.key] = input ? input.value : "";
    });
    return fields;
  }

  function renderLetter(p) {
    var pre = $("#print-letter");
    if (!pre) return;
    var fields = letterFields(p);
    pre.textContent =
      fillTemplate(p.letter.subject, fields) + "\n\n" + fillTemplate(p.letter.body, fields);
  }

  function renderDetail(p) {
    var cancel = computeCancelBy(p.cancelBy);
    var extras = (p.letter.extraFields || [])
      .map(function (f) {
        return (
          '<label class="field"><span>' +
          esc(f.label) +
          '</span><input id="lf-' +
          esc(f.key) +
          '" placeholder="' +
          esc(f.placeholder) +
          '" /></label>'
        );
      })
      .join("");
    var steps = p.steps
      .map(function (s) {
        return "<li><strong>" + esc(s.title) + "</strong> " + esc(s.body) + "</li>";
      })
      .join("");
    var script = p.script
      .map(function (line) {
        return (
          '<div class="' +
          (line.who === "you" ? "you" : "them") +
          '"><b>' +
          (line.who === "you" ? "You" : "Them") +
          "</b> " +
          esc(line.text) +
          "</div>"
        );
      })
      .join("");
    var fails = p.fails.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
    var links = "";
    if (p.url) links += '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">Open their account</a>';
    if (p.phone) links += '<a href="tel:' + esc(p.phone) + '">' + esc(p.phone) + "</a>";

    $("#detail").innerHTML =
      '<p class="kicker">' +
      esc(p.category) +
      "</p>" +
      '<h3 class="svc" id="svc-name">' +
      esc(p.name) +
      "</h3>" +
      '<div class="badge-row"><span class="' +
      pillClass(p.difficulty) +
      '">' +
      esc(p.difficulty) +
      "</span><span class=\"pill d-mid\">typically " +
      Share.money(p.typical) +
      "/mo</span></div>" +
      '<p class="trap">' +
      esc(p.trap) +
      "</p>" +
      '<div class="cols">' +
      '<div class="box bad"><h4>What fails</h4><ul>' +
      fails +
      "</ul></div>" +
      '<div class="box good"><h4>The path</h4><p>' +
      esc(p.path) +
      "</p><p class=\"meta\">" +
      esc(cancel ? cancel.label : "") +
      "</p><p class=\"hint\">" +
      esc(cancel ? cancel.hint : "") +
      "</p></div>" +
      "</div>" +
      '<div class="links">' +
      links +
      "</div>" +
      "<h4 class=\"box-title\">Steps</h4><ol class=\"steps\">" +
      steps +
      "</ol>" +
      "<h4 class=\"box-title\">" +
      esc(p.scriptTitle) +
      '</h4><div class="script" id="script-box">' +
      script +
      "</div>" +
      '<div class="actions">' +
      '<button type="button" class="btn ghost" data-copy-script>Copy script</button>' +
      '<button type="button" class="btn" data-share-map>Send this playbook</button>' +
      "</div>" +
      "<h4 class=\"box-title\">Certified-mail letter</h4>" +
      '<div class="fields" id="letter-fields">' +
      '<label class="field"><span>Your name</span><input id="lf-fullName" placeholder="Name on the account" /></label>' +
      '<label class="field"><span>Phone</span><input id="lf-phone" placeholder="Phone on file" /></label>' +
      '<label class="field full"><span>Address on file</span><input id="lf-address" placeholder="Street, city, state" /></label>' +
      '<label class="field full"><span>' +
      esc(p.letter.toLabel) +
      '</span><input id="lf-to" value="' +
      esc(p.letter.defaultTo) +
      '" /></label>' +
      extras +
      "</div>" +
      '<pre class="letter" id="print-letter"></pre>' +
      '<div class="actions">' +
      '<button type="button" class="btn ghost" data-copy-letter>Copy letter</button>' +
      '<button type="button" class="btn ghost" data-print-letter>Print letter</button>' +
      '<button type="button" class="btn" data-add-bleed>Add to bleed list</button>' +
      "</div>";

    renderLetter(p);
    $("#detail").dataset.id = p.id;
  }

  function openDrawer(id) {
    var p = byId(id);
    if (!p) return;
    renderDetail(p);
    $("#drawer").hidden = false;
    document.body.style.overflow = "hidden";
    var url = new URL(location.href);
    url.searchParams.set("p", id);
    history.replaceState(null, "", url);
    $("#close").focus();
  }

  function closeDrawer() {
    $("#drawer").hidden = true;
    document.body.style.overflow = "";
    var url = new URL(location.href);
    url.searchParams.delete("p");
    history.replaceState(null, "", url);
  }

  function paying() {
    return state.bleed.filter(function (b) {
      return b.status !== "unhooked";
    });
  }

  function unhooked() {
    return state.bleed.filter(function (b) {
      return b.status === "unhooked";
    });
  }

  function monthlyTotal(rows) {
    return rows.reduce(function (sum, b) {
      return sum + (Number(b.amount) || 0);
    }, 0);
  }

  function renderBleed() {
    var live = paying();
    var mo = monthlyTotal(live);
    var yr = Math.round(mo * 12);
    $("#bleed-summary").innerHTML =
      "<span>" +
      Share.money(mo) +
      " / mo</span><span>" +
      Share.money(yr) +
      " / yr leaking</span><span>" +
      live.length +
      " still on the list</span>";
    $("#bleed-share").disabled = live.length === 0;
    var ul = $("#bleed-list");
    if (!state.bleed.length) {
      ul.innerHTML = '<li class="bleed-empty">Nothing parked yet. Add a company from the hard list or pick Other.</li>';
      return;
    }
    ul.innerHTML = state.bleed
      .map(function (b) {
        var done = b.status === "unhooked";
        return (
          "<li class=\"" +
          (done ? "is-unhooked" : "") +
          '" data-bleed="' +
          esc(b.id) +
          '"><span>' +
          esc(b.name) +
          (done ? ' <em>unhooked</em>' : "") +
          "</span><span>" +
          Share.money(b.amount) +
          "/mo</span>" +
          (done
            ? '<button type="button" data-share-win="' +
              esc(b.id) +
              '">Share card</button>'
            : '<button type="button" class="good-action" data-unhook="' +
              esc(b.id) +
              '">Unhooked</button>') +
          '<button type="button" data-remove="' +
          esc(b.id) +
          '">Remove</button></li>'
        );
      })
      .join("");
  }

  function renderTrophies() {
    var wins = unhooked();
    var empty = $("#trophy-empty");
    var list = $("#trophy-list");
    if (!wins.length) {
      empty.hidden = false;
      list.innerHTML = "";
      return;
    }
    empty.hidden = true;
    var yr = Math.round(monthlyTotal(wins) * 12);
    list.innerHTML =
      '<li class="trophy-total">' +
      wins.length +
      " unhooked · " +
      Share.money(yr) +
      " / year back</li>" +
      wins
        .map(function (b) {
          return (
            '<li><button type="button" data-share-win="' +
            esc(b.id) +
            '"><strong>' +
            esc(b.name) +
            "</strong><span>" +
            Share.money(Share.yearlyFromMonthly(b.amount)) +
            "/yr · " +
            esc(b.unhookedAt || "") +
            "</span></button></li>"
          );
        })
        .join("");
  }

  function fillBleedSelect() {
    var sel = $("#bleed-service");
    sel.innerHTML =
      PLAYBOOKS.map(function (p) {
        return '<option value="' + esc(p.id) + '">' + esc(p.name) + "</option>";
      }).join("") + '<option value="other">Other…</option>';
  }

  function addBleed(slug, name, amount) {
    state.bleed.push({
      id: "b-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      slug: slug && byId(slug) ? slug : null,
      name: name,
      amount: Number(amount) || 0,
      status: "paying",
      addedAt: Share.todayISO(),
    });
    saveBleed();
    renderBleed();
    renderTrophies();
  }

  function paintShareCanvas(canvas, payload) {
    var paint = function () {
      try {
        var painted = Share.renderCard(payload);
        var ctx = canvas.getContext("2d");
        canvas.width = painted.width;
        canvas.height = painted.height;
        ctx.drawImage(painted, 0, 0);
      } catch (err) {
        console.error("Unhook card render failed", err);
      }
    };
    if (document.fonts && document.fonts.ready) {
      var timeout = new Promise(function (resolve) {
        setTimeout(resolve, 900);
      });
      return Promise.race([document.fonts.ready, timeout]).then(paint);
    }
    paint();
    return Promise.resolve();
  }

  function openShare(payload, title, sub) {
    state.sharePayload = payload;
    $("#share-title").textContent = title;
    $("#share-sub").textContent = sub || "";
    var url = Share.cardUrl(payload);
    var caption = Share.captionFor(payload, url);
    $("#share-caption").textContent = caption;
    $("#share-x").href = Share.xIntent(caption);
    $("#share-sheet").hidden = false;
    document.body.style.overflow = "hidden";
    paintShareCanvas($("#share-preview"), payload);
  }

  function closeShare() {
    $("#share-sheet").hidden = true;
    if ($("#drawer").hidden && $("#card-landing").hidden) document.body.style.overflow = "";
  }

  function shareWinItem(bleedId) {
    var item = state.bleed.find(function (b) {
      return b.id === bleedId;
    });
    if (!item) return;
    openShare(
      {
        t: "win",
        n: item.name,
        a: Number(item.amount) || 0,
        d: item.unhookedAt || Share.todayISO(),
        s: item.slug || undefined,
      },
      "I Unhooked " + item.name,
      "A receipt. Not a screenshot of your bank app."
    );
  }

  function shareBleed() {
    var live = paying();
    if (!live.length) return;
    openShare(
      {
        t: "bleed",
        y: Math.round(monthlyTotal(live) * 12),
        c: live.length,
      },
      "The leak",
      "Yearly total and a count. Company names stay on this device."
    );
  }

  function shareMap(p) {
    openShare(
      {
        t: "map",
        n: p.name,
        s: p.id,
        cat: p.category,
        trap: p.blurb,
      },
      "Send " + p.name,
      "A friend opens this and gets the trap, then the playbook — not your letter."
    );
  }

  function shareRequest(name) {
    saveRequest(name);
    openShare(
      {
        t: "map",
        n: name,
        cat: "Request",
        trap: "Unhook doesn't have this playbook yet. If you've been trapped here, send the path.",
      },
      "Request " + name,
      "Three people asking is how a company hits the hard list."
    );
  }

  function canvasPngBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, "image/png");
    });
  }

  function nativeShare() {
    var payload = state.sharePayload;
    if (!payload) return;
    var url = Share.cardUrl(payload);
    var caption = Share.captionFor(payload, url);
    var canvas = $("#share-preview");
    var share = function (file) {
      var data = { title: $("#share-title").textContent, text: caption, url: url };
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
      return navigator.share(data);
    };
    if (navigator.share) {
      canvasPngBlob(canvas)
        .then(function (blob) {
          var file = blob ? new File([blob], "unhook.png", { type: "image/png" }) : null;
          return share(file).catch(function (err) {
            if (err && err.name === "AbortError") return;
            return navigator.share({ title: dataTitle(), text: caption, url: url });
          });
        })
        .catch(function () {});
    } else {
      copyText(url, $("#share-native"), "Link copied");
    }
  }

  function dataTitle() {
    return $("#share-title").textContent;
  }

  function downloadPng() {
    var canvas = $("#share-preview");
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "unhook.png";
    a.click();
  }

  function flashBtn(btn, done) {
    if (!btn) return;
    var label = btn.textContent;
    btn.textContent = done || "Copied";
    btn.classList.add("is-done");
    clearTimeout(btn._flash);
    btn._flash = setTimeout(function () {
      btn.textContent = label;
      btn.classList.remove("is-done");
    }, 1600);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyText(text, btn, done) {
    var finish = function () {
      flashBtn(btn, done);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(function () {
        fallbackCopy(text);
        finish();
      });
    } else {
      fallbackCopy(text);
      finish();
    }
  }

  function showLanding(payload) {
    state.landing = payload;
    var kicker = $("#landing-kicker");
    var title = $("#landing-title");
    var lede = $("#landing-lede");
    var cta = $("#landing-cta");
    if (payload.t === "win") {
      kicker.textContent = "Someone Unhooked";
      title.textContent = payload.n;
      lede.textContent =
        Share.money(Share.yearlyFromMonthly(payload.a)) +
        " / year back. Get the playbook if you're still paying them.";
      cta.textContent = payload.s ? "Open the " + payload.n + " playbook" : "Browse the hard list";
    } else if (payload.t === "bleed") {
      kicker.textContent = "The leak";
      title.textContent = Share.money(payload.y) + " / year";
      lede.textContent =
        payload.c +
        " subscriptions still drafting. Park yours locally. Share the number, not the names.";
      cta.textContent = "Start a bleed list";
    } else {
      kicker.textContent = "Someone sent you an exit";
      title.textContent = payload.n;
      lede.textContent = payload.trap || "Here's the cancel path.";
      cta.textContent = payload.s ? "Open the playbook" : "Search Unhook";
    }
    $("#card-landing").hidden = false;
    document.body.style.overflow = "hidden";
    paintShareCanvas($("#landing-canvas"), payload);
  }

  function hideLanding() {
    $("#card-landing").hidden = true;
    document.body.style.overflow = $("#drawer").hidden && $("#share-sheet").hidden ? "" : "hidden";
    if (location.hash.indexOf("card=") === 1) history.replaceState(null, "", location.pathname + location.search);
  }

  function landingCta() {
    var payload = state.landing;
    hideLanding();
    if (!payload) return;
    if (payload.t === "bleed") {
      $("#bleed").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (payload.s && byId(payload.s)) openDrawer(payload.s);
    else $("#q").focus();
  }

  function applyUrl() {
    var params = new URLSearchParams(location.search);
    var playbook = params.get("p");
    var hash = location.hash || "";
    var cardMatch = hash.match(/card=([^&]+)/);
    if (cardMatch) {
      var payload = Share.decodeCard(cardMatch[1]);
      if (payload) showLanding(payload);
    }
    if (playbook && byId(playbook)) openDrawer(playbook);
  }

  function toastCopy(btn, text) {
    copyText(text, btn, "Copied");
  }

  function bind() {
    $("#q").addEventListener("input", function (e) {
      state.query = e.target.value;
      renderGrid();
    });
    $("#q").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var rows = filtered();
        if (rows.length === 1) openDrawer(rows[0].id);
      }
    });
    $("#filters").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      state.filter = btn.getAttribute("data-filter");
      renderFilters();
      renderGrid();
    });
    $("#grid").addEventListener("click", function (e) {
      var card = e.target.closest("[data-open]");
      if (card) openDrawer(card.getAttribute("data-open"));
      if (e.target.id === "share-request") shareRequest(state.query.trim());
    });
    $$("[data-reset]").forEach(function (el) {
      el.addEventListener("click", function () {
        state.query = "";
        state.filter = "All";
        $("#q").value = "";
        renderFilters();
        renderGrid();
        closeDrawer();
      });
    });
    $("#close").addEventListener("click", closeDrawer);
    $("#drawer").addEventListener("click", function (e) {
      if (e.target.id === "drawer") closeDrawer();
    });
    $("#detail").addEventListener("input", function () {
      var id = $("#detail").dataset.id;
      var p = byId(id);
      if (p) renderLetter(p);
    });
    $("#detail").addEventListener("click", function (e) {
      var id = $("#detail").dataset.id;
      var p = byId(id);
      if (!p) return;
      if (e.target.closest("[data-copy-script]")) {
        var text = p.script
          .map(function (line) {
            return (line.who === "you" ? "You: " : "Them: ") + line.text;
          })
          .join("\n");
        toastCopy(e.target.closest("button"), text);
      }
      if (e.target.closest("[data-copy-letter]")) {
        toastCopy(e.target.closest("button"), $("#print-letter").textContent);
      }
      if (e.target.closest("[data-print-letter]")) window.print();
      if (e.target.closest("[data-share-map]")) shareMap(p);
      if (e.target.closest("[data-add-bleed]")) {
        addBleed(p.id, p.name, p.typical);
        flashBtn(e.target.closest("button"), "On the bleed list");
      }
    });
    $("#bleed-service").addEventListener("change", function () {
      var other = $("#bleed-service").value === "other";
      $("#bleed-custom").hidden = !other;
      if (other) $("#bleed-custom").focus();
      var p = byId($("#bleed-service").value);
      if (p && !$("#bleed-amount").value) $("#bleed-amount").placeholder = p.typical + " typical";
    });
    $("#bleed-add-btn").addEventListener("click", function () {
      var sel = $("#bleed-service").value;
      var p = byId(sel);
      var name = p ? p.name : $("#bleed-custom").value.trim();
      if (!name) return;
      var amount = $("#bleed-amount").value || (p && p.typical) || 0;
      addBleed(p ? p.id : null, name, amount);
      $("#bleed-amount").value = "";
      $("#bleed-custom").value = "";
    });
    $("#bleed-list").addEventListener("click", function (e) {
      var unhook = e.target.closest("[data-unhook]");
      var remove = e.target.closest("[data-remove]");
      var share = e.target.closest("[data-share-win]");
      if (unhook) {
        var id = unhook.getAttribute("data-unhook");
        state.bleed = state.bleed.map(function (b) {
          if (b.id !== id) return b;
          return Object.assign({}, b, { status: "unhooked", unhookedAt: Share.todayISO() });
        });
        saveBleed();
        renderBleed();
        renderTrophies();
        shareWinItem(id);
      }
      if (remove) {
        var rid = remove.getAttribute("data-remove");
        state.bleed = state.bleed.filter(function (b) {
          return b.id !== rid;
        });
        saveBleed();
        renderBleed();
        renderTrophies();
      }
      if (share) shareWinItem(share.getAttribute("data-share-win"));
    });
    $("#bleed-share").addEventListener("click", shareBleed);
    $("#trophy-list").addEventListener("click", function (e) {
      var share = e.target.closest("[data-share-win]");
      if (share) shareWinItem(share.getAttribute("data-share-win"));
    });
    $("#share-close").addEventListener("click", closeShare);
    $("#share-sheet").addEventListener("click", function (e) {
      if (e.target.id === "share-sheet") closeShare();
    });
    $("#share-native").addEventListener("click", nativeShare);
    $("#share-download").addEventListener("click", downloadPng);
    $("#share-copy-link").addEventListener("click", function () {
      copyText(Share.cardUrl(state.sharePayload), $("#share-copy-link"), "Link copied");
    });
    $("#share-copy-caption").addEventListener("click", function () {
      copyText($("#share-caption").textContent, $("#share-copy-caption"), "Caption copied");
    });
    $("#landing-dismiss").addEventListener("click", hideLanding);
    $("#landing-cta").addEventListener("click", landingCta);
    $("#landing-share").addEventListener("click", function () {
      if (state.landing) {
        var p = state.landing;
        var title =
          p.t === "win" ? "I Unhooked " + p.n : p.t === "bleed" ? "The leak" : "Send " + p.n;
        hideLanding();
        openShare(payloadSafe(p), title, "");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!$("#share-sheet").hidden) closeShare();
      else if (!$("#card-landing").hidden) hideLanding();
      else if (!$("#drawer").hidden) closeDrawer();
    });
    window.addEventListener("hashchange", applyUrl);
  }

  function payloadSafe(p) {
    return p;
  }

  function init() {
    renderFilters();
    renderGrid();
    fillBleedSelect();
    renderBleed();
    renderTrophies();
    bind();
    if (!navigator.share) $("#share-native").hidden = true;
    applyUrl();
  }

  init();
})();
