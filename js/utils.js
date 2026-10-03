/* ==================================================================
   utils.js: small helpers shared by the other scripts.
   ================================================================== */

// Find one element / find all elements (inside `scope`, default: whole page)
const $  = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// True when the visitor asked their device for less motion
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// The <html> element (the theme is stored on it as data-theme)
const root = document.documentElement;
