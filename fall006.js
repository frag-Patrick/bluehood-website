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
      { who: 'system', text: () => `⚡ NEUER FALL // #006 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'luke',   text: 'Ich hab was.' },
      { who: 'mia',    text: 'Guten Morgen auch.' },
      { who: 'luke',   text: 'Wohnblock Mainzerstraße 12. Bitstedt. Hausverwaltung meldet ungewöhnlichen ausgehenden Traffic. Von einem Gerät das dort eigentlich nur Gebäudesysteme steuern soll.' },
      { who: 'ben',    text: 'Was für Traffic?' },
      { who: 'luke',   text: 'Klein. Regelmäßig. Alle 6 Stunden. Kein Alarm ausgelöst.' },
      { who: 'ben',    text: 'Absichtlich klein gehalten.' },
      { who: 'luke',   text: 'Das denk ich auch.' },
      { who: 'zoe',    text: 'Wie lange geht das schon so?' },
      { who: 'luke',   text: 'Das finden wir jetzt raus.' },
      { who: 'mia',    text: 'Das klingt nicht gut.' },
      { who: 'luke',   text: 'Nein.' },
    ],
    choices: [
      { text: '🔍 Das Gerät identifizieren',        next: 'device_id'    },
      { text: '📡 Den Traffic analysieren',          next: 'traffic_analysis' },
      { text: '📋 System-Logs prüfen',              next: 'logs_analysis' },
    ]
  },

  device_id: {
    messages: [
      { who: 'player', text: 'Das Gerät identifizieren.' },
      { who: 'ben',    text: 'Ich hab es gefunden.' },
      { who: 'ben',    text: '<span class="ep-hl">TechBuild Pro SmartController v2</span> – ein Building Automation System. Steuert: Zugangskontrolle, Aufzug-Management, Heizung, Parkplatz-Schranken.' },
      { who: 'ben',    text: 'Firmware: <span class="ep-red">v2.1.0, März 2021</span>. Letzte Verbindung zum Update-Server: <span class="ep-red">nie</span>.' },
      { who: 'zoe',    text: 'Was ist ein Building Automation System?' },
      { who: 'ben',    text: 'Steuert alles Physische im Gebäude. Türen, Licht, Heizung, Aufzüge.' },
      { who: 'zoe',    text: 'Und das ist mit dem Internet verbunden?' },
      { who: 'ben',    text: 'Ja.' },
      { who: 'zoe',    text: 'Muss das sein?' },
      { who: 'luke',   text: 'Nein. Aber es ist bequem. Und Bequemlichkeit ist oft der Feind der Sicherheit.' },
    ],
    clue: 0,
    choices: [
      { text: '🛡️ Bekannte Schwachstellen prüfen',   next: 'cve_check'     },
      { text: '📋 System-Logs analysieren',           next: 'logs_analysis' },
    ]
  },

  traffic_analysis: {
    messages: [
      { who: 'player', text: 'Den ausgehenden Traffic analysieren.' },
      { who: 'luke',   text: 'Verbindungsziel: <span class="ep-red">45.153.204.87</span>. Gehört zu keinem bekannten Dienst.' },
      { who: 'luke',   text: 'Timing: alle 6 Stunden. Payload: klein, verschlüsselt. User-Agent: <span class="ep-red">"Mozilla/5.0 (compatible; UpdateCheck/2.1)"</span> – das ist kein Browser.' },
      { who: 'ben',    text: 'Das ist ein Beacon. Das Gerät meldet sich bei jemandem. Regelmäßig.' },
      { who: 'mia',    text: 'Wie ein Herzschlag.' },
      { who: 'luke',   text: 'Genau. C2-Kommunikation. Command and Control.' },
      { who: 'zoe',    text: 'Das Gerät steht also unter fremder Kontrolle?' },
      { who: 'luke',   text: 'Sehr wahrscheinlich. Wir müssen die Logs sehen.' },
    ],
    choices: [
      { text: '🔍 Das Gerät identifizieren',         next: 'device_id'     },
      { text: '📋 System-Logs prüfen',               next: 'logs_analysis' },
    ]
  },

  cve_check: {
    messages: [
      { who: 'player', text: 'Bekannte Schwachstellen für dieses Gerät prüfen.' },
      { who: 'luke',   text: 'Ich such in der CVE-Datenbank.' },
      { who: 'luke',   text: '<span class="ep-red">CVE-2022-38153</span>: Authenticated Remote Code Execution in TechBuild Pro SmartController v2.1.x. CVSS Score: <span class="ep-red">9.8</span>. Kritisch.' },
      { who: 'luke',   text: 'Gepatcht in v2.3.0. Veröffentlicht: September 2022. Das Gerät hat nie geupdated.' },
      { who: 'ben',    text: 'Standard-Credentials: techbuild/techbuild. Nicht geändert.' },
      { who: 'luke',   text: 'Mit diesen Credentials und dieser CVE kann man remote beliebigen Code ausführen. Als SYSTEM.' },
      { who: 'ben',    text: 'Das ist keine Schwachstelle. Das ist eine Einladung.' },
    ],
    clue: 1,
    choices: [
      { text: '🔎 Wurde die Schwachstelle ausgenutzt?', next: 'logs_analysis' },
      { text: '📋 System-Logs direkt analysieren',      next: 'logs_analysis' },
    ]
  },

  logs_analysis: {
    messages: [
      { who: 'player', text: 'Die System-Logs des Geräts analysieren.' },
      { who: 'luke',   text: 'Ich hab Zugriff auf die Logs.' },
      { who: 'luke',   text: 'Erster unbekannter Login: <span class="ep-red">vor 14 Monaten. 03:47 Uhr.</span>' },
      { who: 'luke',   text: 'Seitdem: periodisches Beaconing alle 6 Stunden zu 45.153.204.87. Verschlüsseltes C2-Protokoll. Base64-kodiert.' },
      { who: 'luke',   text: '...' },
      { who: 'luke',   text: 'Das ist <span class="ep-red">Rocksodid</span>.' },
      { who: 'mia',    text: 'Du klingst sehr sicher.' },
      { who: 'luke',   text: 'Ich bin es. Die Signatur. Das Protokoll. Die IP. Das sind ihre Tools.' },
    ],
    clue: 2,
    choices: [
      { text: '🗺️ Was haben sie im System getan?',  next: 'extent'    },
      { text: '❓ Wer ist Rocksodid?',               next: 'rocksodid' },
    ]
  },

  rocksodid: {
    messages: [
      { who: 'player', text: 'Wer ist Rocksodid?' },
      { who: 'luke',   text: 'Eine bekannte APT-Gruppe. Advanced Persistent Threat.' },
      { who: 'luke',   text: 'Fokus: kritische Infrastruktur. Nicht auf schnellen Gewinn aus – auf Persistenz. Auf Lageaufklärung. Die wollen wissen wie Gebäude, Netzwerke, Systeme aufgebaut sind.' },
      { who: 'luke',   text: 'Bisher gesehen in: Energiesektor. Wohnimmobilien. Öffentliche Verkehrsmittel.' },
      { who: 'mia',    text: 'Hab ich den Namen schon mal gehört?' },
      { who: 'luke',   text: 'Vielleicht.' },
      { who: 'ben',    text: 'Das ist keine beruhigende Antwort.' },
      { who: 'luke',   text: 'Nein. Wir werden mehr über Rocksodid hören. Das hier ist nicht ihr letzter Fall.' },
      { who: 'zoe',    text: 'Ich schreib alles auf. Wirklich alles.' },
      { who: 'luke',   text: 'Gut.' },
    ],
    choices: [
      { text: '🗺️ Was haben sie im System getan?', next: 'extent' },
    ]
  },

  extent: {
    messages: [
      { who: 'player', text: 'Was haben sie in 14 Monaten im System getan?' },
      { who: 'luke',   text: 'Aus den Command-History-Logs:' },
      { who: 'luke',   text: '1. <span class="ep-red">Zugangsdaten-Dump</span> des Active Directory Connectors. Alle Nutzerkonten des Gebäudemanagementsystems.' },
      { who: 'luke',   text: '2. <span class="ep-red">Vollständige Kartierung</span> des internen Gebäudenetzwerks. Jedes Gerät, jede Verbindung.' },
      { who: 'luke',   text: '3. <span class="ep-red">14 Monate Bewegungsdaten</span> der Bewohner. Zugangslogs, Aufzugsnutzung, Schrankenprotokolle.' },
      { who: 'ben',    text: 'Physische Konsequenzen aus einem digitalen Angriff. Türen hätten sich öffnen lassen. Schranken. Aufzüge.' },
      { who: 'mia',    text: 'Echte Menschen wohnen da.' },
      { who: 'luke',   text: 'Ja.' },
    ],
    clue: 3,
    choices: [
      { text: '🛡️ Wie reagieren wir?',              next: 'response'   },
      { text: '💡 Wie verhindert man das?',          next: 'prevention' },
    ]
  },

  response: {
    messages: [
      { who: 'player', text: 'Wie reagieren wir jetzt?' },
      { who: 'luke',   text: '1. <span class="ep-hl">Gerät sofort vom Netz trennen.</span> C2-Verbindung unterbrechen.' },
      { who: 'ben',    text: '2. <span class="ep-hl">Forensische Kopie</span> des Systems vor dem Patchen. Beweise sichern.' },
      { who: 'luke',   text: '3. <span class="ep-hl">Alle physischen Zugangslogs</span> der letzten 14 Monate auswerten. Was haben sie gesehen?' },
      { who: 'mia',    text: '4. <span class="ep-hl">Bewohner informieren.</span> Direkt. Klar. Heute.' },
      { who: 'luke',   text: '5. <span class="ep-hl">BSI-Meldepflicht</span>. Das ist ein APT-Angriff auf physische Infrastruktur. Das muss gemeldet werden.' },
      { who: 'ben',    text: '6. Alle Credentials in diesem Netz rotieren. Alle. Sofort.' },
    ],
    choices: [
      { text: '💡 Wie verhindert man das in Zukunft?', next: 'prevention' },
      { text: '✅ Fall abschließen',                    next: 'end'        },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Wie verhindert man solche Angriffe?' },
      { who: 'luke',   text: 'Vier Grundregeln. Keine Empfehlungen – Grundvoraussetzungen.' },
      { who: 'luke',   text: '1. <span class="ep-hl">Patch-Management-Policy.</span> Kritische Systeme monatlich prüfen. Firmware-Updates sind keine Option.' },
      { who: 'ben',    text: '2. <span class="ep-hl">Asset-Inventar.</span> Wissen was im Netz ist. Jedes Gerät. Mit Version, Hersteller, Letztem Update.' },
      { who: 'luke',   text: '3. <span class="ep-hl">Netzwerk-Segmentierung.</span> Das BMS darf nicht im selben Segment wie Internet-Zugang liegen.' },
      { who: 'ben',    text: '4. <span class="ep-hl">Standard-Credentials sofort ändern.</span> Bei Inbetriebnahme. Immer. Ohne Ausnahme.' },
      { who: 'zoe',    text: 'Das klingt nach viel Arbeit.' },
      { who: 'luke',   text: '14 Monate kompromittiert zu sein klingt nach mehr.' },
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
      { who: 'luke', text: 'Kleiner regelmäßiger Traffic. Kein Burst. Kein Alarm.' },
      { who: 'ben',  text: 'Absichtlich klein gehalten.', delay: 2000 },
      { who: 'luke', text: 'Ja. Jemand weiß was er tut.', delay: 1800 },
      { who: 'mia',  text: 'Das klingt nicht gut.', delay: 1000 },
      { who: 'luke', text: 'Nein.', delay: 600 }
    ]
  },
  {
    after: 'device_id',
    delay: 3000,
    banter: [
      { who: 'zoe',  text: 'Ein Gebäudemanagement-System. Mit Internetzugang. Seit 2021 ohne Update.' },
      { who: 'ben',  text: 'Ja.', delay: 1000 },
      { who: 'zoe',  text: 'Wer ist dafür verantwortlich?', delay: 1800 },
      { who: 'ben',  text: 'Hausverwaltung. Hersteller. Eigentlich beide.', delay: 2000 },
      { who: 'zoe',  text: 'Hat die Hausverwaltung das gewusst?', delay: 1800 },
      { who: 'luke', text: 'Nein. Dafür gibt es kein Asset-Inventar.', delay: 1500 },
      { who: 'ben',  text: 'Bequemlichkeit ist der Feind der Sicherheit.', delay: 1800 }
    ]
  },
  {
    after: 'cve_check',
    delay: 2500,
    banter: [
      { who: 'zoe',  text: 'CVE – was bedeutet das genau?' },
      { who: 'luke', text: 'Common Vulnerabilities and Exposures. Eine öffentliche Datenbank für bekannte Schwachstellen.', delay: 2500 },
      { who: 'zoe',  text: 'Also die Schwachstelle war öffentlich bekannt?', delay: 1800 },
      { who: 'luke', text: 'Seit September 2022.', delay: 800 },
      { who: 'zoe',  text: 'Und trotzdem kein Update.', delay: 1000 },
      { who: 'ben',  text: 'Genau.', delay: 600 }
    ]
  },
  {
    after: 'logs_analysis',
    delay: 2000,
    banter: [
      { who: 'mia',  text: 'Rocksodid... das klingt wie ein Bandname.' },
      { who: 'luke', text: 'Es ist eine APT-Gruppe.', delay: 1500 },
      { who: 'ben',  text: 'Eine sehr professionelle APT-Gruppe.', delay: 1800 },
      { who: 'zoe',  text: 'Ich schreib alles auf. Wirklich alles.', delay: 2000 },
      { who: 'luke', text: 'Gut.', delay: 800 }
    ]
  },
  {
    after: 'extent',
    delay: 3000,
    banter: [
      { who: 'ben',  text: '14 Monate.' },
      { who: 'mia',  text: 'Ohne dass es jemand gemerkt hat.', delay: 1500 },
      { who: 'ben',  text: 'Ohne dass es jemand gemerkt hat.', delay: 500 },
      { who: 'zoe',  text: 'Die Bewohner... wissen die was gerade passiert?', delay: 2000 },
      { who: 'mia',  text: 'Noch nicht.', delay: 1200 },
      { who: 'luke', text: 'Wir sagen es ihnen.', delay: 1500 }
    ]
  },
  {
    after: 'rocksodid',
    delay: 3000,
    who: 'zoe',
    text: 'Ich frag mich ob wir Rocksodid nochmal begegnen werden. Irgendwie. In einem anderen Fall.'
  },
  {
    after: 'response',
    delay: 3500,
    banter: [
      { who: 'mia',  text: 'Das ist das erste Mal dass wir einen Fall haben mit... wirklich gefährlichen physischen Konsequenzen.' },
      { who: 'luke', text: 'Nicht das letzte.', delay: 2000 },
      { who: 'mia',  text: 'Das dacht ich mir.', delay: 1500 },
      { who: 'ben',  text: 'Deswegen ist Sicherheit kein IT-Problem. Es ist ein Gesellschaftsproblem.', delay: 2500 },
      { who: 'zoe',  text: 'Das zitier ich in meinem Bericht.', delay: 1800 }
    ]
  },
  {
    after: 'prevention',
    delay: 2500,
    banter: [
      { who: 'ben',  text: 'R2-D2 hat übrigens ein vollständiges Asset-Inventar. Von sich selbst.' },
      { who: 'mia',  text: 'R2-D2 führt Buch über sich selbst?', delay: 1500 },
      { who: 'ben',  text: 'R2-D2 ist sehr selbstbewusst.', delay: 1200 },
      { who: 'luke', text: 'Das ist ein Router, Ben.', delay: 1500 },
      { who: 'ben',  text: 'Du kennst R2-D2 nicht.', delay: 800 }
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
    { who: 'system', text: '✅ FALL #006 ABGESCHLOSSEN' },
    { who: 'luke',   text: 'Gerät ist isoliert. Forensische Kopie gesichert. BSI wurde informiert.' },
    { who: 'ben',    text: 'Firmware ist auf v2.3.0 aktualisiert. Credentials rotiert. Netzwerk-Segmentierung läuft.' },
    { who: 'mia',    text: 'Bewohner wurden informiert. Es war... kein einfaches Gespräch.' },
    { who: 'zoe',    text: 'Ich hab alles dokumentiert. Rocksodid-Signatur, C2-Infrastruktur, Ausmaß. Das geht ans BSI.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'luke',   text: 'Wir werden Rocksodid wiedersehen.' },
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
    <p>APT-Angriff (Rocksodid) über ungepatchte CVE-2022-38153.</p>
    <p>14 Monate Persistenz. Physische Infrastruktur eines Wohnblocks betroffen.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #006 · Fortgeschritten</p>
    <p style="margin-top:16px; font-size:13px; color:var(--muted);">Trag dich in den Newsletter ein für neue Folgen.</p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
      <a href="faelle.html" class="ep-restart-btn">← Zurück zu den Fällen</a>
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
