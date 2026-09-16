/* =========================================================
   YOUSAF.AI — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Active section highlight (setup) ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navAnchors
    .map(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navAnchors.forEach(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      a.classList.toggle("active", current && current.id === id);
    });
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    updateActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 3D tilt on cards ---------- */
  var tiltEls = document.querySelectorAll("[data-tilt]");
  var MAX_TILT = 6;

  tiltEls.forEach(function (el) {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (0.5 - py) * MAX_TILT * 2;
      var ry = (px - 0.5) * MAX_TILT * 2;

      el.style.transform =
        "perspective(1200px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(0)";

      var glow = el.querySelector(".skill-card-glow");
      if (glow) {
        glow.style.setProperty("--mx", px * 100 + "%");
        glow.style.setProperty("--my", py * 100 + "%");
      }
    });

    el.addEventListener("mouseleave", function () {
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    });
  });

  /* ---------- Contact form (client-side, mailto handoff) ---------- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "Fill in every field before dispatching.";
        return;
      }

      var subject = encodeURIComponent("Portfolio inquiry from " + name);
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      var mailLink = document.querySelector('.contact-links a[href^="mailto:"]');
      var address = mailLink ? mailLink.getAttribute("href").replace("mailto:", "") : "hello@yousaf.ai";

      window.location.href = "mailto:" + address + "?subject=" + subject + "&body=" + body;
      note.textContent = "Opening your mail client to complete the dispatch…";
    });
  }

  /* =========================================================
     Golden particle field — canvas 2D
     ========================================================= */
  var canvas = document.getElementById("fx-canvas");
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var W, H, DPR;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function countForWidth() {
    if (W < 620) return 26;
    if (W < 1100) return 45;
    return 70;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.18 - 0.02,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function initParticles() {
    var n = countForWidth();
    particles = [];
    for (var i = 0; i < n; i++) particles.push(makeParticle());
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      var a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55," + a.toFixed(3) + ")";
      ctx.shadowColor = "rgba(244,205,82,0.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize();
  initParticles();
  requestAnimationFrame(step);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      initParticles();
    }, 200);
  });
})();
