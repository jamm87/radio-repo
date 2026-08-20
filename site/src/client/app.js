// app.js — comportamiento comun a todas las paginas: tema claro/oscuro y
// tinte de color, ambos persistentes. El tema ya se aplica en el <head> para
// que no haya parpadeo; aqui solo se gestionan los controles.

(function () {
  var root = document.documentElement;
  var STORE_THEME = "radio-theme";
  var STORE_TINT = "radio-tint";

  function currentTheme() {
    return root.classList.contains("theme-light") ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add("theme-" + theme);
    try {
      localStorage.setItem(STORE_THEME, theme);
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("radio:theme", { detail: { theme: theme } }));
  }

  function currentTint() {
    var found = "";
    root.classList.forEach(function (name) {
      if (name.indexOf("tint-") === 0) found = name.slice(5);
    });
    return found;
  }

  function applyTint(tint) {
    root.classList.forEach(function (name) {
      if (name.indexOf("tint-") === 0) root.classList.remove(name);
    });
    if (tint) root.classList.add("tint-" + tint);
    try {
      if (tint) localStorage.setItem(STORE_TINT, tint);
      else localStorage.removeItem(STORE_TINT);
    } catch (e) {}
    syncSwatches();
    document.dispatchEvent(new CustomEvent("radio:theme", { detail: { theme: currentTheme() } }));
  }

  function syncSwatches() {
    var tint = currentTint();
    document.querySelectorAll(".tint-swatch").forEach(function (el) {
      el.setAttribute("aria-pressed", String((el.dataset.tint || "") === tint));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        applyTheme(currentTheme() === "light" ? "dark" : "light");
      });
    }

    document.querySelectorAll(".tint-swatch").forEach(function (el) {
      el.addEventListener("click", function () {
        applyTint(el.dataset.tint || "");
      });
    });

    syncSwatches();

    // El indice lateral se sirve abierto (fallo seguro sin JS); en pantallas
    // estrechas se pliega para no empujar al contenido.
    var railIndex = document.getElementById("railIndex");
    if (railIndex && window.innerWidth < 1024) railIndex.open = false;

    // Sin eleccion explicita guardada, el tema sigue al sistema en vivo.
    var media = window.matchMedia("(prefers-color-scheme: light)");
    var onChange = function (event) {
      var stored = null;
      try {
        stored = localStorage.getItem(STORE_THEME);
      } catch (e) {}
      if (stored === "light" || stored === "dark") return;
      root.classList.remove("theme-light", "theme-dark");
      root.classList.add(event.matches ? "theme-light" : "theme-dark");
      document.dispatchEvent(new CustomEvent("radio:theme", { detail: { theme: currentTheme() } }));
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  });

  window.RADIO = window.RADIO || {};
  window.RADIO.currentTheme = currentTheme;
})();
