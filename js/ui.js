/* ==================================================================
   ui.js: everything interactive except the theme and the background.
   Every feature below works for copy-pasted components too, because
   it looks for classes (.card, .copy ...) instead of single elements.
   ================================================================== */

/* ---- Profile picture: blank icon or profile.jpg ------------------ */
function initProfile() {
  const avatar = $("#avatar");
  const blank = '<i class="fa-solid fa-user"></i>';
  if (!USE_PROFILE_PHOTO) { avatar.innerHTML = blank; return; }

  const img = new Image();
  img.src = "profile.jpg";
  img.alt = "Portrait of Md Shahriyar Kabir Sami";
  img.onerror = () => { avatar.innerHTML = blank; };   // photo missing: fall back to the icon
  avatar.appendChild(img);
}

/* ---- Tagline: typed one letter at a time ------------------------- */
function initTagline() {
  const el = $("#tagline");
  if (!SHOW_TAGLINE) { el.remove(); return; }
  if (reduceMotion)  { el.textContent = TAGLINE; return; }

  let i = 0;
  (function type() {
    el.textContent = TAGLINE.slice(0, ++i);
    if (i < TAGLINE.length) setTimeout(type, 45);
  })();
}

/* ---- Phone menu: the button opens and closes the link list ------- */
function initMenu() {
  const burger = $("#burger"), menu = $("#menu");
  const setOpen = open => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  };
  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  $$("#menu a").forEach(a => a.addEventListener("click", () => setOpen(false)));  // close after choosing
}

/* ---- Highlight the navbar link of the section being read --------- */
function initScrollSpy() {
  const links = $$("#menu a");
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });      // a section counts when it crosses the screen middle
  $$("main section").forEach(section => spy.observe(section));
}

/* ---- Interest cards: select to show or hide the description ------ */
function initCards() {
  document.addEventListener("click", event => {
    const card = event.target.closest(".card");
    if (!card) return;
    const willOpen = card.getAttribute("aria-expanded") !== "true";
    card.setAttribute("aria-expanded", willOpen);
    $(".more", card).hidden = !willOpen;
  });
}

/* ---- Email box: the Copy button copies the address next to it ---- */
function initCopy() {
  document.addEventListener("click", async event => {
    const btn = event.target.closest(".copy");
    if (!btn) return;
    const address = $("a", btn.closest(".mail")).textContent.trim();
    try { await navigator.clipboard.writeText(address); btn.textContent = "Copied!"; }
    catch (err) { btn.textContent = "Press Ctrl+C"; }
    setTimeout(() => { btn.textContent = "Copy"; }, 1800);
  });
}

/* ---- Footer year: always the current year ------------------------ */
function initYear() {
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
}

/* Start everything */
initProfile();
initTagline();
initMenu();
initScrollSpy();
initCards();
initCopy();
initYear();
