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

// ── Story Script ───────────────────────────────────────────────────────────────
const STORY = {

  start: {
    messages: [
      { who: 'system', text: () => `⚡ EINGEHENDER FALL // #001 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'luke',   text: 'Dieter Hoffmann, 54, Buchhalter. Sein PC ist seit drei Wochen extrem langsam. Der Lüfter läuft dauerhaft auf Maximum. Seine Stromrechnung ist gestiegen.' },
      { who: 'mia',    text: 'Er hat uns geschrieben: <span class="ep-red">"Ich glaub mein PC hat Fieber"</span> 😭' },
      { who: 'ben',    text: 'PC-Fieber. Na klar, ich hoffe er hat ihm noch keinen Wadenwickel verpasst.' },
      { who: 'zoe',    text: 'Ist das häufig? Dass Leute das so beschreiben?' },
      { who: 'luke',   text: 'Oft genug. Fangen wir an.' },
    ],
    choices: [
      { text: '🔍 CPU-Auslastung prüfen',           next: 'cpu' },
      { text: '📡 Netzwerkverbindungen analysieren', next: 'network_early' },
      { text: '💬 Dieter fragen: Was hast du zuletzt installiert?', next: 'ask_dieter' },
    ]
  },

  cpu: {
    messages: [
      { who: 'player', text: 'Erstmal die CPU-Auslastung prüfen.' },
      { who: 'luke',   text: 'Gute Entscheidung. Ich hab mich eben per Anydesk verbunden und kurz reingeschaut.' },
      { who: 'luke',   text: 'CPU: <span class="ep-red">94–98%</span>. Dauerhaft. Dieter schreibt gerade nur eine Excel-Tabelle.' },
      { who: 'ben',    text: '94% für Excel. Normal wären da 2–5%. Da läuft definitiv was im Hintergrund.' },
      { who: 'mia',    text: 'Wie wenn jemand beim Autofahren versucht mit angezogener Handbremse vollgas zu geben.' },
      { who: 'ben',    text: 'Und dann noch versucht zu driften!' },
      { who: 'luke',   text: 'Komischer vergleich..' },
      { who: 'zoe',    text: 'Ähm ja, aber was genau bringt den zum Schwitzen? Können wir sehen welche Prozesse aktiv sind?' },
    ],
    clue: 0,
    choices: [
      { text: '🖥️ Task-Manager öffnen – Prozesse analysieren', next: 'processes' },
      { text: '📡 Netzwerkverbindungen prüfen',                next: 'network' },
      { text: '💬 Dieter fragen was er installiert hat',       next: 'ask_dieter' },
    ]
  },

  network_early: {
    messages: [
      { who: 'player', text: 'Zuerst schauen wir die Netzwerkverbindungen an.' },
      { who: 'luke',   text: 'Direkt ins Netz. Okay..' },
      { who: 'ben',    text: 'Ich hab aber noch keine CPU-Daten. Lass uns das parallel machen.' },
      { who: 'luke',   text: 'Ich hab mich per Anydesk verbunden und schaue nach CPU-Daten... Verdammt, <span class="ep-red">94–98% Auslastung</span> ohne Schwankungen. Das ist nicht normal.. Jetzt können wir die Netzwerkverbindungen prüfen.' },
    ],
    clue: 0,
    choices: [
      { text: '📡 Netzwerkverbindungen prüfen', next: 'network' },
      { text: '🖥️ Erst Prozesse analysieren',         next: 'processes' },
    ]
  },

  ask_dieter: {
    messages: [
      { who: 'player', text: 'Ruft mal Dieter an, was hat er zuletzt installiert?' },
      { who: 'mia',    text: 'Ich übernehm das. Bin in zwei Minuten zurück.' },
      { who: 'system', text: '⏱ Mia telefoniert mit Dieter...' },
      { who: 'mia',    text: 'Okay, Dieter sagt: "Nix, nur so ein kleines PDF-Ding."' },
      { who: 'zoe',    text: '"Kleines PDF-Ding"? Was für ein Ding?' },
      { who: 'mia',    text: '<span class="ep-red">PdfConvert_Pro_Free_FINAL_v2.exe</span> – von einer Seite namens pdf-tools-kostenlos.net' },
      { who: 'ben',    text: '..."FINAL_v2" im Dateinamen. Das ist entweder eine meiner Projekte, von der 5 verschiedene Kopien existieren, oder eine böse Überraschung.' },
      { who: 'luke',   text: 'Klingt verdächtig. Aber erstmal CPU und Prozesse checken um sicher zu gehen.' },
    ],
    choices: [
      { text: '🔍 CPU-Auslastung prüfen',       next: 'cpu' },
      { text: '🖥️ Prozesse analysieren',         next: 'processes' },
      { text: '🕵️ Diese Datei untersuchen',       next: 'file_check' },
    ]
  },

  processes: {
    messages: [
      { who: 'player', text: 'Können wir den Task-Manager aufmachen, um zu sehen, welche Prozesse laufen?' },
      { who: 'luke',   text: 'Ich hab die Liste.' },
      { who: 'luke',   text: 'Alles normal... warte. Da ist was: <span class="ep-red">svchost32_helper.exe</span>. Frisst alleine <span class="ep-red">87% CPU</span>.' },
      { who: 'ben',    text: 'Windows hat einen echten "svchost.exe". Aber "svchost<span class="ep-red">32_helper</span>"? Das ist ein Fake.' },
      { who: 'mia',    text: 'Wie wenn ein Laden "McDonolds" heißt. Auf den ersten Blick normal, auf den zweiten... nope.' },
      { who: 'luke',   text: 'Mia, bleib bei der Sache.' },
      { who: 'zoe',    text: 'Okay, und was macht dieser Prozess genau?' },
    ],
    choices: [
      { text: '📡 Netzwerkverbindungen dieses Prozesses prüfen', next: 'network' },
      { text: '📁 Woher kommt diese Datei?',                    next: 'file_check' },
      { text: '⚙️ Was macht der Prozess genau?',                next: 'what_does_it_do' },
    ]
  },

  network: {
    messages: [
      { who: 'player', text: 'Welche Netzwerkverbindungen laufen gerade?' },
      { who: 'luke',   text: 'Gefunden. <span class="ep-red">svchost32_helper.exe</span> baut alle 30 Sekunden eine Verbindung auf.' },
      { who: 'luke',   text: 'Ziel: <span class="ep-red">185.220.133.7</span>. Das scheint ein Rechenzentrum in Osteuropa zu sein. Niemand dort wartet auf Dieters Excel-Sheets.' },
      { who: 'ben',    text: 'Kleine, regelmäßige Pakete. Fast wie ein Herzschlag. Da versucht jemand nicht aufzufallen, sehr verdächtig.' },
      { who: 'mia',    text: 'Also Dieter schickt automatisch Daten irgendwohin und merkt es nicht. Das ist scheiße.' },
      { who: 'zoe',    text: 'Was genau wird da gesendet?' },
    ],
    clue: 1,
    choices: [
      { text: '⚙️ Was wird gesendet? Prozess genauer analysieren', next: 'what_does_it_do' },
      { text: '📁 Woher kommt die Schadsoftware?',                 next: 'file_check' },
      { text: '🛡️ Wie entfernen wir das?',                         next: 'remove' },
    ]
  },

  file_check: {
    messages: [
      { who: 'player', text: 'Luke, kannst du die Datei PdfConvert_Pro_Free_FINAL_v2.exe genauer untersuchen?' },
      { who: 'luke',   text: 'Ich hab sie analysiert.' },
      { who: 'luke',   text: 'Größe: <span class="ep-red">47 MB</span>. Ein echtes PDF-Tool braucht ~5 MB. Der Rest ist... Bonus-Inhalt.' },
      { who: 'ben',    text: 'Die Seite pdf-tools-kostenlos.net wurde vor 3 Monaten registriert. Die haben kein Impressum. Und der Serverstandort ist unbekannt.' },
      { who: 'mia',    text: 'Das Programm konvertiert tatsächlich PDFs, damit es nicht auffällt. Clever und eklig gleichzeitig.' },
      { who: 'zoe',    text: 'Also war das eine Falle von Anfang an?' },
      { who: 'luke',   text: 'Ja. Das Einfallstor ist klar: <span class="ep-red">gefälschtes Freeware-Tool</span> aus inoffizieller Quelle.' },
    ],
    clue: 2,
    choices: [
      { text: '⚙️ Was macht die Schadsoftware genau?', next: 'what_does_it_do' },
      { text: '🛡️ Wie entfernen wir alles?',           next: 'remove' },
      { text: '🕵️ Wer steckt dahinter?',               next: 'who_did_it' },
    ]
  },

  what_does_it_do: {
    messages: [
      { who: 'player', text: 'Was macht dieser Prozess eigentlich genau?' },
      { who: 'luke',   text: 'Dieters PC schürft <span class="ep-hl">Kryptowährung</span>. Monero. Für jemand anderen.' },
      { who: 'ben',    text: 'Sein Prozessor rechnet rund um die Uhr "Hashes" – mathematische Aufgaben. Das Ergebnis: jemand anderes verdient digitales Geld.' },
      { who: 'mia',    text: 'Dieter zahlt die Stromrechnung. Dieter trägt den kaputten PC. Dieter merkt nichts. Dieter hat verloren.' },
      { who: 'zoe',    text: 'Wie nennt man das?' },
      { who: 'luke',   text: '<span class="ep-hl">Cryptojacking.</span> Sein PC ist unfreiwillig Teil eines Mining-Pools. Die Pakete nach außen sind die Mining-Ergebnisse.' },
    ],
    clue: 3,
    choices: [
      { text: '🕵️ Wer steckt dahinter?',     next: 'who_did_it' },
      { text: '🛡️ Wie entfernen wir das?',   next: 'remove' },
      { text: '💡 Hätte man das verhindern können?', next: 'prevention' },
    ]
  },

  who_did_it: {
    messages: [
      { who: 'player', text: 'Wer steckt hinter dem Angriff?' },
      { who: 'luke',   text: 'IP zurückverfolgt. Anonymer Mining-Pool. Keine Namen, keine Gesichter.' },
      { who: 'luke',   text: 'Das Muster ist bekannt. Organisierte Gruppen verteilen gefälschte Freeware massenhaft.' },
      { who: 'ben',    text: 'Dieter wurde nicht gezielt ausgesucht. Er hat auf das falsche Google-Ergebnis geklickt.' },
      { who: 'mia',    text: 'Das ist eigentlich das Gruseligste daran. Kein Mensch hat Dieter ausgewählt. Ein Skript hat ihn gefunden.' },
      { who: 'zoe',    text: 'Also könnte das jedem passieren?' },
      { who: 'luke',   text: 'Jedem der nicht weiß worauf er achten muss. Genau deswegen sitzen wir hier.' },
    ],
    choices: [
      { text: '🛡️ Wie entfernen wir die Schadsoftware?',   next: 'remove' },
      { text: '💡 Hätte man das verhindern können?', next: 'prevention' },
    ]
  },

  remove: {
    messages: [
      { who: 'player', text: 'Wie entfernen wir das alles?' },
      { who: 'ben',    text: 'Ich übernehm das. Step by step.' },
      { who: 'ben',    text: '1. <span class="ep-hl">Netzwerk trennen.</span> Sofort. Damit der Mining-Pool keine neuen Aufgaben schickt.' },
      { who: 'ben',    text: '2. <span class="ep-hl">svchost32_helper.exe im Task-Manager beenden.</span> Rechtsklick → Task beenden.' },
      { who: 'luke',   text: '3. <span class="ep-hl">Antivirus-Scan</span> mit aktuellen Signaturen. Malwarebytes Free reicht für den Anfang.' },
      { who: 'ben',    text: '4. <span class="ep-hl">PdfConvert_Pro_Free_FINAL_v2.exe deinstallieren</span> und alle Dateien manuell löschen.' },
      { who: 'mia',    text: '5. <span class="ep-hl">Passwörter ändern.</span> Alle. Wir wissen nicht was sonst noch mitgelesen wurde.' },
      { who: 'zoe',    text: '6. Und dann?' },
      { who: 'luke',   text: '6. <span class="ep-hl">Echtes Windows-Update</span> durchführen. Danach neu starten. Dieter sollte wieder normal arbeiten können.' },
    ],
    choices: [
      { text: '💡 Hätte man das verhindern können?', next: 'prevention' },
      { text: '✅ Fall abschließen',                  next: 'end' },
    ]
  },

  prevention: {
    messages: [
      { who: 'player', text: 'Hätte man das verhindern können?' },
      { who: 'luke',   text: 'Komplett. Mit drei Regeln.' },
      { who: 'luke',   text: 'Regel 1: <span class="ep-hl">Software nur aus offiziellen Quellen.</span> Adobe.com, nicht adobe-gratis-download.net.' },
      { who: 'mia',    text: 'Regel 2: <span class="ep-hl">Antivirus aktiv und aktuell.</span> Der hätte die Datei beim Download schon geblockt.' },
      { who: 'ben',    text: 'Regel 3: <span class="ep-hl">Komische Dateinamen = Warnsignal.</span> "FINAL_v2" in einem Dateinamen ist kein gutes Zeichen.' },
      { who: 'zoe',    text: 'Das klingt so einfach. Warum wissen das so wenige?' },
      { who: 'mia',    text: 'Weil es niemand erklärt. Deswegen sind wir hier.' },
    ],
    choices: [
      { text: '✅ Fall abschließen', next: 'end' },
    ]
  },

  end: { final: true }
};

// ── Ambient Dialogue System ────────────────────────────────────────────────────
// Erscheinen NACH Ende einer Szene, parallel zu den Choices (nicht blockierend)
const ambientMessages = [
  // ── Nach 'start' ──────────────────────────────────────────────────────────
  {
    after: 'start',
    delay: 1100,
    who: 'mia',
    text: 'Nebenbei – heute morgen bin ich fast in nen Typen reingefahren der sein Passwort auf nem Post-it am Laptop hatte. IN DER U-BAHN. 🛴'
  },
  {
    after: 'start',
    delay: 1500,
    who: 'ben',
    text: 'Fun fact: (mein Router) läuft seit 847 Tagen ohne Neustart. Erwähne ich nur weil Dieter seinen PC wahrscheinlich nie neu gestartet hat.'
  },

  // ── BANTER 1 – nach 'cpu' ─────────────────────────────────────────────────
  {
    after: 'cpu',
    delay: 2500,
    banter: [
      { who: 'mia',  text: 'Luke, erkläre mir Cryptojacking als wäre ich 5.' },
      { who: 'luke', text: 'Jemand benutzt Dieters Spielzeug ohne zu fragen. Und Dieter zahlt die Batterien.', delay: 2500 },
      { who: 'mia',  text: '...das war gut. Respekt.', delay: 2000 }
    ]
  },

  // ── Nach 'ask_dieter' ─────────────────────────────────────────────────────
  {
    after: 'ask_dieter',
    delay: 2000,
    who: 'ben',
    text: 'Ich löte gerade nebenbei. Fragt nicht.'
  },
  {
    after: 'ask_dieter',
    delay: 5500,
    who: 'zoe',
    text: 'Darf ich fragen wie alt Dieter ist? Ich frag mich ob das was mit Medienkompetenz in der Schule zu tun hat.'
  },

  // ── Nach 'network_early' ──────────────────────────────────────────────────
  {
    after: 'network_early',
    delay: 2500,
    who: 'zoe',
    text: 'Warte ich schreib das kurz auf – "CPU-Last als erster Indikator" – das wär ein guter Artikel-Einstieg 📓'
  },
  // ── BANTER ZOE-Unterbrechung – nach 'network_early' ──────────────────────
  {
    after: 'network_early',
    delay: 2000,
    banter: [
      { who: 'zoe',  text: 'Warte ich schreib das kurz auf–' },
      { who: 'mia',  text: 'ZOE!', delay: 600 },
      { who: 'ben',  text: 'Zoe!', delay: 400 },
      { who: 'luke', text: 'Zoe.', delay: 200 },
      { who: 'zoe',  text: 'Okay okay sorry 😅', delay: 200 },
      { who: 'luke', text: '...aber schreib es danach auf. Das ist wichtig.', delay: 1000 }
    ]
  },

  // ── BANTER 4 – nach 'processes' ───────────────────────────────────────────
  {
    after: 'processes',
    delay: 2000,
    banter: [
      { who: 'zoe',  text: 'Okay aber warum nennen die ihre Malware fast wie echte Windows-Prozesse?' },
      { who: 'ben',  text: 'Damit Leute wie Dieter nicht misstrauisch werden.', delay: 2000 },
      { who: 'zoe',  text: 'Das ist... eigentlich ziemlich clever. In einer ekligen Art.', delay: 2000 },
      { who: 'luke', text: 'Social Engineering auf Dateiebene.', delay: 1500 }
    ]
  },

  // ── BANTER 3 – nach 'network' ─────────────────────────────────────────────
  {
    after: 'network',
    delay: 2000,
    banter: [
      { who: 'mia',  text: 'Ich könnt den Mining-Pool auch einfach anrufen und fragen ob sie aufhören 😂' },
      { who: 'luke', text: 'Das würde nicht funktionieren.', delay: 2000 },
      { who: 'mia',  text: 'Luke. Ich weiß. Das war ein Witz.', delay: 1500 },
      { who: 'luke', text: '...', delay: 1000 }
    ]
  },

  // ── BANTER 2 – nach 'file_check' ──────────────────────────────────────────
  {
    after: 'file_check',
    delay: 2000,
    banter: [
      { who: 'ben', text: '47 MB. Ich wein.' },
      { who: 'zoe', text: 'Ist das viel?', delay: 1800 },
      { who: 'ben', text: 'Das ist mehr als mein erstes Betriebssystem, Zoe.', delay: 2000 },
      { who: 'zoe', text: 'Okay ich glaub ich muss das nicht verstehen um es schlimm zu finden.', delay: 2200 }
    ]
  },

  // ── Nach 'what_does_it_do' ────────────────────────────────────────────────
  {
    after: 'what_does_it_do',
    delay: 2500,
    who: 'mia',
    text: 'Wer Kaffee hat gewinnt. Ich hab Kaffee. Ich gewinne. ☕'
  },
  {
    after: 'what_does_it_do',
    delay: 5000,
    who: 'luke',
    text: 'Mia, das ist übrigens kein Virus. Ein Virus repliziert sich. Das ist ein Trojaner.'
  },
  // ── BANTER Strand-Witz – nach 'what_does_it_do' ───────────────────────────
  {
    after: 'what_does_it_do',
    delay: 8500,
    banter: [
      { who: 'ben',  text: 'Warum mögen Hacker keine Strände? Zu viele Shells. 🦀' },
      { who: 'mia',  text: 'HAHAHAHA', delay: 1200 },
      { who: 'luke', text: '...', delay: 1500 },
      { who: 'zoe',  text: 'Ich... versteh das nicht.', delay: 1800 },
      { who: 'ben',  text: 'Es ist ein Terminal-Witz, Zoe.', delay: 1500 },
      { who: 'zoe',  text: 'Ich versteh das immer noch nicht.', delay: 1500 }
    ]
  },

  // ── BANTER 6 – nach 'who_did_it' ──────────────────────────────────────────
  {
    after: 'who_did_it',
    delay: 2000,
    banter: [
      { who: 'zoe',  text: 'Ich frag mich wie Dieter reagiert wenn wir ihm sagen was passiert ist.' },
      { who: 'mia',  text: 'Er wird fragen ob sein PC jetzt wieder schneller wird.', delay: 2000 },
      { who: 'luke', text: 'Ja.', delay: 1000 },
      { who: 'zoe',  text: 'Das ist irgendwie süß.', delay: 1500 },
      { who: 'ben',  text: 'Das ist irgendwie traurig.', delay: 1800 },
      { who: 'mia',  text: 'Das ist irgendwie beides.', delay: 1500 }
    ]
  },

  // ── BANTER 5 – nach 'remove' ──────────────────────────────────────────────
  {
    after: 'remove',
    delay: 2000,
    banter: [
      { who: 'ben',  text: 'R2-D2 hätte das übrigens geblockt.' },
      { who: 'mia',  text: 'Wer ist R2-D2?', delay: 1800 },
      { who: 'ben',  text: 'Mein Router.', delay: 1000 },
      { who: 'zoe',  text: 'Du hast deinem Router einen Namen gegeben?', delay: 2000 },
      { who: 'ben',  text: 'Wir haben eine Beziehung.', delay: 1200 },
      { who: 'luke', text: 'Ben. Das ist kein normales Verhältnis zu Hardware.', delay: 2000 },
      { who: 'ben',  text: 'Du kennst R2-D2 nicht.', delay: 1200 }
    ]
  },

  // ── Nach 'prevention' ─────────────────────────────────────────────────────
  {
    after: 'prevention',
    delay: 3000,
    who: 'luke',
    text: 'Übrigens: Ich hab heute Nacht noch ein Skript für die Serversicherheit optimiert. Läuft jetzt 0.3 Sekunden schneller.'
  },
  {
    after: 'prevention',
    delay: 6000,
    who: 'mia',
    text: 'Luke. Es ist 14 Uhr. Schläfst du auch manchmal? 😂'
  }
];

// Index nach Szene aufbauen
const ambientByScene = {};
for (const item of ambientMessages) {
  if (!ambientByScene[item.after]) ambientByScene[item.after] = [];
  ambientByScene[item.after].push(item);
}

// Generation-Counter um veraltete Ambient-Sequenzen abzubrechen
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
  row.innerHTML = `
    <div class="ep-typing-name">${name}</div>
    <div class="ep-typing-bubble"><span></span><span></span><span></span></div>
  `;
  msgsEl.appendChild(row);
  if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function typingDuration(text) {
  const len = text.replace(/<[^>]*>/g, '').length;
  return 600 + Math.min(len * 18, 1800);
}

// ── Ambient System ─────────────────────────────────────────────────────────────
async function playAmbient(key, gen) {
  const items = ambientByScene[key];
  if (!items || !items.length) return;

  for (const item of items) {
    // Warte initiale Verzögerung nach Szenen-Ende
    await wait(item.delay || 2000);
    if (gen !== ambientGen) return;

    if (item.banter) {
      // Banter-Sequenz: mehrere Nachrichten in Folge
      for (let i = 0; i < item.banter.length; i++) {
        if (gen !== ambientGen) return;
        const b = item.banter[i];

        // Delay zwischen Banter-Nachrichten (außer bei der ersten)
        if (i > 0) {
          await wait(b.delay || 2000);
          if (gen !== ambientGen) return;
        }

        showTyping(b.who);
        await wait(typingDuration(b.text));
        if (gen !== ambientGen) { removeTyping(); return; }
        removeTyping();
        await addMsg(b.who, b.text);
        await wait(300);
      }
    } else {
      // Einzelne Ambient-Nachricht
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
  // Alte Ambient-Sequenz abbrechen
  ambientGen++;
  const myGen = ambientGen;

  gridEl.innerHTML = '';

  if (key === 'end') { await showEnd(); return; }

  const scene = STORY[key];
  if (!scene) return;

  // Szenen-Nachrichten mit realistischen Delays
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

  // Hinweis aufdecken
  if (scene.clue !== undefined) {
    await wait(300);
    revealClue(scene.clue);
  }

  // Ambient-Nachrichten starten (nicht-blockierend, parallel zu Choices)
  playAmbient(key, myGen);

  // Choices rendern
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
    { who: 'system', text: '✅ FALL #001 ABGESCHLOSSEN' },
    { who: 'zoe',    text: 'Ich hab alles dokumentiert. Dieter kann wieder normal arbeiten.' },
    { who: 'mia',    text: 'Und er weiß jetzt was "FINAL_v2" in einem Dateinamen bedeutet 😄' },
    { who: 'ben',    text: 'Hardware ist noch intakt. Kein bleibender Schaden.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'luke',   text: 'Nächster Fall wartet. Willkommen im Team.' },
  ];

  for (const m of endings) {
    if (m.who !== 'system') {
      showTyping(m.who);
      await wait(800);
      removeTyping();
    }
    await addMsg(m.who, m.text);
    await wait(m.who === 'system' ? 400 : 600);
  }

  const card = document.createElement('div');
  card.className = 'ep-end-card';
  card.innerHTML = `
    <h2><span class="read-blue" style="font-weight: bold;">//</span> FALL GELÖST</h2>
    <p>Cryptojacking über gefälschtes Freeware-Tool.</p>
    <p>Dieter hat heute gelernt: Nicht jede kostenlose Software ist gratis.</p>
    <p style="margin-top:12px; color:var(--muted); font-size:12px;">${n}/4 Hinweise · Fall #001 · Einsteiger</p>
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
