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

// ── Reaction System ──────────────────────────────────────────────────────────

const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '👀', '🔥'];

function attachReactionUI(row) {
  if (row.classList.contains('system-msg')) return;
  const wrap = row.querySelector('.ep-msg-bubble-wrap');
  if (!wrap) return;

  // Picker (CSS order: -1 makes it appear above the bubble)
  const picker = document.createElement('div');
  picker.className = 'ep-reaction-picker';
  REACTION_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'ep-reaction-emoji-btn';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', emoji);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      picker.classList.remove('open');
      addReactionBadge(row, 'player', emoji);
      if (typeof window.onPlayerReaction === 'function') {
        window.onPlayerReaction(row, emoji);
      }
    });
    picker.appendChild(btn);
  });
  wrap.prepend(picker);

  // Reaction row: strip of badges + trigger button
  const reactionRow = document.createElement('div');
  reactionRow.className = 'ep-reaction-row';

  const strip = document.createElement('div');
  strip.className = 'ep-reaction-strip';
  reactionRow.appendChild(strip);

  const trigger = document.createElement('button');
  trigger.className = 'ep-reaction-trigger';
  trigger.setAttribute('aria-label', 'Reagieren');
  trigger.textContent = '+';
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = picker.classList.contains('open');
    document.querySelectorAll('.ep-reaction-picker.open').forEach(p => p.classList.remove('open'));
    if (!isOpen) picker.classList.add('open');
  });
  reactionRow.appendChild(trigger);

  wrap.appendChild(reactionRow);
}

function addReactionBadge(row, who, emoji) {
  const strip = row.querySelector('.ep-reaction-strip');
  if (!strip) return;

  const displayName = who === 'player' ? 'Du' : ((window['NAMES'] && window['NAMES'][who]) || who);

  let badge = Array.from(strip.querySelectorAll('.ep-reaction-badge'))
    .find(b => b.dataset.emoji === emoji);

  if (badge) {
    const count = parseInt(badge.dataset.count || '1') + 1;
    badge.dataset.count = count;
    badge.querySelector('.ep-reaction-count').textContent = count;
    if (who === 'player') badge.classList.add('player-reacted');
    const reactors = JSON.parse(badge.dataset.reactors || '[]');
    reactors.push(displayName);
    badge.dataset.reactors = JSON.stringify(reactors);
  } else {
    badge = document.createElement('span');
    badge.className = 'ep-reaction-badge' + (who === 'player' ? ' player-reacted' : '');
    badge.dataset.emoji = emoji;
    badge.dataset.count = '1';
    badge.dataset.reactors = JSON.stringify([displayName]);
    badge.innerHTML = `<span>${emoji}</span><span class="ep-reaction-count">1</span>`;
    badge.addEventListener('click', () => {
      if (!badge.classList.contains('player-reacted')) return;
      badge.classList.remove('player-reacted');
      const newCount = parseInt(badge.dataset.count || '1') - 1;
      const reactors = JSON.parse(badge.dataset.reactors || '[]');
      const idx = reactors.lastIndexOf('Du');
      if (idx !== -1) reactors.splice(idx, 1);
      if (newCount <= 0) {
        badge.remove();
      } else {
        badge.dataset.count = newCount;
        badge.dataset.reactors = JSON.stringify(reactors);
        badge.querySelector('.ep-reaction-count').textContent = newCount;
      }
    });
    strip.appendChild(badge);
  }
  badge.classList.remove('pop');
  void badge.offsetWidth;
  badge.classList.add('pop');
}

function scheduleCharReaction(row, who, emoji, delay) {
  setTimeout(() => addReactionBadge(row, who, emoji), delay);
}

// Close all pickers on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.ep-reaction-picker.open').forEach(p => p.classList.remove('open'));
});

// ── Reaction Tooltip (who reacted) ──────────────────────────────────────────

function injectReactionTooltip() {
  if (document.getElementById('epReactionTooltip')) return;
  const tip = document.createElement('div');
  tip.id = 'epReactionTooltip';
  tip.className = 'ep-reaction-tooltip';
  document.body.appendChild(tip);
}

document.addEventListener('mouseover', e => {
  const badge = e.target.closest('.ep-reaction-badge');
  if (!badge) return;
  const reactors = JSON.parse(badge.dataset.reactors || '[]');
  if (!reactors.length) return;
  const tip = document.getElementById('epReactionTooltip');
  if (!tip) return;
  tip.textContent = reactors.join(', ');
  const rect = badge.getBoundingClientRect();
  tip.style.left = (rect.left + rect.width / 2 + window.scrollX) + 'px';
  tip.style.top = (rect.top + window.scrollY - 6) + 'px';
  tip.classList.add('visible');
});

document.addEventListener('mouseout', e => {
  if (!e.target.closest('.ep-reaction-badge')) return;
  const tip = document.getElementById('epReactionTooltip');
  if (tip) tip.classList.remove('visible');
});

document.addEventListener('touchstart', e => {
  const badge = e.target.closest('.ep-reaction-badge');
  if (!badge) return;
  const reactors = JSON.parse(badge.dataset.reactors || '[]');
  if (!reactors.length) return;
  const tip = document.getElementById('epReactionTooltip');
  if (!tip) return;
  tip.textContent = reactors.join(', ');
  const rect = badge.getBoundingClientRect();
  tip.style.left = (rect.left + rect.width / 2 + window.scrollX) + 'px';
  tip.style.top = (rect.top + window.scrollY - 6) + 'px';
  tip.classList.add('visible');
  clearTimeout(tip._touchTimer);
  tip._touchTimer = setTimeout(() => tip.classList.remove('visible'), 2000);
}, { passive: true });

// ── Auto-init ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  injectNerdikonPopup();
  injectReactionTooltip();
  initSidebarDrawer();
});
