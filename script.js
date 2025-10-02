const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  // Optional: Schließe Menü beim Klick auf Link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  const toggle = document.getElementById("theme-toggle");

  // Initial: gespeicherte Wahl oder Systemstandard übernehmen
  const saved = localStorage.getItem("theme"); // 'light' | 'dark' | null
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(mode) {
    document.body.classList.toggle("light-mode", mode === "light");
    // Switch-Optik (Sun = light false, Moon = dark true)
    const isDark = mode === "dark";
    toggle.classList.toggle("dark", isDark);
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  const initial = saved ?? (prefersDark ? "dark" : "light");
  applyTheme(initial);

  // Klick schaltet zwischen light/dark
  toggle.addEventListener("click", () => {
    const next = document.body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });