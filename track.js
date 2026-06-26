// Track Your Project — client dashboard (Supabase-backed, read-only by Project ID)
(function () {
  "use strict";

  var SB_URL = "https://frwhyxwltvvdkmonzezb.supabase.co";
  var SB_KEY = "sb_publishable_3McKgqBPb17EOUyQrdMWqw_1AsHVm3G"; // publishable key (safe in client code)
  var sb = window.supabase.createClient(SB_URL, SB_KEY);

  var STAGES = ["Discovery", "Design", "Build", "Review", "Launch"];

  var form = document.getElementById("trackForm");
  var input = document.getElementById("projectId");
  var entry = document.getElementById("entryCard");
  var dash = document.getElementById("dashboard");
  var errEl = document.getElementById("errorMessage");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtDate(d) { if (!d) return "—"; try { return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return d; } }
  function fmtWhen(d) { if (!d) return ""; try { return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return ""; } }

  async function load(id) {
    id = (id || "").trim().toUpperCase();
    if (!id) return;
    errEl.style.display = "none";
    var btn = form.querySelector("button");
    var label = btn.textContent; btn.disabled = true; btn.textContent = "Loading…";
    try {
      var res = await sb.rpc("get_project", { p_id: id });
      if (res.error || !res.data || !res.data.project) {
        dash.style.display = "none"; entry.style.display = "block"; errEl.style.display = "block";
        errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> We couldn\'t find that Project ID. Double-check it and try again.';
      } else {
        try { localStorage.setItem("morobo_last_project", id); } catch (e) {}
        render(res.data.project, res.data.updates || []);
      }
    } catch (e) {
      errEl.textContent = "Something went wrong loading your project. Please try again.";
      errEl.style.display = "block";
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  }

  function render(p, updates) {
    entry.style.display = "none"; dash.style.display = "block";
    document.getElementById("dAppName").textContent = p.app_name || p.client_name || "Your Project";
    document.getElementById("dClient").textContent = p.client_name ? "for " + p.client_name : "";
    document.getElementById("dPid").textContent = p.id;

    var idx = (typeof p.stage_index === "number") ? p.stage_index : Math.max(0, STAGES.indexOf(p.stage));
    document.getElementById("stepper").innerHTML = STAGES.map(function (s, i) {
      var cls = i < idx ? "done" : (i === idx ? "current" : "");
      var mark = i < idx ? "✓" : (i + 1);
      return '<div class="step ' + cls + '"><div class="step-dot">' + mark + '</div><div class="step-label">' + s + "</div></div>";
    }).join("");

    var prog = Math.max(0, Math.min(100, p.progress || 0));
    document.getElementById("dProg").textContent = prog + "%";
    setTimeout(function () { document.getElementById("dBar").style.width = prog + "%"; }, 60);

    document.getElementById("dEta").textContent = fmtDate(p.eta);
    document.getElementById("dStage").textContent = p.stage || STAGES[idx] || "—";
    document.getElementById("dFocus").textContent = p.current_focus || "We'll post updates here as we go.";

    var feed = document.getElementById("feed");
    if (updates.length) {
      feed.innerHTML = updates.map(function (u) {
        return '<div class="feed-item"><div class="feed-date">' + fmtDate(u.update_date) + '</div><div class="feed-note">' + esc(u.note) + "</div></div>";
      }).join("");
    } else {
      feed.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; padding:0.5rem 0;">No updates yet — check back soon.</p>';
    }
    document.getElementById("dUpdated").textContent = p.updated_at ? "Last updated " + fmtWhen(p.updated_at) : "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); load(input.value); });
  document.getElementById("dBack").addEventListener("click", function () {
    dash.style.display = "none"; entry.style.display = "block"; input.value = ""; input.focus();
  });

  // Auto-load from a ?id= link, or the last ID viewed on this device
  var params = new URLSearchParams(location.search);
  var pid = params.get("id") || params.get("c");
  if (!pid) { try { pid = localStorage.getItem("morobo_last_project"); } catch (e) {} }
  if (pid) { input.value = pid; load(pid); }
})();
