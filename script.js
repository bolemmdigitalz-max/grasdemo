/* ==========================================================
   GRÄS RESTAURANT LAGOS — script.js
   Pure vanilla JavaScript. No frameworks. No libraries.
   ========================================================== */

(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return document.querySelectorAll(s); };

  /* ===== Navbar scroll effect ===== */
  var nav = $(".gras-nav");
  window.addEventListener("scroll", function () {
    if (!nav) return;
    if (window.scrollY > 60) { nav.classList.add("nav-scrolled"); }
    else { nav.classList.remove("nav-scrolled"); }
  });

  /* ===== Mobile menu ===== */
  var menuBtn = $(".mobile-menu-btn");
  var closeBtn = $(".mobile-close-btn");
  var mob = $(".mobile-menu");
  var closeMob = function () {
    mob && mob.classList.remove("active");
    document.body.style.overflow = "";
  };
  menuBtn && menuBtn.addEventListener("click", function () {
    mob && mob.classList.add("active");
    document.body.style.overflow = "hidden";
  });
  closeBtn && closeBtn.addEventListener("click", closeMob);
  $$(".mobile-menu a").forEach(function (l) {
    l.addEventListener("click", closeMob);
  });

  /* ===== Scroll reveal (IntersectionObserver) ===== */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        el.style.transitionDelay = (el.dataset.delay || "0") + "ms";
        el.classList.add("revealed");
      }
    });
  }, { threshold: 0.12 });
  $$("[data-reveal]").forEach(function (el) { revObs.observe(el); });

  /* ===== Stagger children ===== */
  var stagObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll("[data-stagger-child]").forEach(function (c, i) {
          c.style.transitionDelay = i * 80 + "ms";
          c.classList.add("revealed");
        });
      }
    });
  }, { threshold: 0.08 });
  $$("[data-stagger]").forEach(function (el) { stagObs.observe(el); });

  /* ===== Counter animation ===== */
  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var tgt = parseFloat(el.dataset.count || "0");
        var dec = tgt % 1 !== 0;
        var cur = 0;
        var step = tgt / 60;
        var t = setInterval(function () {
          cur += step;
          if (cur >= tgt) { cur = tgt; clearInterval(t); }
          el.textContent = dec ? cur.toFixed(1) : Math.floor(cur).toString();
        }, 20);
        cntObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) { cntObs.observe(el); });

  /* ===== Menu tabs ===== */
  var tabs = $$(".menu-tab-btn");
  var panels = $$(".menu-panel");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tg = btn.dataset.tab;
      tabs.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      panels.forEach(function (p) {
        if (p.dataset.panel === tg) {
          p.classList.add("active");
          p.querySelectorAll(".menu-item").forEach(function (it, i) {
            it.style.opacity = "0";
            it.style.transform = "translateY(18px)";
            setTimeout(function () {
              it.style.transition = "all .45s cubic-bezier(.22,1,.36,1)";
              it.style.opacity = "1";
              it.style.transform = "translateY(0)";
            }, i * 70);
          });
        } else {
          p.classList.remove("active");
        }
      });
    });
  });
  /* Animate first panel items on load */
  var fp = $(".menu-panel.active");
  if (fp) {
    fp.querySelectorAll(".menu-item").forEach(function (it, i) {
      setTimeout(function () {
        it.style.transition = "all .45s cubic-bezier(.22,1,.36,1)";
        it.style.opacity = "1";
        it.style.transform = "translateY(0)";
      }, i * 70 + 300);
    });
  }

  /* ===== Testimonial carousel ===== */
  var slides = $$(".testimonial-slide");
  var dots = $$(".testi-dot");
  var cur = 0;
  var timer;
  var go = function (i) {
    slides.forEach(function (s) { s.classList.remove("active"); });
    dots.forEach(function (d) { d.classList.remove("active"); });
    if (slides[i]) slides[i].classList.add("active");
    if (dots[i]) dots[i].classList.add("active");
    cur = i;
  };
  var next = function () { go((cur + 1) % slides.length); };
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      go(i);
      clearInterval(timer);
      timer = setInterval(next, 6000);
    });
  });
  timer = setInterval(next, 6000);

  /* ===== Gallery lightbox ===== */
  var lb = $(".lightbox");
  var lbi = $(".lightbox img");
  var lbc = $(".lightbox-close");
  var closeLb = function () {
    lb && lb.classList.remove("active");
    document.body.style.overflow = "";
  };
  $$(".gallery-item").forEach(function (it) {
    it.addEventListener("click", function () {
      var im = it.querySelector("img");
      if (im && lbi && lb) {
        lbi.src = im.src;
        lb.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });
  lbc && lbc.addEventListener("click", closeLb);
  lb && lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });

  /* ===== Smooth scroll ===== */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var h = a.getAttribute("href");
      if (!h) return;
      var t = document.querySelector(h);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ===== Scroll to top ===== */
  var stb = $(".scroll-top");
  stb && stb.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===== Parallax hero ===== */
  var hImg = $(".hero-bg-img");
  window.addEventListener("scroll", function () {
    if (hImg && window.scrollY < window.innerHeight) {
      hImg.style.transform = "scale(1.1) translateY(" + window.scrollY * 0.3 + "px)";
    }
  });

  /* ===== Hero entrance sequence ===== */
  setTimeout(function () { var e = $(".hero-tag"); e && e.classList.add("revealed"); }, 400);
  setTimeout(function () { var e = $(".hero-title"); e && e.classList.add("revealed"); }, 700);
  setTimeout(function () { var e = $(".hero-line"); e && e.classList.add("revealed"); }, 1100);
  setTimeout(function () { var e = $(".hero-subtitle"); e && e.classList.add("revealed"); }, 1300);
  setTimeout(function () { var e = $(".hero-address"); e && e.classList.add("revealed"); }, 1600);
  setTimeout(function () { var e = $(".hero-buttons"); e && e.classList.add("revealed"); }, 1800);
  setTimeout(function () { var e = $(".hero-scroll"); e && e.classList.add("revealed"); }, 2400);
  setTimeout(function () {
    var e = $(".hero-side-left"); e && e.classList.add("revealed");
    var f = $(".hero-side-right"); f && f.classList.add("revealed");
  }, 2000);

  /* Navbar entrance */
  setTimeout(function () { nav && nav.classList.add("nav-entered"); }, 100);
})();
