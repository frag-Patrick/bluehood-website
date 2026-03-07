// ── NERDIKON – Glossary System ──────────────────────────────────────────────

const NERDIKON = {
  'Cryptojacking': {
    def: 'Jemand benutzt deinen Computer heimlich um Kryptowährung zu schürfen – ohne dein Wissen. Dein PC wird langsam, deine Stromrechnung steigt. Der Angreifer kassiert, du zahlst die Rechnung – buchstäblich.',
    related: ['Malware', 'CPU-Auslastung'],
  },
  'Malware': {
    def: 'Software die Schaden anrichten soll. Oberbegriff für Viren, Trojaner, Ransomware und mehr. Wenn etwas auf deinem Gerät ist, ohne dass du es wolltest – dann ist es Malware.',
    related: ['Cryptojacking', 'Phishing', 'Trojaner'],
  },
  'CPU-Auslastung': {
    def: 'Wie viel Prozent deines Prozessors gerade arbeiten. 100% bedeutet Vollast – das merkst du an Hitze, Lärm und Langsamkeit. Im normalen Leerlauf sind 5–30% völlig okay.',
    related: ['Cryptojacking', 'Malware'],
  },
  'Trojaner': {
    def: 'Software die sich heimlich auf dein Gerät schmuggelt und danach böse Absichten verfolgt. Sie kann Daten stehlen und Schaden anrichten.',
    related: ['Malware', 'Phishing'],
  }
};

// Wrap known NERDIKON terms in text content (not inside HTML tags)
function nerdikonMarkup(html) {
  if (!html || typeof html !== 'string') return html;
  const terms = Object.keys(NERDIKON);
  if (!terms.length) return html;
  // Split by HTML tags — odd indices are tags, even indices are text nodes
  const parts = html.split(/(<[^>]+>)/);
  return parts.map((part, i) => {
    if (i % 2 === 1) return part; // tag — skip
    let out = part;
    for (const term of terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'gi');
      out = out.replace(re, m =>
        `<span class="nerdikon-term" data-term="${term}" tabindex="0" role="button">${m}</span>`
      );
    }
    return out;
  }).join('');
}

// ── NERDIKON Popup ───────────────────────────────────────────────────────────

function injectNerdikonPopup() {
  if (document.getElementById('nerdikonOverlay')) return;
  const el = document.createElement('div');
  el.id = 'nerdikonOverlay';
  el.className = 'nerdikon-overlay';
  el.innerHTML = `
    <div class="nerdikon-popup" id="nerdikonPopup">
      <div class="nerdikon-header">
        <span class="nerdikon-title" id="nerdikonTitle"></span>
        <button class="nerdikon-close" id="nerdikonClose" aria-label="Schließen">✕</button>
      </div>
      <div class="nerdikon-body">
        <p class="nerdikon-def" id="nerdikonDef"></p>
        <div id="nerdikonRelated"></div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  document.getElementById('nerdikonClose').addEventListener('click', closeNerdikon);
  el.addEventListener('click', e => { if (e.target === el) closeNerdikon(); });
}

function openNerdikon(termKey) {
  const key = Object.keys(NERDIKON).find(k => k.toLowerCase() === termKey.toLowerCase());
  const entry = key ? NERDIKON[key] : null;
  const overlay  = document.getElementById('nerdikonOverlay');
  const titleEl  = document.getElementById('nerdikonTitle');
  const defEl    = document.getElementById('nerdikonDef');
  const relatedEl = document.getElementById('nerdikonRelated');

  titleEl.textContent = key || termKey;
  defEl.textContent   = entry ? entry.def : 'Dieser Begriff wird bald erklärt.';
  relatedEl.innerHTML = '';

  if (entry && entry.related && entry.related.length) {
    const label = document.createElement('div');
    label.className   = 'nerdikon-related-label';
    label.textContent = 'VERWANDTE BEGRIFFE';
    relatedEl.appendChild(label);

    const pills = document.createElement('div');
    pills.className = 'nerdikon-related';
    entry.related.forEach(rel => {
      const exists = Object.keys(NERDIKON).some(k => k.toLowerCase() === rel.toLowerCase());
      const pill   = document.createElement('span');
      pill.className   = 'nerdikon-pill' + (exists ? '' : ' inactive');
      pill.textContent = rel;
      if (exists) {
        pill.addEventListener('click', () => openNerdikon(rel));
        pill.setAttribute('tabindex', '0');
        pill.setAttribute('role', 'button');
      }
      pills.appendChild(pill);
    });
    relatedEl.appendChild(pills);
  }

  overlay.classList.add('open');
}

function closeNerdikon() {
  const overlay = document.getElementById('nerdikonOverlay');
  if (overlay) overlay.classList.remove('open');
}

// Delegated click handler for dynamically-added nerdikon terms
document.addEventListener('click', e => {
  const term = e.target.closest('.nerdikon-term');
  if (term) openNerdikon(term.dataset.term);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNerdikon();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nerdikon-term')) {
    e.preventDefault();
    openNerdikon(e.target.dataset.term);
  }
});

// ── Sidebar Drawer (Mobile) ──────────────────────────────────────────────────

function initSidebarDrawer() {
  const btn      = document.getElementById('sidebarToggleBtn');
  const sidebar  = document.querySelector('.ep-sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!btn || !sidebar || !backdrop) return;

  btn.addEventListener('click', () => {
    sidebar.classList.add('ep-sidebar-open');
    backdrop.classList.add('ep-sidebar-open');
  });

  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('ep-sidebar-open');
    backdrop.classList.remove('ep-sidebar-open');
  });
}

// ── Auto-init ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  injectNerdikonPopup();
  initSidebarDrawer();
});
