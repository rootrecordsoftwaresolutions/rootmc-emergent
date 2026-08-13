/*! RootMC home — Ava chat (natural voice + light history) */
(function () {
  var DAILY_URLS = ["https://api.rootmc.net/api/rootmc/daily-report"];
  var HOURS_URLS = ["https://ava.rootmc.net/api/ava-hours"];
  var CHAT_URLS = ["https://ava.rootmc.net/api/public-chat"];
  var history = [];

  function $(id) {
    return document.getElementById(id);
  }

  function stripMd(s) {
    return String(s || "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/_/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function remember(who, text) {
    history.push({ who: who, text: String(text || "").slice(0, 500) });
    if (history.length > 8) history = history.slice(-8);
  }

  function appendBubble(who, text, opts) {
    var log = $("rmcChatLog");
    if (!log) return null;
    var loading = log.querySelector(".rmc-ava-loading");
    if (loading) loading.remove();
    var typing = log.querySelector(".rmc-ava-typing");
    if (typing && !(opts && opts.keepTyping)) typing.remove();
    var div = document.createElement("div");
    div.className =
      "rmc-ava-bubble " + who + (opts && opts.summary ? " rmc-ava-summary" : "");
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function setTyping(on) {
    var log = $("rmcChatLog");
    if (!log) return;
    var existing = log.querySelector(".rmc-ava-typing");
    if (!on) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var div = document.createElement("div");
    div.className = "rmc-ava-bubble ava rmc-ava-typing";
    div.setAttribute("aria-live", "polite");
    div.innerHTML =
      '<span class="rmc-ava-dots" aria-hidden="true"><i></i><i></i><i></i></span> Ava is typing…';
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function fetchJson(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error("unreachable"));
      var url = urls[i++];
      return fetch(url, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("bad");
          return r.json();
        })
        .catch(function () {
          return next();
        });
    }
    return next();
  }

  function buildOpener(daily, hours) {
    var latest = (daily && daily.reports && daily.reports[0]) || null;
    var day = latest && latest.day_key ? latest.day_key : null;
    var beat = "";
    if (latest) {
      beat = String(latest.summary || "").trim();
      if (!beat && latest.report_text) {
        beat = stripMd(latest.report_text).split("\n").slice(0, 2).join(" ");
      }
      beat = stripMd(beat).replace(/\s+/g, " ").slice(0, 160);
    }
    var asleep = hours && hours.asleep;
    var bank =
      hours && hours.live && hours.live.bankPct != null
        ? Math.round(hours.live.bankPct)
        : null;
    var parts = [];
    parts.push(
      asleep
        ? "Hey — night bank power on, so I might be a little softer."
        : "Hey — I'm Ava."
    );
    if (beat) {
      parts.push(day ? "Quick pulse from " + day + ": " + beat : beat);
    } else {
      parts.push("Ask me about joining, Gold, the map, votes, wiki — whatever.");
    }
    if (bank != null && !isNaN(bank)) {
      parts.push("Solar bank's around " + bank + "% right now.");
    } else if (!beat) {
      parts.push("play.rootmc.net when you're ready.");
    }
    return parts.join(" ");
  }

  function loadOpener() {
    Promise.all([
      fetchJson(DAILY_URLS).catch(function () {
        return null;
      }),
      fetchJson(HOURS_URLS).catch(function () {
        return null;
      }),
    ]).then(function (pair) {
      var daily = pair[0];
      var hours = pair[1];
      var st = $("rmcChatStatus");
      if (st && hours) {
        st.textContent = hours.asleep ? "sleep · solar" : "awake · solar";
      }
      var text = buildOpener(daily, hours);
      appendBubble("ava", text, { summary: true });
      remember("ava", text);
    });
  }

  function bootChat() {
    var form = $("rmcChatForm");
    var input = $("rmcChatInput");
    var send = $("rmcChatSend");
    if (!form || !input) return;
    if (input && !input.getAttribute("placeholder")) {
      input.setAttribute("placeholder", "Say hey, or ask about RootMC…");
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var text = String(input.value || "").trim();
      if (!text) return;
      appendBubble("you", text);
      remember("you", text);
      input.value = "";
      if (send) send.disabled = true;
      setTyping(true);
      var i = 0;
      function next() {
        if (i >= CHAT_URLS.length) {
          return Promise.reject(new Error("chat unreachable"));
        }
        var url = CHAT_URLS[i++];
        return fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            question: text,
            message: text,
            authorName: "rootmc-visitor",
            history: history.slice(0, -1),
            context: "rootmc.net home chat — natural conversation",
          }),
        })
          .then(function (r) {
            if (!r.ok) throw new Error("bad");
            return r.json();
          })
          .then(function (d) {
            if (d && (d.answer || d.ok)) return d;
            throw new Error("bad");
          })
          .catch(function () {
            return next();
          });
      }
      next()
        .then(function (d) {
          setTyping(false);
          var reply = String(d.answer || "").trim() || "…";
          appendBubble("ava", reply);
          remember("ava", reply);
        })
        .catch(function () {
          setTyping(false);
          var fail =
            "Hmm, I lost the line for a second — try again, or catch me on Discord.";
          appendBubble("ava", fail);
          remember("ava", fail);
        })
        .finally(function () {
          if (send) send.disabled = false;
          input.focus();
        });
    });
  }

  loadOpener();
  bootChat();
})();
