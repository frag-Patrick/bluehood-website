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
      { who: 'system', text: () => `⚡ NEUER FALL // #002 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'mia',    text: 'Leute. Sandra hat gerade angerufen.' },
      { who: 'ben',    text: 'Deine Nachbarin?' },
      { who: 'mia',    text: 'Ja. Irgendwas mit ihrer Bank. Sie klingt ziemlich aufgewühlt.' },
      { who: 'zoe',    text: 'Was ist passiert?' },
      { who: 'mia',    text: 'Sie hat eine Mail von ihrer Sparkasse bekommen. "Konto gesperrt, bitte hier klicken." Und... sie hat geklickt.' },
      { who: 'luke',   text: 'Wann.' },
      { who: 'mia',    text: 'Vor einer Stunde. Sie ruft mich an weil sie jetzt Angst hat.' },
      { who: 'ben',    text: 'Eine Stunde. Okay. Das schauen wir uns an.' },
      { who: 'luke',   text: 'Schick mir die Mail.' },
    ],
    choices: [
      { text: '📧 E-Mail-Header analysieren',              next: 'email_header' },
      { text: '🔗 Den Link untersuchen',                   next: 'link_check'   },
      { text: '📞 Sandra fragen was passiert ist',         next: 'ask_sandra'   },
    ]
  },

  email_header: {
    messages: [
      { who: 'player', text: 'Erstmal den E-Mail-Header analysieren.' },
      { who: 'luke',   text: 'Absender-Adresse: <span class="ep-red">no-reply@sparkasse-kontoservice.net</span>' },
      { who: 'luke',   text: 'Nicht sparkasse.de. Reply-To zeigt auf eine dritte Domain. SPF-Check: <span class="ep-red">FAIL</span>.' },
      { who: 'ben',    text: 'Jede echte Sparkasse-Mail kommt von @sparkasse.de. Das hier ist ein Bastelladen.' },
      { who: 'mia',    text: 'Aber es sieht SO aus wie eine echte Sparkasse-Mail. Schrift, Logo, alles.' },
      { who: 'zoe',    text: 'Kann man so einfach fremde E-Mail-Adressen faken?' },
      { who: 'luke',   text: 'Ja. Das nennt sich <span class="ep-hl">E-Mail-Spoofing</span>. Der Anzeigename ist frei wählbar.' },
    ],
    clue: 0,
    choices: [
      { text: '🔗 Den Link jetzt analysieren',         next: 'link_check'   },
      { text: '📞 Sandra fragen was sie getan hat',   next: 'ask_sandra'   },
    ]
  },

  link_check: {
    messages: [
      { who: 'player', text: 'Den Link in der Mail genauer anschauen.' },
      { who: 'luke',   text: 'Domain: <span class="ep-red">sparkasse-kontoservice.net</span> – registriert vor 4 Tagen. Registrar: Panama.' },
      { who: 'ben',    text: 'Vier. Tage. Alt.' },
      { who: 'luke',   text: 'Kein gültiges SSL-Zertifikat für die Sparkasse. IP gehört zu einem Bulletproof-Hoster in Osteuropa.' },
      { who: 'mia',    text: 'Ich hätte fast selbst drauf geklickt, so echt sieht das aus.' },
      { who: 'zoe',    text: 'Was macht eine Phishing-Seite genau wenn man draufklickt?' },
      { who: 'luke',   text: 'Sie zeigt dir ein Login-Formular. Du gibst deine Daten ein. Sie speichert sie.' },
    ],
    clue: 1,
    choices: [
      { text: '🖥️ Die Fake-Seite untersuchen',              next: 'fake_page'  },
      { text: '📞 Sandra fragen was sie eingegeben hat',   next: 'ask_sandra' },
    ]
  },

  ask_sandra: {
    messages: [
      { who: 'player', text: 'Ich frag Sandra direkt.' },
      { who: 'mia',    text: 'Ich hab sie schon angerufen. Hör zu.' },
      { who: 'mia',    text: 'Sandra sagt: <span class="ep-hl">"Ja, ich hab draufgeklickt. Da war so ein Eingabefeld. Ich hab meinen Namen eingegeben und wollte mein Passwort eintippen – aber dann dacht ich: nee, irgendwas stimmt da nicht. Und hab aufgehört."</span>' },
      { who: 'ben',    text: 'Gut. Sehr gut.' },
      { who: 'mia',    text: 'Das Bauchgefühl hat sie gerettet.' },
      { who: 'luke',   text: 'Fast. Ihren Benutzernamen haben sie. Das ist nicht nichts.' },
      { who: 'zoe',    text: 'Aber kein Passwort. Ist das nicht okay dann?' },
      { who: 'luke',   text: 'Kommt drauf an. Lass uns die Seite genauer untersuchen.' },
    ],
    choices: [
      { text: '🖥️ Fake-Seite untersuchen',                   next: 'fake_page'   },
      { text: '⚠️ Wie schlimm ist es ohne Passwort?',        next: 'fake_page'   },
    ]
  },

  fake_page: {
    messages: [
      { who: 'player', text: 'Die Fake-Seite genauer untersuchen.' },
      { who: 'luke',   text: 'Ich hab sie in einer Sandbox geöffnet.' },
      { who: 'luke',   text: 'Pixel-perfekte Kopie der echten Sparkasse-Website. Screenshot-basiertes Cloning. Das Formular sendet POST-Requests an <span class="ep-red">collect.sparkasse-kontoservice.net</span>.' },
      { who: 'ben',    text: 'Die haben buchstäblich den HTML-Quellcode der echten Seite kopiert. Dauert 5 Minuten.' },
      { who: 'mia',    text: 'Kann man das nicht irgendwie stoppen?' },
      { who: 'luke',   text: 'Browser-Warnungen helfen. Aber wenn man sie wegklickt...' },
      { who: 'zoe',    text: 'Dann ist man Sandra.' },
      { who: 'mia',    text: 'Zoe!' },
      { who: 'zoe',    text: 'Ich mein... dann kann es jedem passieren.' },
    ],
    clue: 2,
    choices: [
      { text: '🕵️ Wer steckt hinter dieser Kampagne?',   next: 'who_built_it'    },
      { text: '🛡️ Was muss Sandra jetzt tun?',            next: 'damage_control'  },
    ]
  },

  who_built_it: {
    messages: [
      { who: 'player', text: 'Wer steckt hinter dieser Phishing-Kampagne?' },
      { who: 'luke',   text: 'Industrialisiertes Phishing. Das ist kein Einzeltäter.' },
      { who: 'luke',   text: 'Über <span class="ep-hl">200 ähnliche Domains</span> in den letzten 30 Tagen registriert. Gleiches Template, gleicher Hoster, gleiche Infrastruktur.' },
      { who: 'ben',    text: 'Die verschicken das vermutlich an Hunderttausende. Sandra hat eine E-Mail von Millionen bekommen.' },
      { who: 'mia',    text: 'Sandra ist nicht das Ziel. Sandra ist eine Zahl.' },
      { who: 'zoe',    text: 'Das ist irgendwie noch schlimmer.' },
      { who: 'luke',   text: 'Ja.' },
    ],
    clue: 3,
    choices: [
      { text: '🛡️ Was muss Sandra jetzt tun?',      next: 'damage_control' },
      { text: '💡 Wie erkennt man Phishing-Mails?', next: 'prevention'     },
    ]
  },

  damage_control: {
    messages: [
      { who: 'player', text: 'Was muss Sandra jetzt tun?' },
      { who: 'mia',    text: 'Ich erklär ihr das. Schritt für Schritt.' },
      { who: 'ben',    text: '1. <span class="ep-hl">Passwort bei der echten Sparkasse ändern</span> – auf sparkasse.de, direkt, nicht über Links.' },
      { who: 'luke',   text: '2. <span class="ep-hl">Bank anrufen</span> und informieren. Die können verdächtige Logins sperren.' },
      { who: 'mia',    text: '3. <span class="ep-hl">Alle anderen Dienste prüfen</span> wo sie denselben Benutzernamen verwendet.' },
      { who: 'zoe',    text: 'Alles?' },
      { who: 'luke',   text: 'Alles.' },
      { who: 'ben',    text: '4. <span class="ep-hl">Antivirus-Scan</span>. Manchmal laden diese Seiten noch was nach.' },
    ],
    choices: [
      { text: '💡 Wie erkennt man Phishing?', next: 'prevention' },
      { text: '✅ Fall abschließen',           next: 'end'        },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Wie erkennt man Phishing-Mails?' },
      { who: 'luke',   text: 'Drei Checks. Immer.' },
      { who: 'luke',   text: 'Check 1: <span class="ep-hl">Absender-Domain</span>. Nicht der Anzeigename – die Domain. @sparkasse.de ist echt. Alles andere nicht.' },
      { who: 'mia',    text: 'Check 2: <span class="ep-hl">Links vor dem Klicken hovern</span>. Die URL unten im Browser zeigt wohin es wirklich geht.' },
      { who: 'ben',    text: 'Check 3: <span class="ep-hl">Banken fragen nie per E-Mail nach Zugangsdaten.</span> Nie. Das ist Policy.' },
      { who: 'zoe',    text: 'Wie erkläre ich das meiner Oma?' },
      { who: 'mia',    text: 'Sag ihr: Wenn die Sparkasse schreibt, ruf einfach an. Die echte Nummer, nicht die in der Mail.' },
      { who: 'zoe',    text: 'Das kann ich ihr erklären.' },
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
      { who: 'mia',  text: 'Sandra macht mir jeden Sonntag Pflaumenkuchen. Das nehm ich persönlich.' },
      { who: 'luke', text: 'Das ist kein professioneller Umgang mit einem Fall.', delay: 2000 },
      { who: 'mia',  text: 'Doch.', delay: 800 }
    ]
  },
  {
    after: 'email_header',
    delay: 2500,
    banter: [
      { who: 'zoe',  text: 'Ich versteh E-Mail-Header nicht. Das sieht aus wie... Hieroglyphen.' },
      { who: 'ben',  text: 'Das sieht für mich aus wie ein Gedicht.', delay: 1800 },
      { who: 'luke', text: 'Für mich wie ein Behördenbrief.', delay: 2000 },
      { who: 'zoe',  text: 'Ich lern das nie.', delay: 1800 }
    ]
  },
  {
    after: 'link_check',
    delay: 2000,
    who: 'ben',
    text: 'Vier Tage. Ich hab Joghurt im Kühlschrank der älter ist.'
  },
  {
    after: 'ask_sandra',
    delay: 2500,
    banter: [
      { who: 'mia',  text: 'Ich bin so stolz auf Sandra.' },
      { who: 'ben',  text: 'Sie hat buchstäblich ihrem Instinkt vertraut.', delay: 2000 },
      { who: 'zoe',  text: 'Das muss man sich merken. Wenn es sich komisch anfühlt – aufhören.', delay: 2000 }
    ]
  },
  {
    after: 'fake_page',
    delay: 4000,
    banter: [
      { who: 'ben',  text: 'Die Qualität dieser Phishing-Seiten wird besser. Jeden Monat.' },
      { who: 'zoe',  text: 'Wie gut ist gut?', delay: 2000 },
      { who: 'luke', text: 'Gut genug dass 3% klicken. 3% von einer Million sind 30.000 Opfer.', delay: 2000 },
      { who: 'mia',  text: '...ich brauch Kaffee.', delay: 2500 }
    ]
  },
  {
    after: 'who_built_it',
    delay: 3000,
    banter: [
      { who: 'zoe',  text: '200 Domains in 30 Tagen. Wie registriert man das?' },
      { who: 'ben',  text: 'Automatisiert. Ein Skript. Fünf Minuten.', delay: 2000 },
      { who: 'zoe',  text: 'Das ist so... unverhältnismäßig.', delay: 2000 },
      { who: 'luke', text: 'Ja.', delay: 800 }
    ]
  },
  {
    after: 'damage_control',
    delay: 3500,
    who: 'mia',
    text: 'Ich ruf Sandra jetzt nochmal an. Sie kriegt auch Kuchen verdient für ihren Instinkt. 🥧'
  },
  {
    after: 'prevention',
    delay: 2500,
    banter: [
      { who: 'ben',  text: 'Ein Freund von mir hat mal auf so einen Link geklickt. IT-Profi.' },
      { who: 'mia',  text: 'Nein.', delay: 1500 },
      { who: 'ben',  text: 'Doch. 3 Uhr nachts, müde, Mail sah legit aus.', delay: 1200 },
      { who: 'luke', text: 'Phishing funktioniert durch Ermüdung und Kontext. Nicht durch Dummheit.', delay: 2000 },
      { who: 'ben',  text: 'Das hab ich ihm auch gesagt.', delay: 1500 }
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
    { who: 'system', text: '✅ FALL #002 ABGESCHLOSSEN' },
    { who: 'mia',    text: 'Sandra ist safe. Ich hab ihr alles erklärt. Sie ändert gerade ihr Passwort.' },
    { who: 'ben',    text: 'Phishing-Domain ist gemeldet. Wird bald abgeschaltet.' },
    { who: 'zoe',    text: 'Ich hab alles dokumentiert. Phishing-Mail, Domain, Kampagne. Für den Bericht.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'mia',    text: 'Sandra schickt uns übrigens Kuchen. Pflaume. 🥧' },
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
    <p>Phishing-Mail über gefälschte Sparkasse-Domain.</p>
    <p>Sandra hat rechtzeitig gestoppt. Ihr Bauchgefühl hat funktioniert.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #002 · Einsteiger</p>
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
