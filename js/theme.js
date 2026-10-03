/* ==================================================================
   theme.js: light / dark switch.
   Follows the visitor's system theme until they press the switch;
   after that their choice is remembered in the browser.
   ================================================================== */

const themeBtn   = $("#theme");
const systemDark = matchMedia("(prefers-color-scheme: dark)");

// The theme that is showing right now: "dark" or "light"
const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

// Update the switch (knob position, icon, accessibility label) to match the theme
function paintSwitch() {
  const dark = currentTheme() === "dark";
  themeBtn.dataset.mode = currentTheme();
  $(".knob", themeBtn).innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

// Apply a previously saved choice (if the browser allows storage)
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (e) { /* storage blocked: ignore */ }

// Pressing the switch flips the theme and saves it
themeBtn.addEventListener("click", () => {
  root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  paintSwitch();
});

// If the system theme changes while the page is open, refresh the switch
systemDark.addEventListener("change", paintSwitch);
paintSwitch();
