// Admin — project management (Supabase Auth + DB). Writes are restricted by RLS to ADMIN_EMAIL.
(function () {
  "use strict";

  var SB_URL = "https://frwhyxwltvvdkmonzezb.supabase.co";
  var SB_KEY = "sb_publishable_3McKgqBPb17EOUyQrdMWqw_1AsHVm3G";
  var ADMIN_EMAIL = "morobo.llc@gmail.com";
  var STAGES = ["Discovery", "Design", "Build", "Review", "Launch"];
  var sb = window.supabase.createClient(SB_URL, SB_KEY);

  var loginScreen = document.getElementById("loginScreen");
  var panel = document.getElementById("adminPanel");
  var loginForm = document.getElementById("loginForm");
  var loginMsg = document.getElementById("loginMsg");
  var listEl = document.getElementById("projectsList");
  var signupMode = false;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function msg(el, text, ok) { el.textContent = text; el.className = "a-msg " + (ok ? "ok" : "err"); }
  function fmtDate(d) { if (!d) return "—"; try { return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return d; } }
  function genId(client, app) {
    var base = (client || app || "PROJ").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "PROJ";
    var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", r = "";
    for (var i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return base + "-" + r;
  }

  async function boot() {
    var sess = await sb.auth.getSession();
    var user = sess.data.session && sess.data.session.user;
    if (user && user.email === ADMIN_EMAIL) { showPanel(user); }
    else { if (user) await sb.auth.signOut(); showLogin(); }
  }
  function showLogin() { loginScreen.style.display = "block"; panel.style.display = "none"; }
  function showPanel(user) {
    loginScreen.style.display = "none"; panel.style.display = "block";
    document.getElementById("adminWho").textContent = "Signed in as " + user.email;
    loadProjects();
  }

  // ── Auth ──
  document.getElementById("toggleSignup").addEventListener("click", function () {
    signupMode = !signupMode;
    document.getElementById("loginBtn").textContent = signupMode ? "Create account" : "Sign in";
    this.textContent = signupMode ? "Have an account? Sign in" : "First time? Create your admin account";
    loginMsg.className = "a-msg";
  });

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;
    var btn = document.getElementById("loginBtn"); btn.disabled = true;
    try {
      if (signupMode) {
        if (email !== ADMIN_EMAIL) { msg(loginMsg, "Admin access is limited to " + ADMIN_EMAIL + ".", false); return; }
        var up = await sb.auth.signUp({ email: email, password: password });
        if (up.error) { msg(loginMsg, up.error.message, false); return; }
        msg(loginMsg, "Account created. Check " + ADMIN_EMAIL + " for a confirmation link, then sign in.", true);
        signupMode = false; document.getElementById("loginBtn").textContent = "Sign in";
      } else {
        var inr = await sb.auth.signInWithPassword({ email: email, password: password });
        if (inr.error) { msg(loginMsg, inr.error.message, false); return; }
        if (inr.data.user.email !== ADMIN_EMAIL) { await sb.auth.signOut(); msg(loginMsg, "That account isn't an admin.", false); return; }
        showPanel(inr.data.user);
      }
    } catch (err) { msg(loginMsg, "Something went wrong. Try again.", false); }
    finally { btn.disabled = false; }
  });

  document.getElementById("logoutBtn").addEventListener("click", async function () { await sb.auth.signOut(); showLogin(); });

  // ── Create ──
  document.getElementById("createBtn").addEventListener("click", async function () {
    var client = document.getElementById("npClient").value.trim();
    var app = document.getElementById("npApp").value.trim();
    var cm = document.getElementById("createMsg");
    if (!client && !app) { msg(cm, "Add a client or app name first.", false); return; }
    var id = genId(client, app);
    var ins = await sb.from("projects").insert({ id: id, client_name: client || app, app_name: app || client, stage: STAGES[0], stage_index: 0, progress: 0 });
    if (ins.error) { msg(cm, ins.error.message, false); return; }
    msg(cm, "Created " + id, true);
    document.getElementById("npClient").value = ""; document.getElementById("npApp").value = "";
    loadProjects();
  });

  // ── List + edit ──
  async function loadProjects() {
    listEl.innerHTML = '<p style="color:var(--text-muted);">Loading…</p>';
    var pr = await sb.from("projects").select("*").order("updated_at", { ascending: false });
    if (pr.error) { listEl.innerHTML = '<p style="color:#ef4444;">' + esc(pr.error.message) + "</p>"; return; }
    if (!pr.data.length) { listEl.innerHTML = '<p style="color:var(--text-muted);">No projects yet. Create one above.</p>'; return; }
    var ups = await sb.from("project_updates").select("*").order("update_date", { ascending: false });
    var byProj = {};
    (ups.data || []).forEach(function (u) { (byProj[u.project_id] = byProj[u.project_id] || []).push(u); });
    listEl.innerHTML = "";
    pr.data.forEach(function (p) { listEl.appendChild(card(p, byProj[p.id] || [])); });
  }

  function card(p, updates) {
    var el = document.createElement("div");
    el.className = "a-card";
    var link = location.origin + location.pathname.replace(/admin\.html$/, "track.html") + "?id=" + encodeURIComponent(p.id);
    var stageOpts = STAGES.map(function (s, i) { return '<option value="' + i + '"' + (i === p.stage_index ? " selected" : "") + ">" + s + "</option>"; }).join("");
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

    // wire actions
    el.querySelector(".save").addEventListener("click", async function () {
      var sm = el.querySelector(".saveMsg");
      var si = parseInt(el.querySelector(".f-stage").value, 10);
      var patch = {
        stage_index: si, stage: STAGES[si],
        progress: Math.max(0, Math.min(100, parseInt(el.querySelector(".f-prog").value, 10) || 0)),
        eta: el.querySelector(".f-eta").value || null,
        current_focus: el.querySelector(".f-focus").value.trim() || null,
        updated_at: new Date().toISOString()
      };
      var r = await sb.from("projects").update(patch).eq("id", p.id);
      if (r.error) { msg(sm, r.error.message, false); } else { msg(sm, "Saved.", true); }
    });
    el.querySelector(".addUpdate").addEventListener("click", async function () {
      var note = el.querySelector(".u-note").value.trim();
      var date = el.querySelector(".u-date").value || new Date().toISOString().slice(0, 10);
      var sm = el.querySelector(".saveMsg");
      if (!note) { msg(sm, "Write a note first.", false); return; }
      var r = await sb.from("project_updates").insert({ project_id: p.id, update_date: date, note: note });
      if (r.error) { msg(sm, r.error.message, false); return; }
      await sb.from("projects").update({ updated_at: new Date().toISOString() }).eq("id", p.id);
      loadProjects();
    });
    el.querySelector(".del").addEventListener("click", async function () {
      if (!confirm("Delete project " + p.id + " and all its updates?")) return;
      var r = await sb.from("projects").delete().eq("id", p.id);
      if (r.error) { msg(el.querySelector(".saveMsg"), r.error.message, false); return; }
      loadProjects();
    });
    function copyLink(e) {
      var l = e.currentTarget.getAttribute("data-link");
      navigator.clipboard.writeText(l).then(function () { e.currentTarget.textContent = "Copied!"; setTimeout(function () { e.currentTarget.textContent = "Copy client link"; }, 1800); });
    }
    el.querySelector(".copy").addEventListener("click", copyLink);
    el.querySelector(".open").addEventListener("click", function (e) { window.open(e.currentTarget.getAttribute("data-link"), "_blank"); });
    return el;
  }

  boot();
})();
