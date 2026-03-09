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

// ── Story ─────────────────────────────────────────────────────────────────────
const STORY = {

  intro: {
    messages: [
      { who: 'system', text: '🔵 WILLKOMMEN // EMERGENCY PROTOKOLL // Lass uns kurz das Team vorstellen.' },
      { who: 'luke', text: 'Schön, dass du da bist. Ich bin <span style="color: #2d8cf0;">Luke</span>. Ich mach hier die technische Analyse. Ich mag kein Smalltalk, also kommen wir direkt zur Sache.  Heute ist dein erster Tag bei uns im Praktikum, wir lösen hier echte IT-Sicherheitsfälle. Es ist nicht schlimm, wenn du nicht alles weißt. Jeder fängt bei 0 an.' },
      { who: 'mia',  text: 'Heyyy! <span style="color: #f06292;">Mia</span> hier 👋 Falls wir mal Leute anrufen oder irgendwo reinkommen müssen ohne Einladung, bin ich dein Partner in Crime. Und ja, ich rede gerne ^^. Ach, mach dir wegen Luke keine Sorgen, er ist gerne direkt, aber nicht gemein.' },
      { who: 'ben',  text: 'Hi, ich bin <span style="color: #4caf97;">Ben</span>. Hardware, Systeme und Netzwerke sind meine Stärken, laufen gehört leider nicht dazu ^^. Mein Router heißt R2-D2 und läuft seit 420 Tagen ohne Neustart. Falls irgendwas kaputt geht, bringe ich es wieder zum laufen. 🔧' },
      { who: 'zoe',  text: 'Ich bin <span style="color: #f0c040;">Zoe</span>! Ich dokumentiere alles, stelle die Fragen die keiner stellt, und verliere manchmal den Faden, aber ich find ihn wieder. 📓' },
      { who: 'luke', text: 'Wir nehmen IT-Sicherheitsfälle an. Echte Angriffsmuster. Wir analysieren was passiert ist - und warum.' },
      { who: 'ben',  text: 'Wir sind sowas wie eine IT-Feuerwehr 🔥. Wenn es digital Brennt sind wir da.' },
      // { who: 'mia',  text: 'Und wie heißt du? 😊' },
    ],
    choices: [
      { text: '❓ Wie funktioniert das Spiel?',       next: 'mechanics'   },
      { text: '💬 Und wie lange macht ihr das schon?',         next: 'experience'  },
      { text: '🤔 Brauche ich technisches Vorwissen?', next: 'no_knowledge' },
      { text: '🚀 Alles klar – los geht\'s!',          next: 'end'         },
    ]
  },

  mechanics: {
    messages: [
      { who: 'player', text: 'Wie funktioniert das Spiel?' },
      { who: 'luke', text: 'Du bekommst einen Fall. Unten stehen deine möglichen Aktionen – wähl eine aus, und das Team reagiert.' },
      { who: 'luke', text: 'Manche Pfade führen schneller ans Ziel. Andere über Umwege. Aber du kommst immer ans Ziel.' },
      { who: 'ben',  text: 'In der Seitenleiste siehst du welche Hinweise du schon aufgedeckt hast. Je mehr du findest, desto vollständiger ist deine Analyse.' },
      { who: 'mia',  text: 'Und wichtig: Es gibt keinen "Game Over" Screen. Kein Scheitern. Du lernst echte Angriffsmuster – auf dein eigenes Tempo.' },
      { who: 'zoe',  text: 'Als ich das erste Mal hier war hab ich auch erstmal nur Fragen gestellt.' },
      { who: 'luke', text: 'Das waren fünfzehn Minuten.' },
      { who: 'zoe',  text: 'Luke!' },
      { who: 'mia', text: 'Wenn Fachbegriffe genannt werden kannst du auf das Wort klicken und das Nerdikon (ist ein schlaues Programm mit ganz viel Wissen) erklärt es dir: Hier probier es mit <span class="ep-term" data-term="Malware">Malware</span>.' },
    ],
    choices: [
      { text: '🤔 Brauche ich technisches Vorwissen?', next: 'no_knowledge' },
      { text: '🚀 Verstanden – los geht\'s!',           next: 'end'          },
    ]
  },

  experience: {
    messages: [
      { who: 'player', text: 'Und wie lange macht ihr das schon?' },
      { who: 'mia',  text: 'Gute Frage, wir haben vor ner Weile angefangen. Aber wir lernen auch jeden Tag dazu :D' },
      { who: 'luke', text: 'Seit etwa 142 Tagen.' },
      { who: 'ben',  text: 'Du führst immer noch Buch darüber?' },
      { who: 'luke', text: 'Natürlich. Jeder Fall ist eine Lektion.' },
      { who: 'mia',  text: 'Und ich dachte wir hätten schon die 200 geknackt...' },
      { who: 'ben',  text: 'Okay.. wo waren wir? Ach ja, wir haben schon viele Fälle gelöst. Und einiges gesehen was mir keiner glaubt, du wirst schon sehen ^^' },
      { who: 'zoe',  text: 'Das Gruselige ist: die meisten Angriffe sind gar nicht hi-tech. Die funktionieren weil die Leute einfach nicht wissen worauf sie achten sollen.' },
      { who: 'luke', text: 'Genau deswegen machen wir das hier. Damit mehr Menschen verstehen was wirklich passiert.' },
      { who: 'mia',  text: 'Mit Humor und Kaffee. Und Zoe die alles aufschreibt 📓 apropos, wo ist mein Kaffee?' },
      { who: 'ben',  text: 'Du hast ihn schon getrunken. Auf dem Weg hierher.' },
      { who: 'mia',  text: 'Oh... Stimmt. Danke für die Erinnerung 😂' },
    ],
    choices: [
      { text: '❓ Wie funktioniert das Spiel?',        next: 'mechanics'   },
      { text: '🤔 Brauche ich technisches Vorwissen?', next: 'no_knowledge' },
      { text: '🚀 Klingt gut – los geht\'s!',           next: 'end'          },
    ]
  },

  no_knowledge: {
    messages: [
      { who: 'player', text: 'Brauche ich technisches Vorwissen?' },
      { who: 'luke', text: 'Nein, überhaupt nicht. Wir erklären alles was du wissen musst.' },
      { who: 'ben',  text: 'Und wenn du Fragen hast, frag einfach. Es gibt keine dummen Fragen.' },
      { who: 'mia',  text: 'Ich hab auch nicht alles technisch drauf. Ich bin eher der Teil des Teams der mit einem Klemmbrett und Warnweste in Gebäude geht, wo ich nicht reingehen darf, und einen USB Stick von Ben in einen Computer stecke und damit dinge infiziere oder lahmlege. Natürlich alles legal, versteht sich ;) . Das nennt man "Social Engineering", oder auch das soziale hacken von Menschen.' },
      { who: 'zoe',  text: 'Ich frag immer nach bis ich eine gute Erklärung bekomme und es alle verstehen. Luke erklärt dinge manchmal zu knapp.' },
      { who: 'luke', text: 'Präzise. Nicht zu knapp.' },
      { who: 'mia',  text: 'Luke, du hast mir neulich "<span class="ep-term" data-term="Trojaner">Trojaner</span>" erklärt mit: "Versteckt sich. Ist böse." Das war deine ganze Erklärung.' },
      { who: 'luke', text: '...das war akkurat.' },
      { who: 'ben',  text: 'Du wirst mehr lernen als du denkst. Versprochen.' },
    ],
    choices: [
      { text: '❓ Wie funktioniert das Spiel?', next: 'mechanics' },
      { text: '🚀 Alles klar – bereit!',         next: 'end'       },
    ]
  },

  end: { final: true }
};

