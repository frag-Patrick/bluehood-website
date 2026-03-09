// ── State ─────────────────────────────────────────────────────────────────────
const S = { clues: [false, false, false, false] };

function clueCount() { return S.clues.filter(Boolean).length; }

function revealClue(i) {
  if (S.clues[i]) return;
  S.clues[i] = true;
  const el = document.getElementById('c' + i);
  if (el) {
    el.classList.add('found');
    el.querySelector('.ep-clue-check').textContent = '[✓]';
  }
  const n = clueCount();
  document.getElementById('progBar').style.width = (n / 4 * 100) + '%';
  document.getElementById('progLabel').textContent = n + ' / 4 Hinweise';
}

// ── Story ─────────────────────────────────────────────────────────────────────
const STORY = {

  start: {
    messages: [
      { who: 'system', text: () => `⚡ NEUER FALL // #004 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'mia',    text: 'Oh. Oh nein. Oh doch.' },
      { who: 'luke',   text: 'Was.' },
      { who: 'mia',    text: 'Wir haben einen neuen Fall. Vishing.' },
      { who: 'zoe',    text: 'Was ist Vishing?' },
      { who: 'mia',    text: 'Voice Phishing. Jemand ruft an, gibt sich als IT-Support aus, und quetscht der Mitarbeiterin in 8 Minuten die VPN-Zugangsdaten raus.' },
      { who: 'zoe',    text: 'Acht Minuten?' },
      { who: 'mia',    text: 'Acht.' },
      { who: 'ben',    text: 'Firma?' },
      { who: 'mia',    text: 'Meier und Söhne GmbH. Bochum. Die haben sogar eine Aufzeichnung des Anrufs.' },
      { who: 'luke',   text: 'Dann hören wir uns das an.' },
      { who: 'mia',    text: 'Das ist mein absoluter Lieblingsfall. Nur zur Info.' },
    ],
    choices: [
      { text: '📋 Gesprächsstrategie des Angreifers analysieren',    next: 'call_strategy'     },
      { text: '🔍 Woher kannte er interne Informationen?',           next: 'insider_knowledge' },
      { text: '📊 Was hat Frau Weber genau verraten?',               next: 'what_was_revealed' },
    ]
  },

  call_strategy: {
    messages: [
      { who: 'player', text: 'Die Gesprächsstrategie des Angreifers analysieren.' },
      { who: 'mia',    text: 'Ich hab die Aufzeichnung. Hier die Struktur:' },
      { who: 'mia',    text: '<span class="ep-hl">Minuten 0–1½: Vertrauensaufbau.</span> "Guten Tag, hier ist Dirk Hoffmann vom IT-Support. Tut mir leid dass ich störe, ich ruf wegen Ihrer VPN-Verbindung an..."' },
      { who: 'mia',    text: '<span class="ep-hl">Minuten 2–4: Dringlichkeit.</span> "Ihr Account zeigt gerade verdächtige Aktivität. Wir müssen das sofort klären, sonst müssen wir alles sperren."' },
      { who: 'mia',    text: '<span class="ep-hl">Minute 5: Social Proof.</span> "Ihr Kollege Herr Becker hat mich informiert, er war leider für dieses Gespräch verhindert."' },
      { who: 'mia',    text: '<span class="ep-hl">Minuten 6–8: Die eigentliche Frage.</span> Schrittweise. Erst die Employee-ID. Dann das "temporäre" Passwort. Frau Weber dachte sie hilft.' },
      { who: 'luke',   text: 'Das ist Lehrbuch-Vishing. Jede Technik hat einen Namen.' },
    ],
    clue: 0,
    choices: [
      { text: '🔍 Woher kannte er Herrn Beckers Namen?',    next: 'insider_knowledge' },
      { text: '📊 Was hat Frau Weber verraten?',            next: 'what_was_revealed' },
    ]
  },

  insider_knowledge: {
    messages: [
      { who: 'player', text: 'Woher kannte der Angreifer interne Informationen?' },
      { who: 'luke',   text: 'Ich hab die OSINT-Recherche rekonstruiert. Das hat ihn vermutlich 15 Minuten gekostet.' },
      { who: 'luke',   text: 'LinkedIn: <span class="ep-hl">Thomas Becker, Leiter IT-Infrastruktur, Meier & Söhne GmbH</span>. Öffentliches Profil. Foto, Position, Telefonnummer des Unternehmens.' },
      { who: 'luke',   text: 'Firmenwebsite: Impressum mit Abteilungsstruktur. E-Mail-Format: vorname.nachname@meier-soehne.de. Damit kennt man alle Adressen.' },
      { who: 'ben',    text: 'Mit diesen Infos klingt man intern. Herr Becker existiert wirklich. Das schafft sofort Vertrauen.' },
      { who: 'zoe',    text: 'Ich hab auch LinkedIn...' },
      { who: 'ben',    text: '...Zoe.' },
      { who: 'zoe',    text: 'Ich mach es privat.' },
      { who: 'luke',   text: 'Jetzt.' },
    ],
    clue: 1,
    choices: [
      { text: '📊 Was hat Frau Weber verraten?',     next: 'what_was_revealed' },
      { text: '☎️ Wer hat angerufen?',               next: 'who_called'        },
    ]
  },

  what_was_revealed: {
    messages: [
      { who: 'player', text: 'Was hat Frau Weber konkret verraten?' },
      { who: 'luke',   text: 'Aus der Aufzeichnung:' },
      { who: 'luke',   text: '1. Ihre <span class="ep-red">Employee-ID</span> (M-4471).' },
      { who: 'luke',   text: '2. Ein <span class="ep-red">temporäres VPN-Passwort</span> ("War sowieso schon alt", hat sie gesagt).' },
      { who: 'luke',   text: '3. Das <span class="ep-red">E-Mail-Namensformat</span> der Firma – sie hat ihre eigene Adresse bestätigt.' },
      { who: 'mia',    text: 'Das reicht für einen VPN-Zugang. Temporäre Passwörter werden oft nicht sofort invalidiert.' },
      { who: 'luke',   text: 'Sie war höflich. Sie wollte helfen. Das ist vollkommen menschlich.' },
      { who: 'mia',    text: 'Und genau das wird ausgenutzt.' },
    ],
    clue: 2,
    choices: [
      { text: '☎️ Wer hat angerufen?',                       next: 'who_called'      },
      { text: '🛡️ Schadensbegrenzung – was jetzt?',          next: 'damage_control'  },
      { text: '💡 Wie verhindert man das?',                   next: 'prevention'      },
    ]
  },

  who_called: {
    messages: [
      { who: 'player', text: 'Wer hat angerufen? Die Nummer zurückverfolgen.' },
      { who: 'luke',   text: 'Angezeigte Nummer: 0234-847192 – sieht aus wie eine interne Durchwahl von Meier & Söhne.' },
      { who: 'luke',   text: 'Tatsächlicher Ursprung: <span class="ep-red">VoIP-Anbieter, anonymes Prepaid-Konto</span>. Caller ID Spoofing.' },
      { who: 'ben',    text: 'Mit VoIP kann man jede beliebige Nummer anzeigen lassen. Kostet nichts. Dauert eine Minute.' },
      { who: 'zoe',    text: 'Das ist legal?' },
      { who: 'luke',   text: 'Das Spoofing selbst: Grauzone. Der Betrug damit: nicht legal.' },
      { who: 'luke',   text: 'Das Gute: Die Firma hat die Aufzeichnung. Das Muster ist dokumentiert. Provider-Kooperation wäre der nächste Schritt.' },
    ],
    clue: 3,
    choices: [
      { text: '🛡️ Schadensbegrenzung – was jetzt?', next: 'damage_control' },
      { text: '💡 Wie verhindert man das?',          next: 'prevention'     },
    ]
  },

  damage_control: {
    messages: [
      { who: 'player', text: 'Schadensbegrenzung – was muss jetzt passieren?' },
      { who: 'luke',   text: '1. <span class="ep-hl">VPN-Credentials sofort zurücksetzen.</span> Alle aktiven Sessions terminieren.' },
      { who: 'ben',    text: '2. <span class="ep-hl">Access-Logs der letzten 48 Stunden auswerten.</span> Gab es unbekannte Logins?' },
      { who: 'mia',    text: '3. <span class="ep-hl">Frau Weber nicht beschuldigen.</span> Das ist ein Systemfehler, kein menschlicher Fehler. Sie wurde professionell manipuliert.' },
      { who: 'luke',   text: '4. <span class="ep-hl">Alle Mitarbeitenden informieren.</span> Rückruf-Policy einführen: Bei unbekannten Anrufern immer über die offizielle Nummer zurückrufen.' },
      { who: 'zoe',    text: 'Wie sagt man Frau Weber dass sie nichts falsch gemacht hat, wenn... sie doch was falsch gemacht hat?' },
      { who: 'mia',    text: 'Man sagt: Das war eine professionelle Manipulation. Es passiert den Besten. Wir ändern die Systeme, nicht die Menschen.' },
    ],
    choices: [
      { text: '💡 Wie verhindert man das in Zukunft?', next: 'prevention' },
      { text: '✅ Fall abschließen',                    next: 'end'        },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Wie verhindert man Vishing-Angriffe?' },
      { who: 'mia',    text: 'Drei Regeln. Diese brennen wir uns ein.' },
      { who: 'mia',    text: 'Regel 1: <span class="ep-hl">Niemals Credentials am Telefon.</span> Egal wer anruft. Egal wie dringend. Kein echter IT-Support fragt nach Passwörtern.' },
      { who: 'luke',   text: 'Regel 2: <span class="ep-hl">Rückruf-Verifizierung.</span> "Ich ruf Sie über die offizielle Nummer zurück." Wer legitim ist, wartet.' },
      { who: 'ben',    text: 'Regel 3: <span class="ep-hl">Dringlichkeit ist ein Warnsignal.</span> "Sofort, sonst sperren wir alles" – das ist Druck. Echter IT-Support baut keinen Druck auf.' },
      { who: 'mia',    text: 'Social Engineering ist kein Hack von Systemen. Es ist ein Hack von Menschen.' },
      { who: 'zoe',    text: 'Ich schreib das auf. Wortwörtlich.' },
    ],
    choices: [
      { text: '✅ Fall abschließen', next: 'end' },
    ]
  },

  end: { final: true }
};

// ── Ambient Dialogue ───────────────────────────────────────────────────────────
const ambientMessages = [
  {
    after: 'start',
    delay: 2000,
    banter: [
      { who: 'mia',  text: 'Ich mein das ernst. Dieser Fall ist wunderschön konstruiert.' },
      { who: 'luke', text: 'Mia.', delay: 1500 },
      { who: 'mia',  text: 'Technisch gesehen!', delay: 800 },
      { who: 'ben',  text: 'Als jemand der Technik schön findet: Das hier ist eher... elegant eklig.', delay: 2000 }
    ]
  },
  {
    after: 'call_strategy',
    delay: 3500,
    banter: [
      { who: 'mia',  text: 'Darf ich kurz was demonstrieren?' },
      { who: 'luke', text: 'Nein.', delay: 1000 },
      { who: 'mia',  text: 'Ich ruf Ben an.', delay: 800 },
      { who: 'ben',  text: 'Tu das nicht.', delay: 600 },
      { who: 'mia',  text: 'Guten Tag, hier ist die Servicezentrale. Wir haben ein dringendes Problem mit Ihrer Hardware–', delay: 1000 },
      { who: 'ben',  text: 'Mia ich SEH dich gerade.', delay: 2000 },
      { who: 'mia',  text: 'Trotzdem hättest du fast geantwortet 😄', delay: 1500 },
      { who: 'ben',  text: '...ich sage nichts.', delay: 1200 }
    ]
  },
  {
    after: 'insider_knowledge',
    delay: 2500,
    banter: [
      { who: 'zoe',  text: '(tippt hörbar)' },
      { who: 'luke', text: 'Zoe.', delay: 1000 },
      { who: 'zoe',  text: 'Ich mach es schon.', delay: 1200 },
      { who: 'ben',  text: 'Gut.', delay: 800 },
      { who: 'zoe',  text: 'Aber mein Profilbild bleibt.', delay: 1000 },
      { who: 'luke', text: 'Zoe.', delay: 600 }
    ]
  },
  {
    after: 'what_was_revealed',
    delay: 3000,
    banter: [
      { who: 'ben',  text: '"War sowieso schon alt." (zitiert Frau Weber)' },
      { who: 'mia',  text: 'Das bricht mir das Herz.', delay: 2000 },
      { who: 'ben',  text: 'Sie wollte helfen. Das ist keine Dummheit.', delay: 2500 },
      { who: 'zoe',  text: 'Das macht es noch schlimmer.', delay: 1800 }
    ]
  },
  {
    after: 'who_called',
    delay: 2000,
    banter: [
      { who: 'zoe',  text: 'Kann man das irgendwie technisch verhindern? Das Spoofing?' },
      { who: 'luke', text: 'Teilweise. STIR/SHAKEN-Protokoll verifiziert Nummern beim Anbieter.', delay: 2500 },
      { who: 'zoe',  text: 'Und das wird eingesetzt?', delay: 1800 },
      { who: 'ben',  text: 'In Deutschland noch nicht flächendeckend.', delay: 2000 },
      { who: 'mia',  text: 'Toll.', delay: 800 },
      { who: 'luke', text: 'Ja.', delay: 600 }
    ]
  },
  {
    after: 'damage_control',
    delay: 3000,
    who: 'mia',
    text: 'Ich hab Frau Weber übrigens direkt angerufen. Nicht über den IT-Support. 😄 Sie hat gelacht.'
  },
  {
    after: 'prevention',
    delay: 2500,
    banter: [
      { who: 'ben',  text: 'Mein Arbeitgeber früher hatte eine Policy: Kein IT-Support ruft an. Nie. Immer Ticket.' },
      { who: 'mia',  text: 'Das ist eigentlich perfekt.', delay: 1800 },
      { who: 'luke', text: 'Das ist die richtige Lösung.', delay: 1500 },
      { who: 'zoe',  text: 'Warum macht das nicht jede Firma so?', delay: 1800 },
      { who: 'ben',  text: 'Weil Tickets nerven.', delay: 1200 },
      { who: 'mia',  text: 'Tickets nerven weniger als Vishing.', delay: 1500 }
    ]
  }
];

// Index aufbauen
const ambientByScene = {};
for (const item of ambientMessages) {
  if (!ambientByScene[item.after]) ambientByScene[item.after] = [];
  ambientByScene[item.after].push(item);
}
let ambientGen = 0;

// ── Render ─────────────────────────────────────────────────────────────────────
const msgsEl = document.getElementById('msgs');
const gridEl = document.getElementById('choiceGrid');
const newMsgBtn = document.getElementById('newMsgBtn');
const seenChars = new Set();
let userAtBottom = true;
msgsEl.addEventListener('scroll', () => {
  userAtBottom = msgsEl.scrollHeight - msgsEl.scrollTop - msgsEl.clientHeight < 80;
  if (userAtBottom) newMsgBtn.classList.remove('visible');
});
newMsgBtn.addEventListener('click', () => {
  msgsEl.scrollTop = msgsEl.scrollHeight;
  newMsgBtn.classList.remove('visible');
});
const NAMES = { luke: 'LUKE', mia: 'MIA', ben: 'BEN', zoe: 'ZOE', player: 'DU', system: '' };

function addMsg(who, html) {
  return new Promise(res => {
    const row = document.createElement('div');
    if (who === 'system') {
      row.className = 'ep-msg-row system-msg';
      row.innerHTML = `<div class="ep-bubble">${html}</div>`;
    } else {
      const side = who === 'player' ? 'right' : 'left';
      row.className = `ep-msg-row ${who} ${side}`;
      const _nm = typeof nerdikonMarkup === 'function' ? nerdikonMarkup : h => h;
      if (who !== 'player') {
        const nameHtml = `<span class="ep-msg-avatar-name">${NAMES[who]}</span>`;
        const avatar = `<div class="ep-msg-avatar ${who}"><div class="ep-msg-avatar-circle">${who[0].toUpperCase()}</div>${nameHtml}</div>`;
        row.innerHTML = `${avatar}<div class="ep-bubble">${_nm(html)}</div>`;
      } else {
        row.innerHTML = `<div class="ep-bubble">${_nm(html)}</div>`;
      }
    }
    msgsEl.appendChild(row);
    if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
    setTimeout(res, 80);
  });
}

function showTyping(who) {
  const existing = document.getElementById('typing');
  if (existing) existing.remove();
  const row = document.createElement('div');
  row.className = 'ep-typing-row';
  row.id = 'typing';
  const name = NAMES[who] || '';
  row.innerHTML = `<div class="ep-typing-name">${name}</div><div class="ep-typing-bubble"><span></span><span></span><span></span></div>`;
  msgsEl.appendChild(row);
  if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function typingDuration(text) {
  const len = (typeof text === 'string' ? text : '').replace(/<[^>]*>/g, '').length;
  return 600 + Math.min(len * 18, 1800);
}

// ── Ambient System ─────────────────────────────────────────────────────────────
async function playAmbient(key, gen) {
  const items = ambientByScene[key];
  if (!items || !items.length) return;
  for (const item of items) {
    await wait(item.delay || 2000);
    if (gen !== ambientGen) return;
    if (item.banter) {
      for (let i = 0; i < item.banter.length; i++) {
        if (gen !== ambientGen) return;
        const b = item.banter[i];
        if (i > 0) { await wait(b.delay || 2000); if (gen !== ambientGen) return; }
        showTyping(b.who);
        await wait(typingDuration(b.text));
        if (gen !== ambientGen) { removeTyping(); return; }
        removeTyping();
        await addMsg(b.who, b.text);
        await wait(300);
      }
    } else {
      showTyping(item.who);
      await wait(typingDuration(item.text));
      if (gen !== ambientGen) { removeTyping(); return; }
      removeTyping();
      await addMsg(item.who, item.text);
    }
  }
}

// ── Scene Engine ───────────────────────────────────────────────────────────────
async function playScene(key) {
  ambientGen++;
  const myGen = ambientGen;
  gridEl.innerHTML = '';
  if (key === 'end') { await showEnd(); return; }
  const scene = STORY[key];
  if (!scene) return;
  for (let i = 0; i < scene.messages.length; i++) {
    const m = scene.messages[i];
    const isSystem = m.who === 'system';
    const isPlayer = m.who === 'player';
    if (!isSystem && !isPlayer) {
      showTyping(m.who);
      await wait(typingDuration(m.text));
      removeTyping();
    }
    await addMsg(m.who, typeof m.text === 'function' ? m.text() : m.text);
    await wait(isSystem ? 400 : isPlayer ? 200 : 500);
  }
  if (scene.clue !== undefined) { await wait(300); revealClue(scene.clue); }
  playAmbient(key, myGen);
  await wait(400);
  if (scene.choices) {
    scene.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ep-choice-btn';
      btn.textContent = c.text;
      btn.onclick = () => playScene(c.next);
      gridEl.appendChild(btn);
    });
  }
}

async function showEnd() {
  await wait(300);
  const n = clueCount();
  const allFound = n === 4;
  const endings = [
    { who: 'system', text: '✅ FALL #004 ABGESCHLOSSEN' },
    { who: 'mia',    text: 'VPN-Zugang zurückgesetzt. Keine verdächtigen Logins in den Logs.' },
    { who: 'luke',   text: 'Meier & Söhne hat eine Rückruf-Policy eingeführt. Frau Weber hat das selbst beantragt.' },
    { who: 'zoe',    text: 'Ich hab den Fall vollständig dokumentiert. Auch die Gesprächsstruktur – das ist ein gutes Schulungsbeispiel.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'mia',    text: 'Wunderschöner Fall. Ich sag es nochmal.' },
  ];
  for (const m of endings) {
    if (m.who !== 'system') { showTyping(m.who); await wait(800); removeTyping(); }
    await addMsg(m.who, m.text);
    await wait(m.who === 'system' ? 400 : 600);
  }
  const card = document.createElement('div');
  card.className = 'ep-end-card';
  card.innerHTML = `
    <h2>// FALL GELÖST</h2>
    <p>Vishing-Angriff über 8 Minuten. Temporäre VPN-Credentials kompromittiert.</p>
    <p>Frau Weber hat nichts falsch gemacht. Das System hatte keine Schutzmaßnahmen.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #004 · Mittel</p>
    <p style="margin-top:16px; font-size:13px; color:var(--muted);">Trag dich in den Newsletter ein für neue Folgen.</p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
      <a href="play.html" class="ep-restart-btn">← Zurück zu den Fällen</a>
      <a href="news.html" class="ep-restart-btn">Newsletter →</a>
    </div>
  `;
  msgsEl.appendChild(card);
  if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
  gridEl.innerHTML = '';
}

// ── Boot ───────────────────────────────────────────────────────────────────────
(async () => {
  await addMsg('system', '🔵 EMERGENCY PROTOKOLL gestartet // Verbindung aufgebaut');
  await wait(600);
  playScene('start');
})();
