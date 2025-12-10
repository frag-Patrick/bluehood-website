function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// Theme init (saved or prefers-color-scheme)
(function initTheme(){
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const start = saved ?? (prefersDark ? "dark" : "light");
  applyTheme(start);
})();

function applyTheme(mode){
  document.body.classList.toggle("light-mode", mode === "light");
  const t = $("#theme-toggle");
  if (t){
    const isDark = mode === "dark";
    t.classList.toggle("dark", isDark);
    t.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
}

function setupThemeToggle(){
  const toggle = $("#theme-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const next = document.body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

 // Scroll-Progress-Balken
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = percent + '%';

  const navLinks = $(".nav-links");
  const hamburger = $(".hamburger");
  if (navLinks && hamburger && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  }
});

function setupHamburger(){
  const hamburger = $(".hamburger");
  const navLinks = $(".nav-links");
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("open");
  });
  $all(".nav-links a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  }));
}

function markActiveLink(){
  const here = location.pathname.split("/").pop() || "index.html";
  $all(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

function setYear(){
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupThemeToggle();
  markActiveLink();
  setYear();
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', () => {
        item.classList.toggle('active'); // Toggle für "active" Klasse
      });
});