// ── Scene Engine ───────────────────────────────────────────────────────────────
async function playScene(key) {
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

    await addMsg(m.who, m.text);
    await wait(isSystem ? 400 : isPlayer ? 200 : 500);
  }

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

  const endings = [
    { who: 'system', text: '✅ TUTORIAL ABGESCHLOSSEN // Willkommen im Team.' },
    { who: 'luke',   text: 'Gut, alles organisatorische geklärt. Dann wähle jetzt deinen ersten Fall.' },
    { who: 'mia',    text: 'Ich empfehl Nummer 001. Schöner Einstieg 😄' },
    { who: 'zoe',    text: 'Viel Erfolg! Ich dokumentier mit 📓' },
    { who: 'ben',    text: 'Bis zum nächsten Fall, und cool das du dabei bist.' },
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
    <h2>// BEREIT</h2>
    <p>Du kennst das Team. Du weißt wie es läuft.</p>
    <p>Jetzt wähle deinen ersten Fall.</p>
    <a href="play.html" class="ep-restart-btn">→ Zu den Fällen</a>
  `;
  msgsEl.appendChild(card);
  if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
  gridEl.innerHTML = '';
}

// ── Boot ───────────────────────────────────────────────────────────────────────
(async () => {
  await addMsg('system', '🔵 EMERGENCY PROTOKOLL // Team-Briefing wird gestartet...');
  await wait(600);
  playScene('intro');
})();
