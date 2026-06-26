// Admin — project management. Simple admin password, verified server-side by
// password-gated Postgres RPCs (the public key alone cannot read/write data).
(function () {
  "use strict";

  var SB_URL = "https://frwhyxwltvvdkmonzezb.supabase.co";
  var SB_KEY = "sb_publishable_3McKgqBPb17EOUyQrdMWqw_1AsHVm3G";
  var STAGES = ["Discovery", "Design", "Build", "Review", "Launch"];
  var sb = window.supabase.createClient(SB_URL, SB_KEY);

  var loginScreen = document.getElementById("loginScreen");
  var panel = document.getElementById("adminPanel");
  var loginForm = document.getElementById("loginForm");
  var loginMsg = document.getElementById("loginMsg");
  var listEl = document.getElementById("projectsList");

  function secret() { try { return sessionStorage.getItem("morobo_admin") || ""; } catch (e) { return window.__adminPw || ""; } }
  function setSecret(v) { try { sessionStorage.setItem("morobo_admin", v); } catch (e) { window.__adminPw = v; } }
  function clearSecret() { try { sessionStorage.removeItem("morobo_admin"); } catch (e) {} window.__adminPw = ""; }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function msg(el, text, ok) { el.textContent = text; el.className = "a-msg " + (ok ? "ok" : "err"); }
  function fmtDate(d) { if (!d) return "—"; try { return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return d; } }
  function genId(client, app) {
    var base = (client || app || "PROJ").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "PROJ";
    var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", r = "";
    for (var i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return base + "-" + r;
  }

  function showLogin() { loginScreen.style.display = "block"; panel.style.display = "none"; }
  function showPanel() { loginScreen.style.display = "none"; panel.style.display = "block"; }

  // Returns {ok, data} — calls the password-gated RPC
  async function fetchProjects() {
    var res = await sb.rpc("admin_projects", { p_secret: secret() });
    if (res.error) return { ok: false, error: res.error };
    return { ok: true, data: res.data || [] };
  }

  async function boot() {
    if (secret()) {
      var r = await fetchProjects();
      if (r.ok) { showPanel(); renderList(r.data); return; }
      clearSecret();
    }
    showLogin();
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var pw = document.getElementById("password").value;
    var btn = document.getElementById("loginBtn"); btn.disabled = true;
    setSecret(pw);
    var r = await fetchProjects();
    btn.disabled = false;
    if (!r.ok) { clearSecret(); msg(loginMsg, "Incorrect password.", false); return; }
    document.getElementById("password").value = "";
    showPanel(); renderList(r.data);
  });

  document.getElementById("logoutBtn").addEventListener("click", function () { clearSecret(); showLogin(); });

  document.getElementById("createBtn").addEventListener("click", async function () {
    var client = document.getElementById("npClient").value.trim();
    var app = document.getElementById("npApp").value.trim();
    var cm = document.getElementById("createMsg");
    if (!client && !app) { msg(cm, "Add a client or app name first.", false); return; }
    var id = genId(client, app);
    var r = await sb.rpc("admin_save_project", { p_secret: secret(), p_id: id, p_client: client || app, p_app: app || client, p_stage_index: 0, p_progress: 0, p_eta: null, p_focus: null });
    if (r.error) { msg(cm, r.error.message, false); return; }
    msg(cm, "Created " + id, true);
    document.getElementById("npClient").value = ""; document.getElementById("npApp").value = "";
    reload();
  });

  async function reload() {
    var r = await fetchProjects();
    if (!r.ok) { clearSecret(); showLogin(); return; }
    renderList(r.data);
  }

  function renderList(projects) {
    if (!projects.length) { listEl.innerHTML = '<p style="color:var(--text-muted);">No projects yet. Create one above.</p>'; return; }
    listEl.innerHTML = "";
    projects.forEach(function (p) { listEl.appendChild(card(p)); });
  }

  function card(p) {
    var el = document.createElement("div");
    el.className = "a-card";
    var link = location.origin + location.pathname.replace(/admin\.html$/, "track.html") + "?id=" + encodeURIComponent(p.id);
    var stageOpts = STAGES.map(function (s, i) { return '<option value="' + i + '"' + (i === p.stage_index ? " selected" : "") + ">" + s + "</option>"; }).join("");
    var updates = p.updates || [];
    var upHtml = updates.length
      ? updates.map(function (u) { return '<div class="a-update"><span class="d">' + fmtDate(u.update_date) + "</span><span>" + esc(u.note) + "</span></div>"; }).join("")
      : '<p style="color:var(--text-muted); font-size:0.82rem;">No updates yet.</p>';

    el.innerHTML =
      '<div class="a-proj-head"><div><div class="a-proj-title">' + esc(p.app_name || p.client_name) + "</div>" +
        '<div style="color:var(--text-muted); font-size:0.85rem;">' + esc(p.client_name || "") + "</div></div>" +
        '<div style="text-align:right;"><span class="a-pid">' + esc(p.id) + "</span><br>" +
        '<button class="a-btn-link copy" data-link="' + esc(link) + '" style="margin-top:0.4rem;">Copy client link</button></div></div>' +
      '<div class="a-row">' +
        '<div class="a-field"><label>Stage</label><select class="a-select f-stage">' + stageOpts + "</select></div>" +
        '<div class="a-field"><label>Progress (%)</label><input class="a-input f-prog" type="number" min="0" max="100" value="' + (p.progress || 0) + '"></div>' +
      "</div>" +
      '<div class="a-row">' +
        '<div class="a-field"><label>Estimated launch</label><input class="a-input f-eta" type="date" value="' + (p.eta || "") + '"></div>' +
        '<div class="a-field"><label>&nbsp;</label><div style="color:var(--text-muted); font-size:0.8rem; padding-top:0.7rem;">Last updated ' + fmtDate((p.updated_at || "").slice(0, 10)) + "</div></div>" +
      "</div>" +
      '<div class="a-field" style="margin-bottom:0.85rem;"><label>What we’re working on</label><textarea class="a-textarea f-focus">' + esc(p.current_focus || "") + "</textarea></div>" +
      '<div class="a-actions"><button class="a-btn a-btn-primary save">Save changes</button>' +
        '<button class="a-btn a-btn-ghost open" data-link="' + esc(link) + '">Open client view</button>' +
        '<button class="a-btn a-btn-danger del">Delete</button></div>' +
      '<div class="a-msg saveMsg"></div>' +
      '<div class="a-updates"><label style="display:block; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-secondary); font-weight:700; margin-bottom:0.5rem;">Updates feed</label>' +
        upHtml +
        '<div class="a-row" style="margin-top:0.75rem;"><div class="a-field"><label>Date</label><input class="a-input u-date" type="date" value="' + new Date().toISOString().slice(0, 10) + '"></div>' +
        '<div class="a-field"><label>Note</label><input class="a-input u-note" placeholder="e.g. Finished the ordering screen"></div></div>' +
        '<div class="a-actions"><button class="a-btn a-btn-ghost addUpdate">Post update</button></div></div>';

    el.querySelector(".save").addEventListener("click", async function () {
      var sm = el.querySelector(".saveMsg");
      var si = parseInt(el.querySelector(".f-stage").value, 10);
      var r = await sb.rpc("admin_save_project", {
        p_secret: secret(), p_id: p.id, p_client: p.client_name || "", p_app: p.app_name || "",
        p_stage_index: si, p_progress: parseInt(el.querySelector(".f-prog").value, 10) || 0,
        p_eta: el.querySelector(".f-eta").value || null, p_focus: el.querySelector(".f-focus").value.trim() || null
      });
      if (r.error) { msg(sm, r.error.message, false); } else { msg(sm, "Saved.", true); reload(); }
    });
    el.querySelector(".addUpdate").addEventListener("click", async function () {
      var note = el.querySelector(".u-note").value.trim();
      var date = el.querySelector(".u-date").value || new Date().toISOString().slice(0, 10);
      var sm = el.querySelector(".saveMsg");
      if (!note) { msg(sm, "Write a note first.", false); return; }
      var r = await sb.rpc("admin_add_update", { p_secret: secret(), p_id: p.id, p_date: date, p_note: note });
      if (r.error) { msg(sm, r.error.message, false); return; }
      reload();
    });
    el.querySelector(".del").addEventListener("click", async function () {
      if (!confirm("Delete project " + p.id + " and all its updates?")) return;
      var r = await sb.rpc("admin_delete_project", { p_secret: secret(), p_id: p.id });
      if (r.error) { msg(el.querySelector(".saveMsg"), r.error.message, false); return; }
      reload();
    });
    el.querySelector(".copy").addEventListener("click", function (e) {
      var l = e.currentTarget.getAttribute("data-link");
      navigator.clipboard.writeText(l).then(function () { e.currentTarget.textContent = "Copied!"; setTimeout(function () { e.currentTarget.textContent = "Copy client link"; }, 1800); });
    });
    el.querySelector(".open").addEventListener("click", function (e) { window.open(e.currentTarget.getAttribute("data-link"), "_blank"); });
    return el;
  }

  boot();
})();
