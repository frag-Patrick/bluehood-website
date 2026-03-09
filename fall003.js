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
      { who: 'system', text: () => `⚡ NEUER FALL // #003 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'zoe',    text: 'Wir haben einen neuen Fall. Herr Krause, 63, aus Bitstedt. Hat sich bei uns gemeldet wegen seinem Internet.' },
      { who: 'mia',    text: 'Was ist damit?' },
      { who: 'zoe',    text: 'Er sagt es sei "komisch langsam". Und er hat kurz in seinen Router reingeschaut.' },
      { who: 'ben',    text: 'Okay. Und?' },
      { who: 'zoe',    text: 'Das Passwort war admin/admin.' },
      { who: 'ben',    text: '...' },
      { who: 'mia',    text: 'Ben?' },
      { who: 'ben',    text: 'Ich bin noch da. Ich atme nur kurz.' },
      { who: 'luke',   text: 'Bambus Online als Anbieter?' },
      { who: 'zoe',    text: 'Ja. Warum?' },
      { who: 'luke',   text: 'Dann wird das interessant.' },
    ],
    choices: [
      { text: '🔧 Router-Zugang prüfen',          next: 'router_check'  },
      { text: '📡 Das Netzwerk scannen',           next: 'network_scan'  },
      { text: '📞 Bambus Online kontaktieren',     next: 'bambus_call'   },
    ]
  },

  router_check: {
    messages: [
      { who: 'player', text: 'Den Router-Zugang von Herrn Krause prüfen.' },
      { who: 'ben',    text: 'Ich log mich ein. Mit admin/admin.' },
      { who: 'ben',    text: 'Ich bin drin.' },
      { who: 'ben',    text: 'Firmware: <span class="ep-red">v1.3.0, März 2019</span>. WAN-Zugriff auf Admin-Panel: <span class="ep-red">aktiviert</span>. Firewall: <span class="ep-red">deaktiviert</span>.' },
      { who: 'luke',   text: 'DNS-Einträge.' },
      { who: 'ben',    text: 'Geändert. Auf <span class="ep-red">45.153.204.x</span> – das sind nicht die DNS-Server von Bambus Online.' },
      { who: 'luke',   text: 'Da war jemand vor uns.' },
      { who: 'zoe',    text: 'Was bedeutet das?' },
      { who: 'luke',   text: 'Dass Herrn Krauses Internetanfragen über fremde Server umgeleitet werden könnten.' },
    ],
    clue: 0,
    choices: [
      { text: '📡 Weitere Router im Netzwerk scannen',             next: 'network_scan'  },
      { text: '🛣️ Was kann ein Angreifer mit Router-Zugang tun?',  next: 'attack_vector' },
    ]
  },

  bambus_call: {
    messages: [
      { who: 'player', text: 'Bambus Online direkt kontaktieren.' },
      { who: 'mia',    text: 'Ich ruf da an. Bin gleich zurück.' },
      { who: 'system', text: '⏱ Mia telefoniert mit Bambus Online Support...' },
      { who: 'mia',    text: '"Ja, das ist das Standardpasswort bei der Inbetriebnahme. Die Kunden sollen das selbst ändern." Zitatende.' },
      { who: 'ben',    text: '...' },
      { who: 'luke',   text: 'Haben sie irgendwelche Hinweise gegeben wie das zu ändern ist?' },
      { who: 'mia',    text: '"Da ist eine Karte im Lieferumfang." Karte, auf der steht: Bitte Passwort ändern. Keine Anleitung.' },
      { who: 'zoe',    text: 'Das klingt wie wenn man jemandem einen Schlüssel gibt und sagt: "Bitte tausch das Schloss aus."' },
    ],
    choices: [
      { text: '🔧 Router-Zugang prüfen',          next: 'router_check'  },
      { text: '📡 Das Netzwerk scannen',           next: 'network_scan'  },
    ]
  },

  network_scan: {
    messages: [
      { who: 'player', text: 'Das gesamte Netzwerk von Bambus Online in Bitstedt scannen.' },
      { who: 'luke',   text: 'Ich habe eine Übersicht der Bambus-Online-Kunden in Bitstedt.' },
      { who: 'luke',   text: '<span class="ep-hl">40 Router</span> insgesamt. <span class="ep-red">38 davon: admin/admin</span>. 2 wurden geändert.' },
      { who: 'ben',    text: '38 von 40. Das ist keine Ausnahme. Das ist Absicht.' },
      { who: 'mia',    text: '38 Familien.' },
      { who: 'zoe',    text: 'Alle betroffen?' },
      { who: 'luke',   text: 'Potenziell. Die DNS-Einträge müssen wir für jeden einzeln prüfen.' },
    ],
    clue: 1,
    choices: [
      { text: '🛣️ Was kann ein Angreifer mit Router-Zugang tun?',  next: 'attack_vector'   },
      { text: '⚖️ Wer ist verantwortlich?',                        next: 'responsibility'  },
    ]
  },

  attack_vector: {
    messages: [
      { who: 'player', text: 'Was kann ein Angreifer mit Router-Zugang konkret tun?' },
      { who: 'luke',   text: 'Drei Hauptvektoren.' },
      { who: 'luke',   text: 'Eins: <span class="ep-hl">DNS-Poisoning</span>. Alle Anfragen an bestimmte Bankseiten werden auf Phishing-Seiten umgeleitet. Wie wir hier schon gesehen haben.' },
      { who: 'ben',    text: 'Zwei: <span class="ep-hl">Traffic-Inspektion</span>. HTTP-Daten sind für den Router-Besitzer lesbar. Benutzernamen, Passwörter, Formulardaten.' },
      { who: 'luke',   text: 'Drei: <span class="ep-hl">Botnet-Recruiting</span>. Der Router wird als Relay für weitere Angriffe genutzt – DDoS, Spam, Scanning.' },
      { who: 'mia',    text: 'Dieter war Opfer von Cryptojacking. Die Leute in Bitstedt könnten Opfer von allem sein.' },
      { who: 'zoe',    text: 'Das ist viel schlimmer als ich dachte.' },
    ],
    clue: 2,
    choices: [
      { text: '⚖️ Wer ist verantwortlich?',    next: 'responsibility' },
      { text: '🛡️ Wie beheben wir das?',       next: 'fix'            },
    ]
  },

  responsibility: {
    messages: [
      { who: 'player', text: 'Wer trägt die Verantwortung?' },
      { who: 'luke',   text: 'Bambus Online: Router mit Werkspasswort ausgeliefert. WAN-Admin-Zugriff aktiv gelassen. Keine echte Anleitung. Keine Firmware-Updates aufgespielt.' },
      { who: 'ben',    text: 'Das BSI-Grundschutz-Kompendium empfiehlt für ISPs: Passwortpflicht bei Inbetriebnahme. Bambus Online ignoriert das.' },
      { who: 'mia',    text: 'Aber Herr Krause weiß nicht was ein Router ist. Wie soll er wissen dass er das Passwort ändern muss?' },
      { who: 'luke',   text: 'Genau das ist das Problem. Die Verantwortung liegt beim Anbieter.' },
      { who: 'zoe',    text: 'Das ist nicht Herrn Krauses Schuld?' },
      { who: 'luke',   text: 'Nein. Aber er kann trotzdem handeln.' },
    ],
    clue: 3,
    choices: [
      { text: '🛡️ Wie beheben wir das?',                next: 'fix'        },
      { text: '💡 Wie schützt man sich als Nutzer?',     next: 'prevention' },
    ]
  },

  fix: {
    messages: [
      { who: 'player', text: 'Wie beheben wir das?' },
      { who: 'ben',    text: 'Für Herrn Krause, sofort:' },
      { who: 'ben',    text: '1. <span class="ep-hl">Admin-Passwort ändern</span> – langes, zufälliges Passwort.' },
      { who: 'ben',    text: '2. <span class="ep-hl">DNS-Server zurücksetzen</span> auf offizielle Bambus-Online-Server.' },
      { who: 'ben',    text: '3. <span class="ep-hl">WAN-Zugriff auf Admin-Panel deaktivieren</span>.' },
      { who: 'ben',    text: '4. <span class="ep-hl">Firmware updaten</span>, Firewall aktivieren.' },
      { who: 'luke',   text: 'Für alle 38 anderen: Bambus Online muss seine Kunden kontaktieren.' },
      { who: 'mia',    text: 'Werden sie das tun?' },
      { who: 'luke',   text: 'Wenn wir es melden. Datenschutzbehörde. BSI-Meldepflicht. Das wäre unsere nächste Aktion.' },
    ],
    choices: [
      { text: '💡 Wie schützt man sich als Nutzer?', next: 'prevention' },
      { text: '✅ Fall abschließen',                  next: 'end'        },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Wie schützt man sich als Nutzer?' },
      { who: 'ben',    text: 'Der Router ist das Tor zum Heimnetz. Vier Dinge sofort nach dem Einrichten:' },
      { who: 'ben',    text: '1. <span class="ep-hl">Admin-Passwort ändern.</span> Immer. Sofort.' },
      { who: 'ben',    text: '2. <span class="ep-hl">Firmware auf aktuellen Stand bringen.</span> Im Admin-Panel meist ein Klick.' },
      { who: 'ben',    text: '3. <span class="ep-hl">WAN-Zugriff auf das Admin-Panel deaktivieren.</span> Niemand sollte deinen Router von außen verwalten können.' },
      { who: 'mia',    text: '4. <span class="ep-hl">DNS-Einträge prüfen.</span> Stehen da fremde Adressen? Sofort beim Anbieter melden.' },
      { who: 'zoe',    text: 'Das klingt kompliziert für normale Leute.' },
      { who: 'ben',    text: 'Das klingt kompliziert. Ist es aber nicht. 10 Minuten. Einmal.' },
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
    delay: 2500,
    banter: [
      { who: 'ben',  text: 'admin/admin. ADMIN SLASH ADMIN.' },
      { who: 'mia',  text: 'Ben. Atme.', delay: 1500 },
      { who: 'ben',  text: 'Ich atme. Ich atme. Es ist nur... ADMIN SLASH ADMIN.', delay: 2000 }
    ]
  },
  {
    after: 'router_check',
    delay: 3000,
    banter: [
      { who: 'zoe',  text: 'Wie lange ist der Router schon so offen?' },
      { who: 'ben',  text: 'Firmware von 2019. Also mindestens 5 Jahre.', delay: 2000 },
      { who: 'zoe',  text: 'Fünf Jahre?', delay: 1500 },
      { who: 'luke', text: 'Ja.', delay: 800 },
      { who: 'zoe',  text: 'Ich schreib das auf.', delay: 1000 },
      { who: 'ben',  text: 'Schreib auch: Bambus Online ist schuld.', delay: 1500 }
    ]
  },
  {
    after: 'network_scan',
    delay: 2000,
    banter: [
      { who: 'mia',  text: '38 Familien.' },
      { who: 'ben',  text: 'Ohne dass es jemand gemerkt hat.', delay: 2000 },
      { who: 'mia',  text: '38 Familien die möglicherweise überwacht werden.', delay: 1500 },
      { who: 'luke', text: 'Vermutlich nicht alle. Aber die Möglichkeit besteht.', delay: 2000 }
    ]
  },
  {
    after: 'attack_vector',
    delay: 4000,
    banter: [
      { who: 'ben',  text: 'Wisst ihr was mich am meisten aufregt?' },
      { who: 'mia',  text: 'Der Router-Name?', delay: 1500 },
      { who: 'ben',  text: 'NEIN. Dass Bambus Online das wusste. admin/admin ist kein Versehen.', delay: 2500 },
      { who: 'luke', text: 'Beweise dafür haben wir nicht.', delay: 2000 },
      { who: 'ben',  text: 'R2-D2 hätte das nie passieren lassen.', delay: 1500 },
      { who: 'mia',  text: '...ist R2-D2 dein Router?', delay: 1500 },
      { who: 'ben',  text: 'R2-D2 ist mein Freund.', delay: 800 }
    ]
  },
  {
    after: 'responsibility',
    delay: 3000,
    banter: [
      { who: 'zoe',  text: 'Kann man Bambus Online zur Rechenschaft ziehen?' },
      { who: 'luke', text: 'Datenschutzbehörde. BSI-Meldepflicht. Ja.', delay: 2000 },
      { who: 'mia',  text: 'Das klingt nach Arbeit.', delay: 1500 },
      { who: 'luke', text: 'Ja.', delay: 800 }
    ]
  },
  {
    after: 'fix',
    delay: 3000,
    who: 'ben',
    text: 'R2-D2 läuft übrigens seit 1.247 Tagen ohne Neustart. Nur damit ihr wisst wie das geht.'
  },
  {
    after: 'prevention',
    delay: 2500,
    banter: [
      { who: 'zoe',  text: 'Ich ruf meinen Vater an und sag ihm er soll seinen Router-Passwort ändern.' },
      { who: 'mia',  text: 'Das ist das Richtigste was du heute sagst.', delay: 1500 },
      { who: 'ben',  text: 'Frag ihn auch nach dem Firmware-Stand.', delay: 1500 },
      { who: 'zoe',  text: 'Das erkläre ich ihm dann beim nächsten Besuch.', delay: 1800 },
      { who: 'ben',  text: 'Jetzt.', delay: 800 },
      { who: 'zoe',  text: '...jetzt.', delay: 1000 }
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
    { who: 'system', text: '✅ FALL #003 ABGESCHLOSSEN' },
    { who: 'ben',    text: 'Herrn Krauses Router ist gesichert. R2-D2 wäre stolz.' },
    { who: 'mia',    text: 'Wir haben Bambus Online zur Meldung aufgefordert. Alle 38 Kunden werden informiert.' },
    { who: 'zoe',    text: 'Ich hab alles dokumentiert. Auch für den BSI-Bericht.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
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
    <p>Unsichere Standardkonfiguration durch ISP Bambus Online.</p>
    <p>38 von 40 Haushalten in Bitstedt waren betroffen.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #003 · Einsteiger</p>
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
