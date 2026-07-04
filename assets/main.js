(() => {
  "use strict";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky nav ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScrollNav, {passive:true});
  onScrollNav();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const setMenu = open => {
    burger.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- hero slider (home page only) ---------- */
  const slides = [...document.querySelectorAll(".hero .slide")];
  const dotsBox = document.getElementById("heroDots");
  if (slides.length && dotsBox) {
    let cur = 0, timer = null;
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", () => go(i, true));
      dotsBox.appendChild(d);
    });
    const dots = [...dotsBox.children];
    function go(i, manual) {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === cur));
      dots.forEach((d, k) => d.classList.toggle("active", k === cur));
      if (manual) restart();
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go(cur + 1), 6500);
    }
    document.getElementById("prevSlide").addEventListener("click", () => go(cur - 1, true));
    document.getElementById("nextSlide").addEventListener("click", () => go(cur + 1, true));
    let tx = null;
    const hero = document.getElementById("hero");
    hero.addEventListener("touchstart", e => tx = e.touches[0].clientX, {passive:true});
    hero.addEventListener("touchend", e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1), true);
      tx = null;
    }, {passive:true});
    restart();
  }

  /* ---------- marquee: duplicate content for seamless loop ---------- */
  const track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, {threshold:.14, rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  // safety net: very fast scrolling can jump past the observer — reveal
  // anything already at or above the viewport on each scroll tick
  let revealTick = false;
  addEventListener("scroll", () => {
    if (revealTick) return;
    revealTick = true;
    requestAnimationFrame(() => {
      revealTick = false;
      document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight - 20) {
          el.classList.add("visible");
          io.unobserve(el);
        }
      });
    });
  }, {passive:true});

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target, to = +el.dataset.to, t0 = performance.now(), dur = 1600;
      if (reduceMotion) { el.textContent = to; return; }
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, {threshold:.6});
  document.querySelectorAll(".count").forEach(el => cio.observe(el));

  /* ---------- testimonials slider ---------- */
  const tSlides = [...document.querySelectorAll(".testi-slide")];
  const tDots = document.getElementById("testiDots");
  if (tSlides.length && tDots) {
    let tCur = 0, tTimer = null;
    tSlides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Review " + (i + 1));
      d.addEventListener("click", () => { tGo(i); tRestart(); });
      tDots.appendChild(d);
    });
    function tGo(i) {
      tCur = (i + tSlides.length) % tSlides.length;
      tSlides.forEach((s, k) => s.classList.toggle("active", k === tCur));
      [...tDots.children].forEach((d, k) => d.classList.toggle("active", k === tCur));
    }
    function tRestart() {
      clearInterval(tTimer);
      if (!reduceMotion) tTimer = setInterval(() => tGo(tCur + 1), 7000);
    }
    tRestart();
  }

  /* ---------- gallery lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const closeLb = () => {
    if (!lb) return;
    lb.classList.remove("open"); document.body.style.overflow = "";
  };
  if (lb && lbImg) {
    document.querySelectorAll(".gal-item img").forEach(img => {
      img.parentElement.addEventListener("click", () => {
        lbImg.src = img.src; lbImg.alt = img.alt;
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lb.addEventListener("click", e => { if (e.target !== lbImg) closeLb(); });
    document.getElementById("lightboxClose").addEventListener("click", closeLb);
  }
  addEventListener("keydown", e => { if (e.key === "Escape") { closeLb(); setMenu(false); } });

  /* ---------- quote forms -> mailto ---------- */
  document.querySelectorAll(".quote-form").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    const v = n => form.elements[n] ? form.elements[n].value : "";
    const body = [
      "Name: " + v("name"),
      "Phone: " + v("phone"),
      "Email: " + v("email"),
      "Service: " + v("service"),
      "", v("message")
    ].join("\n");
    location.href = "mailto:Coastlinetints@coastlinetints.com"
      + "?subject=" + encodeURIComponent("Quote request — " + v("service"))
      + "&body=" + encodeURIComponent(body);
  }));

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- highlight current page in nav ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const target = (a.getAttribute("href") || "").split("#")[0];
    if (target && target === here) a.classList.add("active");
  });

  /* ---------- reactive particle background ---------- */
  if (!reduceMotion) {
    const canvas = document.querySelector("#bgfx canvas");
    const ctx = canvas.getContext("2d");
    let W, H, parts = [];
    const mouse = {x:-9999, y:-9999};
    let scrollV = 0, lastY = scrollY;
    const DPR = Math.min(devicePixelRatio || 1, 2);

    function resize() {
      W = innerWidth; H = innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.min(90, Math.round(W * H / 22000));
      parts = Array.from({length:n}, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.8 + .6,
        a: Math.random() * .5 + .15
      }));
    }
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, {passive:true});
    addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
    addEventListener("scroll", () => {
      scrollV += (scrollY - lastY) * .02;
      lastY = scrollY;
    }, {passive:true});

    (function frame() {
      ctx.clearRect(0, 0, W, H);
      scrollV *= .92;
      for (const p of parts) {
        // gentle drift + scroll push
        p.x += p.vx; p.y += p.vy - scrollV * .5;
        // mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16900) {
          const d = Math.sqrt(d2) || 1, f = (130 - d) / 130 * .9;
          p.x += dx / d * f; p.y += dy / d * f;
        }
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }
      // connective lines
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 13000) {
            ctx.strokeStyle = "rgba(47,180,220," + (0.10 * (1 - d2 / 13000)).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        ctx.fillStyle = "rgba(120,215,235," + p.a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      requestAnimationFrame(frame);
    })();
  }
})();
