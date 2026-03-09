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
      { who: 'system', text: () => `⚡ NEUER FALL // #005 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'mia',    text: 'Kevin hat angerufen.' },
      { who: 'luke',   text: 'Das Café?' },
      { who: 'mia',    text: 'Ja. Er ist ziemlich aufgeregt. Drei Stammkunden melden sich bei ihm – ihre Accounts wurden gehackt. Alle nach einem Besuch im Café.' },
      { who: 'ben',    text: 'Alle drei nach einem Besuch?' },
      { who: 'mia',    text: 'In dieser Woche.' },
      { who: 'ben',    text: 'Das ist kein Zufall.' },
      { who: 'zoe',    text: 'Das Café hat WLAN, oder? BitBrew_Free?' },
      { who: 'ben',    text: 'Ja. Und ich hab da schon eine Vermutung.' },
      { who: 'luke',   text: 'Wir fahren hin.' },
      { who: 'mia',    text: 'Kevin macht den besten Cortado der Stadt.' },
      { who: 'luke',   text: 'Mia.' },
      { who: 'mia',    text: 'Ich kann beides.' },
    ],
    choices: [
      { text: '📡 Das WLAN-Netzwerk analysieren',       next: 'network_analysis' },
      { text: '👤 Nach dem Angreifer suchen',            next: 'find_attacker'    },
      { text: '📋 Betroffene Kunden kontaktieren',       next: 'victims'          },
    ]
  },

  network_analysis: {
    messages: [
      { who: 'player', text: 'Das WLAN-Netzwerk analysieren.' },
      { who: 'ben',    text: 'Ich scan das Netzwerk.' },
      { who: 'ben',    text: 'Warte mal.' },
      { who: 'ben',    text: 'Es gibt <span class="ep-red">zwei Access Points</span> mit der SSID "BitBrew_Free".' },
      { who: 'luke',   text: 'Offizieller AP: MAC <span class="ep-hl">D4:6E:0E:xx</span>. Unbekannter AP: MAC <span class="ep-red">7A:2C:F1:xx</span> – stärkeres Signal als das Original.' },
      { who: 'ben',    text: 'Geräte verbinden sich automatisch mit dem stärksten Signal. Die meisten Kunden sind auf dem falschen AP.' },
      { who: 'ben',    text: 'Das ist ein <span class="ep-hl">Evil Twin Attack</span>. Klassisch.' },
      { who: 'zoe',    text: 'Evil Twin? Weil er wie das Original aussieht?' },
      { who: 'luke',   text: 'Genau. Gleicher Name. Stärkeres Signal. Alles läuft durch ihn durch.' },
    ],
    clue: 0,
    choices: [
      { text: '🔍 Den Traffic untersuchen',          next: 'traffic_capture' },
      { text: '📍 Angreifer-Gerät lokalisieren',     next: 'find_attacker'   },
    ]
  },

  traffic_capture: {
    messages: [
      { who: 'player', text: 'Den Traffic auf dem Rogue AP untersuchen.' },
      { who: 'luke',   text: 'Ich hab eine Probe des weitergeleiteteten Traffics.' },
      { who: 'luke',   text: 'HTTP-Verbindungen: plaintext. Komplett lesbar.' },
      { who: 'luke',   text: 'Ich sehe: E-Mail-Login um <span class="ep-red">14:23</span>. Passwort im Klartext. Bankportal um <span class="ep-red">15:01</span>. Benutzername + Session-Token. Soziales Netzwerk um <span class="ep-red">15:44</span>.' },
      { who: 'ben',    text: 'Alles lesbar. Als würde man jemandem beim Tippen über die Schulter schauen.' },
      { who: 'zoe',    text: 'Und die Leute merken es nicht?' },
      { who: 'luke',   text: 'Nein. Das WLAN funktioniert. Browser zeigt kein Warnsignal für HTTP-Verbindungen.' },
      { who: 'mia',    text: 'Das ist so still. Der sitzt einfach da und liest alles mit.' },
    ],
    clue: 1,
    choices: [
      { text: '👥 Wie viele Opfer gibt es?',        next: 'victims'       },
      { text: '📍 Angreifer lokalisieren',           next: 'find_attacker' },
    ]
  },

  victims: {
    messages: [
      { who: 'player', text: 'Wie viele Personen sind betroffen?' },
      { who: 'luke',   text: 'Aus den Verbindungsprotokollen des Rogue AP: <span class="ep-red">12 Endgeräte</span> in den letzten 6 Stunden.' },
      { who: 'luke',   text: 'Davon mindestens 7 mit klartextübertragenen Credentials auf verschiedenen Diensten.' },
      { who: 'mia',    text: 'Ich muss das Kevin erklären. Und dann... den Kunden.' },
      { who: 'ben',    text: 'Das Café haftet nicht direkt. Aber der Reputationsschaden ist real.' },
      { who: 'luke',   text: 'Jede betroffene Person muss sofort informiert werden.' },
      { who: 'zoe',    text: 'Wie sagt man jemandem dass ihre Konten möglicherweise kompromittiert sind?' },
      { who: 'mia',    text: 'Man sagt es direkt. Klar. Ohne Panik zu machen.' },
    ],
    clue: 2,
    choices: [
      { text: '📍 Angreifer finden',              next: 'find_attacker'  },
      { text: '🛡️ Was jetzt tun?',               next: 'damage_control' },
    ]
  },

  find_attacker: {
    messages: [
      { who: 'player', text: 'Das Angreifer-Gerät lokalisieren.' },
      { who: 'ben',    text: 'Signal-Stärkenanalyse. Der Rogue AP muss physisch irgendwo im Café sein.' },
      { who: 'ben',    text: 'Ecke rechts hinten. Laptop. Unscheinbar. Aber...' },
      { who: 'ben',    text: '...ein <span class="ep-hl">Raspberry Pi 4</span> liegt daneben, verbunden über USB. Mit einem <span class="ep-hl">Alfa Network AWUS036ACH</span> Adapter. Externer Antenna.' },
      { who: 'ben',    text: 'hostapd läuft. mitmproxy läuft. Das ist... sehr sauber aufgesetzt. Technisch gesehen.' },
      { who: 'luke',   text: 'Ben.' },
      { who: 'ben',    text: 'Ich sag nur: technisch. Der Mensch dahinter ist trotzdem ein Problem.' },
      { who: 'mia',    text: 'Kevin, ist der Gast noch hier?' },
      { who: 'mia',    text: '...er ist vor 20 Minuten gegangen.' },
    ],
    clue: 3,
    choices: [
      { text: '🛡️ Schadensbegrenzung',            next: 'damage_control' },
      { text: '💡 Wie schützt man sich?',          next: 'prevention'     },
    ]
  },

  damage_control: {
    messages: [
      { who: 'player', text: 'Schadensbegrenzung – was passiert jetzt?' },
      { who: 'luke',   text: '1. <span class="ep-hl">Alle 12 betroffenen Personen benachrichtigen.</span> Passwörter sofort zurücksetzen für alle genutzten Dienste.' },
      { who: 'ben',    text: '2. <span class="ep-hl">Kevin: WLAN-Infrastruktur sichern.</span> WPA2-Enterprise mit individuellen Logins statt shared Key. Rogue AP-Detection aktivieren.' },
      { who: 'luke',   text: '3. <span class="ep-hl">Alle Besucher der letzten 6 Stunden</span> müssen als potenziell betroffen gelten.' },
      { who: 'mia',    text: '4. <span class="ep-hl">Banken informieren</span> bei betroffenen Banking-Zugängen. Sofort.' },
      { who: 'zoe',    text: 'Und den Angreifer?' },
      { who: 'luke',   text: 'Anzeige. Das Gerät ist Beweismittel. Kevin bewahrt alles auf.' },
    ],
    choices: [
      { text: '💡 Wie schützt man sich im öffentlichen WLAN?', next: 'prevention' },
      { text: '✅ Fall abschließen',                            next: 'end'        },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Wie schützt man sich im öffentlichen WLAN?' },
      { who: 'luke',   text: 'Drei Regeln für öffentliche Netzwerke.' },
      { who: 'ben',    text: 'Regel 1: <span class="ep-hl">VPN verwenden.</span> Immer. Dann ist der Traffic verschlüsselt, auch wenn der AP bösartig ist.' },
      { who: 'luke',   text: 'Regel 2: <span class="ep-hl">Nur HTTPS-Seiten.</span> Das Schloss in der Adressleiste. Keine sensiblen Daten ohne es.' },
      { who: 'ben',    text: 'Regel 3: <span class="ep-hl">"Automatisch verbinden" deaktivieren.</span> Das Gerät fragt, du entscheidest.' },
      { who: 'mia',    text: 'Und im Zweifel: Für Online-Banking, E-Mail – einfach mobiles Daten nutzen statt Café-WLAN.' },
      { who: 'zoe',    text: 'Ich hab heute Morgen meine E-Mails im Café gecheckt.' },
      { who: 'ben',    text: '...hattest du VPN?' },
      { who: 'zoe',    text: 'Ich hatte... Kaffee.' },
      { who: 'luke',   text: 'Zoe. Wir reden danach.' },
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
    delay: 3000,
    banter: [
      { who: 'mia',  text: 'Kevin macht wirklich den besten Cortado. Nur zur Protokollierung.' },
      { who: 'luke', text: 'Mia.', delay: 1200 },
      { who: 'mia',  text: 'Ich notiere es für Zoe.', delay: 800 },
      { who: 'zoe',  text: 'Ich hab es schon notiert.', delay: 1000 }
    ]
  },
  {
    after: 'network_analysis',
    delay: 3000,
    banter: [
      { who: 'ben',  text: 'Evil Twin. So simpel. So effektiv.' },
      { who: 'luke', text: 'Das ärgert dich.', delay: 1500 },
      { who: 'ben',  text: 'Dass sowas noch funktioniert? Ja.', delay: 1800 },
      { who: 'luke', text: 'Es funktioniert weil Geräte dem stärksten Signal vertrauen ohne zu fragen wessen es ist.', delay: 2000 },
      { who: 'ben',  text: 'Menschen sind... ich mag Router mehr als Menschen.', delay: 1800 },
      { who: 'mia',  text: 'Das wissen wir, Ben.', delay: 1000 }
    ]
  },
  {
    after: 'traffic_capture',
    delay: 2500,
    banter: [
      { who: 'zoe',  text: 'Ich hab heute Morgen kurz meine E-Mails im Café gecheckt.' },
      { who: 'ben',  text: 'Hattest du VPN?', delay: 1000 },
      { who: 'zoe',  text: '...was ist VPN?', delay: 1500 },
      { who: 'ben',  text: '(tief einatmen)', delay: 2000 },
      { who: 'luke', text: 'Zoe. Wir reden danach.', delay: 1200 }
    ]
  },
  {
    after: 'victims',
    delay: 3000,
    banter: [
      { who: 'mia',  text: 'Ich muss Leuten sagen dass ihre Konten möglicherweise kompromittiert sind.' },
      { who: 'ben',  text: 'Ja.', delay: 1000 },
      { who: 'mia',  text: 'Das ist das Schlechteste an diesem Job.', delay: 2000 },
      { who: 'zoe',  text: 'Aber wir sagen es. Das ist besser als nicht wissen.', delay: 2000 },
      { who: 'mia',  text: '...ja. Stimmt.', delay: 1500 }
    ]
  },
  {
    after: 'find_attacker',
    delay: 4000,
    banter: [
      { who: 'ben',  text: 'Raspberry Pi 4, 8GB schätz ich. Alfa-Adapter mit externer Antenne. Hostapd-Config vermutlich auf einer SD-Karte...' },
      { who: 'luke', text: 'Ben.', delay: 1000 },
      { who: 'ben',  text: 'Ich bewundere die Technik. Nicht den Einsatz.', delay: 1500 },
      { who: 'zoe',  text: 'Ist das ein Unterschied?', delay: 1800 },
      { who: 'ben',  text: 'Für mich schon.', delay: 1000 },
      { who: 'luke', text: 'Für das Gericht nicht.', delay: 1500 }
    ]
  },
  {
    after: 'damage_control',
    delay: 2500,
    who: 'mia',
    text: 'Kevin gibt uns zwei Cortados auf Haus. Das ist das Mindeste.'
  },
  {
    after: 'prevention',
    delay: 3000,
    banter: [
      { who: 'ben',  text: 'R2-D2 hat übrigens WPA3 und einen eingebauten Rogue AP-Detektor.' },
      { who: 'mia',  text: 'Ist R2-D2 dein Router?', delay: 1500 },
      { who: 'ben',  text: 'R2-D2 ist meine Sicherheitszentrale.', delay: 1200 },
      { who: 'luke', text: 'R2-D2 ist ein Gerät.', delay: 1500 },
      { who: 'ben',  text: 'R2-D2 ist MEIN Gerät.', delay: 800 }
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
    { who: 'system', text: '✅ FALL #005 ABGESCHLOSSEN' },
    { who: 'ben',    text: 'Kevins WLAN ist jetzt sicher. WPA2-Enterprise. Rogue AP-Detection läuft.' },
    { who: 'mia',    text: 'Alle 12 Betroffenen wurden informiert. 9 haben ihre Passwörter bereits geändert.' },
    { who: 'zoe',    text: 'Der Fall ist dokumentiert. Ich hab auch die technische Konfiguration des Raspberry Pi aufgeschrieben – als Referenz.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'mia',    text: 'Und Kevin gibt uns eine Woche lang kostenlosen Cortado. Berufliche Vorteile.' },
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
    <p>Evil Twin Attack im öffentlichen WLAN. 12 Endgeräte betroffen.</p>
    <p>Angreifer nicht identifiziert – aber der Angriff ist gestoppt.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #005 · Fortgeschritten</p>
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
