/* ==================================================================
   background.js: animated parallax background.
   Draws small outline shapes (geometry + drafting tools) and soft
   glows across the whole page height. While scrolling, each shape
   moves at its own speed; they also drift slightly with the mouse
   and keep spinning, swaying or floating on their own.
   ================================================================== */

if (SHOW_BACKGROUND_SHAPES) {

  /* ---- 1. The shapes: SVG drawings on a 64 x 64 grid ------------- */
  const SHAPES = {
    circle:     '<circle cx="32" cy="32" r="22"/>',
    triangle:   '<polygon points="32,10 56,52 8,52"/>',
    square:     '<rect x="13" y="13" width="38" height="38" rx="3"/>',
    hexagon:    '<polygon points="32,8 54,20 54,44 32,56 10,44 10,20"/>',
    plus:       '<path d="M32 14v36M14 32h36"/>',
    // Drafting tools
    ruler:      '<rect x="4" y="22" width="56" height="20" rx="2"/><path d="M14 22v8M24 22v5M34 22v8M44 22v5M54 22v8"/>',
    setsquare:  '<polygon points="10,56 10,8 56,56"/><polygon points="20,46 20,29 37,46"/>',
    compass:    '<circle cx="32" cy="9" r="3.5"/><path d="M32 13 17 56M32 13 47 56M24 38h16"/>',
    protractor: '<path d="M5 50A27 27 0 0 1 59 50Z"/><path d="M17 50A15 15 0 0 1 47 50"/><path d="M32 23v5M13 31l3 3M51 31l-3 3"/>'
  };

  /* How each shape keeps moving: spin | sway | float (see background.css) */
  const MOTION = {
    circle: "float", triangle: "spin", square: "spin", hexagon: "spin", plus: "spin",
    ruler: "sway", setsquare: "sway", compass: "sway", protractor: "float"
  };

  /* ---- 2. Helpers ------------------------------------------------ */
  const layer = $("#bg");
  let items = [];            // every moving element: { el, y, speed }
  let mouseX = 0, mouseY = 0, queued = false;

  // Seeded random numbers: the layout is the same on every visit and resize
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---- 3. Build all shapes for the current page height ----------- */
  function build() {
    layer.innerHTML = "";
    items = [];

    const rand  = mulberry32(2026);
    const range = (min, max) => min + rand() * (max - min);
    const pageH = document.documentElement.scrollHeight;
    const small = innerWidth < 640;

    // Soft glows: 4 large blurred circles, alternating left and right
    for (let g = 0; g < 4; g++) {
      const size = small ? 220 : 380;
      const el = document.createElement("div");
      el.className = "bg-glow";
      el.style.cssText = `width:${size}px;height:${size}px;top:${(g + .3) * pageH / 4}px;left:${g % 2 ? "62%" : "-10%"}`;
      layer.appendChild(el);
      items.push({ el, y: (g + .3) * pageH / 4, speed: g % 2 ? -.08 : .1 });
    }

    // Shapes: one per vertical slot so the page is filled evenly
    const count = Math.max(6, Math.min(26, Math.round(pageH / (small ? 520 : 340))));
    const names = Object.keys(SHAPES);
    const slot  = pageH / count;

    for (let i = 0; i < count; i++) {
      const name = names[(i * 4 + Math.floor(rand() * 3)) % names.length];   // varied order
      const size = Math.round(small ? range(26, 42) : range(32, 60));
      const y    = (i + .5) * slot + range(-slot * .3, slot * .3);
      // mostly the left and right edges, now and then the middle
      const x    = i % 3 === 0 ? range(38, 62) : (i % 2 ? range(3, 26) : range(72, 94));
      const speed = (rand() < .5 ? -1 : 1) * range(.06, .22);

      const el = document.createElement("div");
      el.className = `bg-item ${MOTION[name]}`;
      el.style.cssText = `width:${size}px;height:${size}px;top:${y}px;left:${x}%;--dur:${Math.round(range(MOTION[name] === "spin" ? 50 : 7, MOTION[name] === "spin" ? 110 : 13))}s`;
      el.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true">${SHAPES[name]}</svg>`;
      layer.appendChild(el);
      items.push({ el, y, speed });
    }
    update();
  }

  /* ---- 4. Parallax: shift every item by scroll + mouse ----------- */
  function update() {
    queued = false;
    const viewMiddle = scrollY + innerHeight / 2;
    items.forEach(({ el, y, speed }) => {
      // offset is 0 when the item sits in the middle of the screen, and grows as it moves away
      const dy = (viewMiddle - y) * speed + mouseY * speed * 120;
      const dx = mouseX * speed * 120;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
  }
  const requestUpdate = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };

  /* ---- 5. Start and keep up with the page ------------------------ */
  build();
  addEventListener("load", build);                 // page height changes once fonts and icons load
  let resizeTimer;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 250); });

  if (!reduceMotion) {                             // skip movement for people who prefer less motion
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("mousemove", e => {
      mouseX = e.clientX / innerWidth - .5;        // -0.5 (left) to 0.5 (right)
      mouseY = e.clientY / innerHeight - .5;
      requestUpdate();
    }, { passive: true });
  }
}
