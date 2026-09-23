/* =========================================================
   Stackly — shared behaviour (loaded on every page)
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- inline SVG icon set ---------- */
  const ICONS = {
    paw: '<ellipse cx="5.5" cy="11" rx="2.2" ry="3"/><ellipse cx="9.5" cy="5.6" rx="2.2" ry="3"/><ellipse cx="14.5" cy="5.6" rx="2.2" ry="3"/><ellipse cx="18.5" cy="11" rx="2.2" ry="3"/><path d="M12 11.5c-3.2 0-6 3.6-6 6.3 0 1.9 1.6 2.9 3.3 2.9 1.2 0 1.8-.5 2.7-.5s1.5.5 2.7.5c1.7 0 3.3-1 3.3-2.9 0-2.7-2.8-6.3-6-6.3z"/>',
    heart:
      '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    users:
      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock:
      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    arrow:
      '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    up: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff:
      '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    camera:
      '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    award:
      '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    search:
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    card: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    drop: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><line x1="8" y1="21" x2="16" y2="21"/><path d="M8 7c0-1.5 1-1.5 1-3M12 7c0-1.5 1-1.5 1-3M16 7c0-1.5 1-1.5 1-3"/>',
    med: '<rect x="3" y="3" width="18" height="18" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    truck:
      '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    sparkle:
      '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/><path d="M19 3v4M17 5h4"/>',
    facebook:
      '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram:
      '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    twitter:
      '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>',
    youtube:
      '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
  };
  const icon = (n, cls = "") => {
    const p = ICONS[n] || ICONS.paw;
    return n === "paw"
      ? `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${p}</svg>`
      : `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  };
  const paintIcons = (root = document) =>
    $$("i[data-i]", root).forEach((el) => {
      el.outerHTML = icon(el.dataset.i, el.className);
    });

  /* ---------- image fallback (if an Unsplash URL is unreachable) ---------- */
  const FB =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF7A2F">' +
        ICONS.paw +
        "</svg>",
    );
  const fixImg = (img) => {
    if (img.dataset.fx) return;
    img.dataset.fx = 1;
    const bad = () => {
      if (img.src === FB) return;
      img.src = FB;
      img.classList.add("img-fallback");
    };
    img.addEventListener("error", bad);
    if (
      img.loading !== "lazy" &&
      img.complete &&
      img.naturalWidth === 0 &&
      img.getAttribute("src")
    )
      bad();
  };
  const fixImages = (root = document) => $$("img", root).forEach(fixImg);

  /* ---------- session (demo only — stored in the browser) ---------- */
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("pp_user") || "null");
    } catch (e) {
      return null;
    }
  };
  const setUser = (u) => {
    try {
      u
        ? localStorage.setItem("pp_user", JSON.stringify(u))
        : localStorage.removeItem("pp_user");
    } catch (e) {
      /* storage blocked */
    }
  };

  /* ---------- inject header + drawer ---------- */
  const NAV = [
    ["home", "index.html", "Home", "home"],
    ["about", "about.html", "About", "info"],
    ["animals", "animals.html", "Adopt", "paw"],
    ["donate", "donate.html", "Donate", "heart"],
    ["volunteer", "volunteer.html", "Volunteer", "users"],
  ];
  const page = document.body.dataset.page || "home";
  const user = getUser();
  const loginBtn = (cls = "") =>
    user
      ? `<button type="button" class="btn btn-login ${cls}" data-logout title="Signed in as ${user.name} (${user.role}) — click to log out">${icon("user")}Logout</button>`
      : `<a class="btn btn-login ${cls}" href="login.html">${icon("user")}Login</a>`;

  const headHost = $("#site-header");
  if (headHost) {
    headHost.innerHTML = `
    <header class="hdr" id="hdr">

      <a class="logo" href="index.html" aria-label="Stackly — home">
        <img src="/images/logo.webp" alt="Stackly">
      </a>
      
      <nav class="nav" aria-label="Main navigation">
        ${NAV.map((n) => `<a href="${n[1]}" class="${n[0] === page ? "active" : ""}">${n[2]}</a>`).join("")}
      </nav>
      <div class="hdr-actions">
        ${loginBtn()}
        <button class="toggle" id="toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      </div>
    </header>
    <div class="drawer-ov" id="ov"></div>
    <aside class="drawer" id="drawer" aria-label="Mobile menu" aria-hidden="true">
      <div class="drawer-top">
        <a class="logo" href="index.html" aria-label="Stackly — home"><span class="logo-mark">${icon("paw")}</span></a>
        <button class="drawer-close" id="dclose" type="button" aria-label="Close menu">${icon("x")}</button>
      </div>
      <nav aria-label="Mobile navigation">
        ${NAV.map((n, i) => `<a href="${n[1]}" style="--i:${i}" class="${n[0] === page ? "active" : ""}">${icon(n[3])}${n[2]}</a>`).join("")}
      </nav>
      <div class="drawer-foot">
        ${loginBtn("btn-lg")}
        <small>Every rupee is tracked.<br>Every paw is counted.</small>
      </div>
    </aside>`;
  }

  /* ---------- inject footer ---------- */
  const footHost = $("#site-footer");
  if (footHost) {
    footHost.innerHTML = `
    <footer class="ftr">
      <div class="wrap">
        <div class="ftr-grid">
          <div>
            <a class="logo" href="index.html" aria-label="Stackly — home">
              <img src="images/logo.webp" alt="Stackly">
            </a>
            <p style="margin-top:16px;max-width:38ch">A donation portal that turns kindness into rescues, surgeries, meals and forever homes — with every gift traced from your screen to the shelter floor.</p>
            <form class="ftr-news" id="nl-form" novalidate>
              <input type="email" id="nl-email" placeholder="Your email for rescue updates" aria-label="Email address">
              <button class="btn btn-sun btn-sm" type="submit">Subscribe</button>
            </form>
            <div class="ftr-soc">
              <a href="#" aria-label="Instagram">${icon("instagram")}</a>
              <a href="#" aria-label="Facebook">${icon("facebook")}</a>
              <a href="#" aria-label="Twitter">${icon("twitter")}</a>
              <a href="#" aria-label="YouTube">${icon("youtube")}</a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>${NAV.map((n) => `<li><a href="${n[1]}">${n[2]}</a></li>`).join("")}<li><a href="login.html">Login</a></li></ul>
          </div>
          <div>
            <h4>Get involved</h4>
            <ul>
              <li><a href="donate.html#plans">Become a monthly guardian</a></li>
              <li><a href="animals.html#urgent">Fund an urgent surgery</a></li>
              <li><a href="animals.html#browse">Adopt a companion</a></li>
              <li><a href="volunteer.html#apply">Volunteer with us</a></li>
              <li><a href="about.html#faq">Read our FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Reach the shelter</h4>
            <ul class="ftr-contact">
              <li>${icon("pin")}<span>21 Banyan Lane, Green Park,<br>Rescue Campus, 636001</span></li>
              <li>${icon("phone")}<span>+91 90000 12345</span></li>
              <li>${icon("mail")}<span>hello@Stackly.org</span></li>
              <li>${icon("clock")}<span>Open daily, 9 AM – 6 PM</span></li>
            </ul>
          </div>
        </div>
        <div class="ftr-mark" aria-hidden="true">Stackly</div>
        <div class="ftr-bot"><span>© 2026 Stackly Animal Welfare Trust. Demo website — sample content.</span><span>Made with care for every paw.</span></div>
      </div>
    </footer>`;
  }
  paintIcons();

  /* ---------- floating paws + progress + loader + to-top ---------- */
  const pf = document.createElement("div");
  pf.className = "paw-float";
  pf.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.innerHTML = icon("paw");
    const svg = s.firstChild;
    svg.style.cssText = `left:${(i * 8.7 + 3) % 100}%;--s:${22 + ((i * 7) % 30)}px;--t:${20 + ((i * 5) % 16)}s;--dl:${-i * 2.3}s;--r:${(i % 2 ? 1 : -1) * (30 + i * 6)}deg`;
    pf.appendChild(svg);
  }
  document.body.appendChild(pf);

  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);
  const toTop = document.createElement("button");
  toTop.className = "totop";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = icon("paw");
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  document.body.appendChild(toTop);

  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="loader-in"><div class="loader-track">${icon("paw").repeat(5)}</div><b>Stackly</b><small>Following the paw prints…</small></div>`;
  document.body.prepend(loader);

  const readyCbs = [];
  let isReady = false;
  const ready = (fn) => (isReady ? fn() : readyCbs.push(fn));
  const finishLoad = () => {
    loader.classList.add("done");
    setTimeout(() => {
      isReady = true;
      initReveal();
      initCounters();
      readyCbs.splice(0).forEach((f) => f());
    }, 450);
    setTimeout(() => loader.remove(), 1000);
  };
  setTimeout(finishLoad, reduce ? 50 : 1100);

  /* ---------- scroll handlers ---------- */
  const hdr = $("#hdr");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY,
      h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    hdr && hdr.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 700);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  /* ---------- drawer ---------- */
  const drawer = $("#drawer"),
    ov = $("#ov"),
    toggle = $("#toggle"),
    dclose = $("#dclose");
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    ov.classList.toggle("open", open);
    document.body.classList.toggle("lock", open);
    toggle.setAttribute("aria-expanded", open);
    drawer.setAttribute("aria-hidden", !open);
  };
  toggle && toggle.addEventListener("click", () => setDrawer(true));
  dclose && dclose.addEventListener("click", () => setDrawer(false));
  ov && ov.addEventListener("click", () => setDrawer(false));
  drawer &&
    $$("a", drawer).forEach((a) =>
      a.addEventListener("click", () => setDrawer(false)),
    );
  window.addEventListener("resize", () => {
    if (innerWidth > 991) setDrawer(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  /* ---------- logout ---------- */
  $$("[data-logout]").forEach((b) =>
    b.addEventListener("click", () => {
      if (confirm("Log out of Stackly?")) {
        setUser(null);
        location.reload();
      }
    }),
  );

  /* ---------- reveal on scroll ---------- */
  function splitWords(el) {
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span");
            w.className = "w";
            const wi = document.createElement("span");
            wi.className = "wi";
            wi.style.setProperty("--wi", n++);
            wi.textContent = t;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(el);
    el.classList.add("split-t");
  }
  $$("[data-split]").forEach(splitWords);

  function observe(els, cb, opts) {
    const list = els instanceof Element ? [els] : Array.from(els);
    if (!("IntersectionObserver" in window)) {
      list.forEach(cb);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            cb(en.target);
            io.unobserve(en.target);
          }
        }),
      Object.assign({ threshold: 0.14, rootMargin: "0px 0px -6% 0px" }, opts),
    );
    list.forEach((el) => io.observe(el));
  }
  function initReveal() {
    observe($$(".rv,.rv-l,.rv-r,.rv-z,.rv-s,.split-t"), (el) => {
      el.classList.add("in");
      const d = parseFloat(el.style.getPropertyValue("--d")) || 0;
      setTimeout(() => el.classList.add("done"), (d + 1.05) * 1000);
    });
  }

  /* ---------- counters ---------- */
  function countTo(el) {
    const end = parseFloat(el.dataset.count),
      dec = +(el.dataset.dec || 0),
      pre = el.dataset.prefix || "",
      suf = el.dataset.suffix || "";
    const dur = reduce ? 1 : 1900,
      t0 = performance.now();
    const fmt = (v) =>
      pre +
      v.toLocaleString("en-IN", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }) +
      suf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1),
        e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = fmt(end * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function initCounters() {
    observe($$("[data-count]"), countTo, { threshold: 0.4 });
  }

  /* ---------- ripple, magnetic, tilt ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn");
    if (!b) return;
    const r = b.getBoundingClientRect(),
      d = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 750);
  });
  if (finePointer && !reduce) {
    $$(".mag").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }
  function bindTilt(root = document) {
    if (!finePointer || reduce) return;
    $$("[data-tilt]", root).forEach((el) => {
      if (el.dataset.tb) return;
      el.dataset.tb = 1;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .12s linear";
        el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateY(-6px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "";
      });
    });
  }
  bindTilt();

  /* ---------- accordion ---------- */
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".acc-q");
    if (!q) return;
    const item = q.parentElement,
      acc = item.parentElement,
      open = item.classList.contains("open");
    $$(".acc-item.open", acc).forEach((i) => {
      i.classList.remove("open");
      $(".acc-q", i).setAttribute("aria-expanded", "false");
    });
    if (!open) {
      item.classList.add("open");
      q.setAttribute("aria-expanded", "true");
    }
  });

  /* ---------- toast + burst + paw trail ---------- */
  const toastBox = document.createElement("div");
  toastBox.className = "toasts";
  toastBox.setAttribute("aria-live", "polite");
  document.body.appendChild(toastBox);
  function toast(msg, ic = "check") {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = icon(ic) + "<span>" + msg + "</span>";
    toastBox.appendChild(t);
    setTimeout(() => {
      t.classList.add("out");
      setTimeout(() => t.remove(), 450);
    }, 3600);
  }
  function burst(x, y, chars = ["🐾", "❤️", "⭐", "🐶", "🐱"], n = 18) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "burst";
      b.textContent = chars[i % chars.length];
      const a = Math.random() * Math.PI * 2,
        d = 70 + Math.random() * 150;
      b.style.cssText = `left:${x}px;top:${y}px;--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d - 40}px;--r:${(Math.random() - 0.5) * 200}deg;font-size:${16 + Math.random() * 16}px`;
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 1300);
    }
  }
  if (finePointer && !reduce) {
    let lx = 0,
      ly = 0,
      side = 1;
    window.addEventListener(
      "mousemove",
      (e) => {
        const dx = e.clientX - lx,
          dy = e.clientY - ly;
        if (Math.hypot(dx, dy) < 90) return;
        const ang = Math.atan2(dy, dx),
          nx = -Math.sin(ang) * 12 * side,
          ny = Math.cos(ang) * 12 * side;
        side *= -1;
        lx = e.clientX;
        ly = e.clientY;
        const p = document.createElement("span");
        p.className = "trail";
        p.innerHTML = icon("paw");
        p.style.cssText = `left:${e.clientX + nx}px;top:${e.clientY + ny}px;--r:${(ang * 180) / Math.PI + 90}deg`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1500);
      },
      { passive: true },
    );
  }

  /* ---------- newsletter ---------- */
  const nl = $("#nl-form");
  nl &&
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("#nl-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        toast("Enter a valid email address to subscribe.", "mail");
        return;
      }
      toast("Subscribed! Rescue stories are on their way.", "heart");
      nl.reset();
      const r = nl.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top);
    });

  fixImages();
  window.addEventListener("load", () => fixImages());

  /* ---------- public API for page scripts ---------- */
  window.PP = {
    $,
    $$,
    icon,
    paintIcons,
    fixImages,
    observe,
    ready,
    toast,
    burst,
    bindTilt,
    getUser,
    setUser,
    reduce,
    finePointer,
  };
})();
