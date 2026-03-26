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

// Close hamburger when user clicks/touches outside the menu
function setupCloseHamburgerOnOutsideClick(){
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  function closeMenu(){
    if (navLinks.classList.contains('open')){
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }

  // click outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  });

  // touchstart for mobile
  document.addEventListener('touchstart', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  }, { passive: true });
}

function markActiveLink(){
  const here = location.pathname.split("/").pop() || "index.html";
  $all(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

// /more+ behaviour removed

function setYear(){
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupThemeToggle();
  markActiveLink();
  setYear();
  setupCloseHamburgerOnOutsideClick();
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', () => {
        item.classList.toggle('active'); // Toggle für "active" Klasse
      });
});

// === Folge Reader: Rail & Lesezeichen ===
(function() {
  const rail   = document.getElementById('folRail');
  const cursor = document.getElementById('folCursor');
  if (!rail || !cursor) return;

  const chapEls = Array.from(document.querySelectorAll('.folge-content h2'));
  const nSegs   = chapEls.length;
  if (!nSegs) return;
  chapEls.forEach(function(el, i) { el.id = 'fol-ch-' + i; });

  const GAP = 3;
  const BM_KEY = 'bh_bookmarks_' + window.location.pathname;
  let bookmarks = JSON.parse(localStorage.getItem(BM_KEY) || '[]');
  let segHeights = [];  // proportional heights, rebuilt on buildSegs()

  function saveBookmarks() {
    localStorage.setItem(BM_KEY, JSON.stringify(bookmarks));
  }

  function getScrollPct() {
    var maxS = document.documentElement.scrollHeight - window.innerHeight;
    return maxS > 0 ? Math.min(1, Math.max(0, window.scrollY / maxS)) : 0;
  }

  function getRailH() { return rail.clientHeight; }

  function absTop(el) {
    var t = 0;
    while (el) { t += el.offsetTop; el = el.offsetParent; }
    return t;
  }

  function buildSegs() {
    rail.querySelectorAll('.fol-seg').forEach(function(s) { s.remove(); });
    segHeights = [];

    var railH   = getRailH();
    var content = document.querySelector('.folge-content');

    // Offsets of each chapter heading, plus the bottom of .folge-content
    var offsets = chapEls.map(absTop);
    offsets.push(absTop(content) + content.offsetHeight);

    var totalH  = offsets[offsets.length - 1] - offsets[0];
    var usableH = railH - (nSegs - 1) * GAP;

    var topPos = 0;
    for (var i = 0; i < nSegs; i++) {
      var chapH = offsets[i + 1] - offsets[i];
      var segH  = Math.max(4, (chapH / totalH) * usableH);
      segHeights.push(segH);

      var seg = document.createElement('div');
      seg.className    = 'fol-seg';
      seg.style.top    = topPos + 'px';
      seg.style.height = segH + 'px';
      rail.insertBefore(seg, cursor);
      topPos += segH + GAP;
    }
  }

  function updateRail() {
    var railH     = getRailH();
    var curPct    = getScrollPct();
    var cursorRel = curPct * railH;

    var topPos = 0;
    rail.querySelectorAll('.fol-seg').forEach(function(seg, i) {
      var segH     = segHeights[i] || 0;
      var segStart = topPos;
      var segEnd   = topPos + segH;
      topPos       = segEnd + GAP;

      var fillPct;
      if      (cursorRel >= segEnd)    fillPct = 100;
      else if (cursorRel <= segStart)  fillPct = 0;
      else fillPct = ((cursorRel - segStart) / segH) * 100;

      if (fillPct <= 0)
        seg.style.background = 'var(--rail-empty, #1e2130)';
      else if (fillPct >= 100)
        seg.style.background = '#0965EF';
      else
        seg.style.background =
          'linear-gradient(180deg, #0965EF ' + fillPct + '%, var(--rail-empty, #1e2130) ' + fillPct + '%)';
    });

    cursor.style.top = (curPct * railH) + 'px';
    renderMarkers(curPct, railH);
    updateButtons(curPct);
  }

  function renderMarkers(curPct, railH) {
    rail.querySelectorAll('.fol-bm-marker').forEach(function(m) { m.remove(); });

    bookmarks.forEach(function(b) {
      var isActive = Math.abs(b - curPct) < 0.035;
      var m = document.createElement('div');
      m.className = 'fol-bm-marker' + (isActive ? ' active' : '');
      m.style.top = (b * railH) + 'px';
      if (isActive) {
        m.innerHTML = '<svg viewBox="0 0 12 14" width="15" height="20"><path d="M1 1h10v12l-5-3.5L1 13V1z" fill="#1a1400"/></svg>';
      }
      (function(target) {
        m.addEventListener('click', function() {
          var maxS = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: Math.round(target * maxS), behavior: 'smooth' });
        });
      })(b);
      rail.appendChild(m);
    });
  }

  function updateButtons(curPct) {
    var hasHere = bookmarks.some(function(b) { return Math.abs(b - curPct) < 0.025; });
    var hasPrev = bookmarks.some(function(b) { return b < curPct - 0.025; });
    var hasNext = bookmarks.some(function(b) { return b > curPct + 0.025; });
    var btnSet  = document.getElementById('folBmSet');
    var btnDel  = document.getElementById('folBmDel');
    var btnPrev = document.getElementById('folBmPrev');
    var btnNext = document.getElementById('folBmNext');
    if (btnSet)  btnSet.disabled  = hasHere;
    if (btnDel)  btnDel.disabled  = !hasHere;
    if (btnPrev) btnPrev.disabled = !hasPrev;
    if (btnNext) btnNext.disabled = !hasNext;
  }

  function showToast(msg) {
    var t = document.getElementById('folToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._folTimer);
    t._folTimer = setTimeout(function() { t.classList.remove('show'); }, 2000);
  }

  var btnSet  = document.getElementById('folBmSet');
  var btnDel  = document.getElementById('folBmDel');
  var btnPrev = document.getElementById('folBmPrev');
  var btnNext = document.getElementById('folBmNext');

  if (btnSet) btnSet.addEventListener('click', function() {
    var pct = getScrollPct();
    if (!bookmarks.some(function(b) { return Math.abs(b - pct) < 0.025; })) {
      bookmarks.push(pct);
      bookmarks.sort(function(a, b) { return a - b; });
      saveBookmarks();
      updateRail();
      showToast('Lesezeichen gesetzt');
    }
  });

  if (btnDel) btnDel.addEventListener('click', function() {
    var pct = getScrollPct();
    bookmarks = bookmarks.filter(function(b) { return Math.abs(b - pct) >= 0.025; });
    saveBookmarks();
    updateRail();
    showToast('Lesezeichen entfernt');
  });

  if (btnPrev) btnPrev.addEventListener('click', function() {
    var pct  = getScrollPct();
    var prev = bookmarks.filter(function(b) { return b < pct - 0.025; });
    if (prev.length) {
      var maxS = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(prev[prev.length - 1] * maxS), behavior: 'smooth' });
    }
  });

  if (btnNext) btnNext.addEventListener('click', function() {
    var pct  = getScrollPct();
    var next = bookmarks.filter(function(b) { return b > pct + 0.025; });
    if (next.length) {
      var maxS = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(next[0] * maxS), behavior: 'smooth' });
    }
  });

  // === Cursor Drag ===
  (function() {
    var dragging = false;

    function pctFromClientY(clientY) {
      var rect = rail.getBoundingClientRect();
      var pct  = (clientY - rect.top) / rect.height;
      return Math.min(1, Math.max(0, pct));
    }

    function scrollToPct(pct) {
      var maxS = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(pct * maxS), behavior: 'instant' });
    }

    cursor.addEventListener('mousedown', function(e) {
      e.preventDefault();
      dragging = true;
      cursor.classList.add('dragging');
    });

    cursor.addEventListener('touchstart', function(e) {
      e.preventDefault();
      dragging = true;
      cursor.classList.add('dragging');
    }, { passive: false });

    window.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      scrollToPct(pctFromClientY(e.clientY));
    });

    window.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      scrollToPct(pctFromClientY(e.touches[0].clientY));
    }, { passive: true });

    window.addEventListener('mouseup', function() {
      if (!dragging) return;
      dragging = false;
      cursor.classList.remove('dragging');
    });

    window.addEventListener('touchend', function() {
      dragging = false;
      cursor.classList.remove('dragging');
    });
  })();

  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', function() { buildSegs(); updateRail(); });
  buildSegs();
  updateRail();
})();