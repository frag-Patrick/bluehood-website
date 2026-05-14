// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  clues: [false, false, false, false],
  played: { a: false, b: false, c: false }
};

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

// Dynamische Choices basierend darauf was bereits gespielt wurde
function getRemainingChoices() {
  const choices = [];
  if (!S.played.a) {
    const next = (S.played.b || S.played.c) ? 'insta_profile_short' : 'insta_profile';
    choices.push({ text: 'Erstmal Sandras Instagram-Profil analysieren', next });
  }
  if (!S.played.b) {
    choices.push({ text: 'Erstmal die Nachricht untersuchen', next: 'investigate_message' });
  }
  if (!S.played.c) {
    const next = S.played.b ? 'exif_data_short' : 'exif_data';
    choices.push({ text: 'Was sagen die Exif-Daten der Fotos?', next });
  }
  if (S.played.a && S.played.b && S.played.c) {
    choices.push({ text: '→ Weiter', next: 'convergence' });
  }
  return choices;
}

// ── Story Script ───────────────────────────────────────────────────────────────
const STORY = {

  start: {
    messages: [
      { who: 'system', text: () => `⚡ EINGEHENDER FALL // #001 // ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'})}` },
      { who: 'mia',    text: 'Kurze Ansage bevor wir starten – dieser Fall ist... anders. Nicht weil jemand böses getan hat. Sondern weil jemand aus Liebe gehandelt hat und trotzdem jemanden verletzt hat. Das Opfer ist ein Kind das wir nie zu Gesicht kriegen. Haltet das im Hinterkopf, okay?' },
      { who: 'luke',   text: 'Verstanden.' },
      { who: 'ben',    text: 'Ich hab mit vielem an einem Montag gerechnet, aber nicht damit.' },
      { who: 'zoe',    text: 'Ben..' },
      { who: 'ben',    text: 'Ja ist ja gut, ich hab jetzt meinen Kaffee, lass uns den Notfall lösen.' },
      { who: 'mia',    text: 'Okay, die Mutter heißt Sandra K. Ist 34 und Mutter. Hat zwei Kinder, 3 und 6 Jahre alt.' },
      { who: 'mia',    text: 'Sie hat uns geschrieben: "Jemand hat meiner Tochter eine Nachricht auf Instagram geschickt. Der wusste ihren Namen, ihre Schule und wie sie gestern angezogen war. Woher kennt der sie??" 😰' },
      { who: 'zoe',    text: 'Moment. Ihre Tochter ist sechs. Warum hat die einen Instagram-Account?' },
      { who: 'mia',    text: 'Hat sie nicht. Der Account gehört Sandra. Aber es sind Fotos von der Tochter drauf.' },
      { who: 'zoe',    text: 'oh..' },
      { who: 'ben',    text: '..Shit.' },
    ],
    choices: [
      { text: '🔍 Sandras Instagram-Profil analysieren', next: 'insta_profile' },
      { text: '💬 Die Nachricht untersuchen',             next: 'investigate_message' },
      { text: '📷 EXIF-Daten der Fotos prüfen',          next: 'exif_data' },
    ]
  },

  // ── Option A – Volle Version (erste Wahl) ────────────────────────────────────
  insta_profile: {
    messages: [
      { who: 'luke', text: 'Ich analysiere das Profil. 847 Posts seit 2019.' },
      { who: 'ben',  text: 'Was suchst du genau?' },
      { who: 'luke', text: 'Muster im Alltag.' },
      { who: 'luke', text: '17 Fotos mit erkennbarem Schulweg. 43 mit dem Kindergarten im Hintergrund. Ich kann ihren Wohnort auf zwei Straßen eingrenzen.' },
      { who: 'zoe',  text: 'Wow so schnell?' },
      { who: 'luke', text: 'Ada hilft mir. KI ist bei Musterekennung ein Game-Changer.' },
      { who: 'zoe',  text: 'Krass, und das alles weißt du aus.. normalen Familienfotos?' },
      { who: 'luke', text: 'Ja. Ohne Metadaten, nur durch das Beobachten von Details.' },
      { who: 'mia',  text: 'Du hast echt viel GeoGuessr in den letzten Wochen gespielt.' },
      { who: 'luke', text: 'Jap und Ada trainiert.' },
      { who: 'zoe',  text: 'Geo.. was?' },
      { who: 'mia',  text: 'Kennst du GeoGuessr? Das Spiel wo du aus einem Straßenfoto errätst wo auf der Welt du bist?' },
      { who: 'zoe',  text: 'Ah, ne bisher noch nicht, aber klingt cool!' },
      { who: 'luke', text: 'Ja ist es auch. Aber jetzt gerade ist es eher gruselig was Sandra von ihren Kindern preisgibt.' },
      { who: 'zoe',  text: 'Ja shit und was tun wir jetzt?' },
    ],
    clue: 0,
    choices: () => getRemainingChoices()
  },

  // ── Option A – Kurzversion (nach B oder C gespielt) ──────────────────────────
  insta_profile_short: {
    messages: [
      { who: 'luke', text: 'Ich schaue mir trotzdem das Profil systematisch an. Vollständigkeit.' },
      { who: 'luke', text: '17 Fotos Schulweg. 43 Kindergarten. Vollständiges Bewegungsprofil – ohne eine einzige Metadaten-Zeile.' },
      { who: 'zoe',  text: 'Die Fotos selbst sind die Metadaten.' },
      { who: 'luke', text: 'Korrekt.' },
      { who: 'ben',  text: 'Das klingt wie ein Satz der auf einem Poster stehen sollte.' },
      { who: 'luke', text: 'Dann häng ihn auf.' },
    ],
    clue: 0,
    choices: () => getRemainingChoices()
  },

  // ── Option B – Die Nachricht untersuchen (immer volle Version) ───────────────
  investigate_message: {
    messages: [
      { who: 'mia', text: 'Bin dran.. Igitt! Außerdem hat er noch etwas geschrieben was ihr höllische Angst macht: "Er mag auch den neuen Rucksack mit Alarm-Anhänger des Mädchens. Aber das wird ihn nicht aufhalten."' },
      { who: 'mia', text: 'Sie hat den wohl zum Schutz gekauft.' },
      { who: 'zoe', text: 'Was ein Widerling! Hier geht\'s ganz klar um eine eklige Machtfantasie!' },
      { who: 'mia', text: 'Ja! Also nehmen wir ihm seine Anonymität weg!' },
      { who: 'mia', text: 'Hmm. Außer dass er um 13 Uhr an einem Montag geschrieben hat und ein schlechtestes Selfie als Profilbild hat, sehe ich nichts.' },
    ],
    choices: [
      { text: '🖼️ Was ist mit dem Insta-Profil? Was können wir mit seinem Profilbild machen?', next: 'profile_pic' }
    ]
  },

  // ── B-Fortsetzung: OSINT auf Profilbild → Täter identifiziert ────────────────
  profile_pic: {
    messages: [
      { who: 'mia',  text: 'Guter Einwand! Ich lasse das Profilbild mal durch mein OSINT-Tool laufen..' },
      { who: 'mia',  text: 'Ich kann sein Gesicht schwer erkennen, aber der Hintergrund kommt mir bekannt vor!' },
      { who: 'mia',  text: 'Dieses Schwein! Der hat vor der Schule posiert wo eine Klasse gerade Schulschluss hat!' },
      { who: 'zoe',  text: 'Das ist nicht mehr nur Beobachtung.' },
      { who: 'luke', text: 'Nein. Das ist Dokumentation von Zugang.' },
      { who: 'mia',  text: 'Ich bin so wütend gerade ich kann nicht klar denken.' },
      { who: 'ben',  text: 'Mia. Atmen.' },
      { who: 'mia',  text: 'Ich weiß ich weiß.' },
      { who: 'luke', text: 'Ich lasse meinen Gesichtserkennungsalgorithmus laufen..' },
      { who: 'luke', text: 'Ich hab ein paar Facebook-Profile gefunden die Ähnlichkeiten haben! @Mia, hilf mir mal.' },
      { who: 'mia',  text: 'Klasse Luke! Ich hab seinen Namen und seine Adresse, der Idiot hat sein Leben auf Facebook dokumentiert!' },
      { who: 'luke', text: 'Screenshot sichern. Profil-URL notieren. Wir haben das Schwein! Alles was wir haben geht an die Polizei.' },
      { who: 'zoe',  text: 'Warte – können wir das überhaupt? Also rechtlich?' },
      { who: 'luke', text: 'Wir dokumentieren öffentlich zugängliche Informationen. Ja. Können wir.' },
      { who: 'ben',  text: 'Und Sandra muss das sofort melden. Heute noch.' },
      { who: 'mia',  text: 'Ich schreib ihr!' },
    ],
    clue: 1,
    choices: () => getRemainingChoices()
  },

  // ── Option C – EXIF Volle Version (erste Wahl oder nach A) ──────────────────
  exif_data: {
    messages: [
      { who: 'luke', text: 'Okay. Ich nehme das letzte Bild das Sandra gepostet hat. Kindergeburtstag. ExifTool läuft...' },
      { who: 'luke', text: 'Hm.. nichts.' },
      { who: 'ben',  text: 'Wie, nichts?' },
      { who: 'luke', text: 'Instagram und Facebook entfernen wohl die Standort-Metadaten beim Upload der Bilder.' },
      { who: 'zoe',  text: 'Genial! Aber woher weiß das Arschloch wo das war?' },
      { who: 'luke', text: 'Im Hintergrund ist ein Straßenschild. Und die Schmiedestraße gibt\'s nur einmal in Bitstedt.' },
      { who: 'zoe',  text: 'SHIT..' },
      { who: 'mia',  text: 'Ja, typisch OSINT.' },
      { who: 'zoe',  text: 'OSINT? Klingt wie ne Geschlechtskrankheit.' },
      { who: 'mia',  text: 'Haha 😂 Das einzige Kondom was es da gibt heißt "keine Selfies in der Öffentlichkeit machen".' },
      { who: 'luke', text: 'Das ist medizinisch ungenau aber inhaltlich korrekt.' },
      { who: 'ben',  text: 'Luke hat gerade einen Kondom-Witz bestätigt. Ich halte das fest.' },
      { who: 'mia',  text: 'Hahaha aber Spaß beiseite – OSINT heißt Open Source Intelligence und das ist kein IQ-Test sondern eine Recherchemethode wo du mit Infos arbeitest die schon öffentlich sind.' },
      { who: 'zoe',  text: 'Ach krass! Ja das hab ich auch schon im Studium gehabt! Jetzt erinnere ich mich! Dann ist ja die Lösung dass die Leute ihr Leben nicht mehr ins Internet tragen sollten.' },
      { who: 'luke', text: 'Oh wenn das so einfach wäre..' },
      { who: 'ben',  text: 'Ich höre da immer nur: "Ich hab doch EH NICHTS zu VERbergen! Wer interessiert sich denn für mich?"' },
      { who: 'mia',  text: 'Oh ja, ein Cent für jedes Mal wo ich den Spruch gehört habe..' },
      { who: 'luke', text: 'Wir könnten uns wortwörtlich ne Raumstation leisten! Und dazu hätten wir noch ausgesorgt. Ich hab das wirklich mal durchgerechnet!' },
      { who: 'ben',  text: 'Natürlich hast du das.' },
      { who: 'zoe',  text: 'Warum wundert mich das nicht?' },
      { who: 'mia',  text: 'Mich auch nicht 😂 aber zurück zum Fall Leute, wir müssen dem Kind helfen!' },
    ],
    clue: 2,
    choices: () => getRemainingChoices()
  },

  // ── Option C – Kurzversion (nachdem B bereits gespielt wurde) ─────────────────
  exif_data_short: {
    messages: [
      { who: 'ben',  text: 'ExifTool läuft... nichts. Die Plattformen strippen das.' },
      { who: 'luke', text: 'Hab ich mir schon gedacht. Aber die Bilder selbst haben alles erzählt was wir brauchen.' },
      { who: 'ben',  text: 'Wenigstens das.' },
    ],
    clue: 2,
    choices: () => getRemainingChoices()
  },

  // ── Konvergenzpunkt (nach allen drei Optionen) ───────────────────────────────
  convergence: {
    messages: [
      { who: 'luke', text: 'Okay, stimmt, weiter. Ich schau mir noch den Rest an. @Mia übernimm du bitte das Reden mit ihr.' },
      { who: 'mia',  text: 'Bin dabei.' },
      { who: 'mia',  text: 'Shit, ich hab auch ihren Standort in nem Video gefunden. Ich kann aus JEDEM Video sehen wo sie wann war.. shit.. Daraus kann ich einen exakten Standortverlauf der letzten JAHRE machen.. fuck fuck fuck..' },
      { who: 'luke', text: 'Ich kann eben ein Script schreiben um das zu verdeutlichen!' },
      { who: 'zoe',  text: 'Weiß nicht ob das hilft @Luke, aber die Mutter braucht definitiv einen Internet-Führerschein. Verdammte Scheiße hier geht\'s um die Sicherheit von Kindern!' },
      { who: 'ben',  text: 'Ja hast Recht @Zoe, aber konzentrieren wir uns.' },
      { who: 'mia',  text: 'Ich hab mit ihr gesprochen. Es ist ihr unfassbar unangenehm, sie wusste nicht dass sie ihren Mädels sowas antut.' },
      { who: 'luke', text: 'Gut, lass uns weiter machen.' },
      { who: 'zoe',  text: 'LUKE!' },
      { who: 'luke', text: 'Was denn? Einsicht ist der erste wichtige Schritt dahin dass sie so einen Scheiß nicht wiederholt.' },
      { who: 'zoe',  text: 'Mag ja sein, aber so kannst du nicht mit Menschen reden, damit erreichst du nur dass sie dicht macht und nichts lernt.' },
      { who: 'ben',  text: 'Ihr habt beide Recht, aber @Zoe Luke redet nicht direkt mit Sandra und er arbeitet nun mal so, logisch. Er ist unser Fels in der Brandung wenn wir alle emotional werden und nicht mehr klar denken.' },
      { who: 'zoe',  text: 'Hm ja okay, verstehe ich.. irgendwie. Dann danke Luke dass du bist wie du bist.' },
      { who: 'luke', text: 'Mein Autismus ist angeboren. Also, bitte denke ich. Können wir weiter machen?' },
      { who: 'ben',  text: 'Moment mal.' },
      { who: 'mia',  text: 'Was?' },
      { who: 'ben',  text: 'Der Typ hat Sandras Kind gefunden weil sie ihr Leben öffentlich dokumentiert hat.' },
      { who: 'ben',  text: 'Und wir haben IHN gefunden weil er sein Leben öffentlich dokumentiert hat.' },
      { who: 'luke', text: 'Korrekt.' },
      { who: 'zoe',  text: 'Das ist... das ist eigentlich die ganze Lektion in zwei Sätzen.' },
      { who: 'mia',  text: 'Ja stimmt. Aber lass das jetzt zu Ende bringen, ich kann nicht mehr..' },
      { who: 'mia',  text: 'Ich lad Sandra eben hier ein, sie kann unsere anderen Nachrichten nicht sehen.' },
    ],
    clue: 3,
    choices: [
      { text: '→ Sandra einladen', next: 'sandra_chat' }
    ]
  },

  // ── Sandra-Teil ──────────────────────────────────────────────────────────────
  sandra_chat: {
    messages: [
      { who: 'system',  text: '(Sandra ist beigetreten.)' },
      { who: 'mia',     text: 'Sandra, wir haben ihn. Name, Adresse, alles. Das geht heute noch zur Polizei. Du bist nicht alleine damit.' },
      { who: 'sandra',  text: 'Oh Gott, ich zitter gerade am ganzen Körper! Ich kanm kaumm scheiben.' },
      { who: 'sandra',  text: 'Schreiben' },
      { who: 'zoe',     text: 'Das ist okay. Darf ich dir zeigen was wir jetzt gemeinsam machen?' },
      { who: 'sandra',  text: 'Ja! Bitte!' },
      { who: 'zoe',     text: 'Erstmal tief durchatmen, Sandra. Du hast alles richtig gemacht indem du uns geschrieben hast.' },
      { who: 'zoe',     text: 'Und ich möchte dir noch was sagen bevor wir anfangen.' },
      { who: 'zoe',     text: 'Du hast das nicht getan weil du deinen Kindern schaden wolltest. Du hast das getan weil du stolz auf sie bist. Das sieht man in jedem einzelnen Post.' },
      { who: 'zoe',     text: 'Das Problem bist nicht du. Das Problem ist dass uns niemand erklärt wo die Grenze ist.' },
      { who: 'sandra',  text: 'Ich wein gerade.' },
      { who: 'sandra',  text: 'Danke.' },
      { who: 'zoe',     text: 'Okay. Dann machen wir das jetzt zusammen. Schritt für Schritt. Du musst gar nichts alleine verstehen.' },
      { who: 'sandra',  text: 'Muss ich jetzt alles löschen?? So viele Erinnerungen..' },
      { who: 'zoe',     text: 'Ja und Nein. Du kannst diese Bilder weiterhin machen, aber bitte poste nichts was in ein Familienalbum gehört. Und du kannst die ganzen Videos runterladen und Bilder kannst du screenshoten und auf deinem Handy oder Laptop speichern, wir zeigen dir auch wie wenn du möchtest.' },
      { who: 'sandra',  text: 'Oh danke! Ihr seid soo großartig!! Und was mache ich mit all den Reels?' },
      { who: 'mia',     text: 'Die kannst du runterladen, gehe im Reel auf die drei Punkte unten rechts und drücke "Herunterladen" – das ist viel Arbeit, aber damit behältst du deine Erinnerungen und schützt deine Mädels.' },
      { who: 'sandra',  text: 'Oh okay.. und was mache ich gegen den Mann?' },
      { who: 'mia',     text: 'Sag der Schule Bescheid und der Polizei, die sind darauf geschult aufzupassen.' },
      { who: 'ben',     text: 'Und wenn du zur Polizei gehst – nimm Screenshots von allem mit. Die Nachricht, sein Profil, alles was wir gefunden haben. Wir schicken dir das zusammen.' },
      { who: 'luke',    text: 'Ich mache eine Dokumentation. Zeitstempel, URLs, Screenshots. Geordnet. Das macht es der Polizei leichter.' },
      { who: 'sandra',  text: 'Ich weiß nicht wie ich euch danken soll.' },
      { who: 'zoe',     text: 'Pass auf deine Mädels auf. Das reicht.' },
    ],
    choices: [
      { text: '✓ Checkliste abarbeiten', next: 'checklist' }
    ]
  },

  // ── Checkliste ───────────────────────────────────────────────────────────────
  checklist: {
    messages: [
      { who: 'zoe',    text: 'Okay, noch ein paar letzte Schritte Sandra, dann bist du fertig für heute.' },
      { who: 'system', text: '[✓] Profil auf "Nur Freunde" stellen' },
      { who: 'sandra', text: 'Gemacht.' },
      { who: 'mia',    text: 'Perfekt. 👍' },
      { who: 'system', text: '[✓] Alle zukünftigen Posts auf Freunde begrenzen' },
      { who: 'sandra', text: 'Okay, wo finde ich das?' },
      { who: 'mia',    text: 'Einstellungen → Privatsphäre → Wer sieht deine zukünftigen Posts? → Freunde. 🔧' },
      { who: 'sandra', text: 'Gefunden! Gemacht!' },
      { who: 'system', text: '[✓] Reels und Fotos herunterladen' },
      { who: 'sandra', text: 'Das wird dauern..' },
      { who: 'ben',    text: 'Mach das heute Abend wenn die Kinder schlafen. Kein Stress.' },
      { who: 'system', text: '[✓] Anzeige erstatten' },
      { who: 'sandra', text: 'Das mache ich morgen früh als allererstes.' },
      { who: 'luke',   text: 'Heute noch wäre besser.' },
      { who: 'zoe',    text: 'Luke.' },
      { who: 'luke',   text: '...aber morgen früh ist auch okay.' },
      { who: 'sandra', text: 'Vielen Dank euch allen! Ich werde euch definitiv weiter empfehlen!' },
      { who: 'mia',    text: 'Ganz lieben Dank, und Sandra' },
      { who: 'sandra', text: 'Ja, Mia?' },
      { who: 'mia',    text: 'Wenn irgendwas ist, wir sind da.' },
      { who: 'sandra', text: 'Danke von Herzen! ❤️❤️❤️❤️' },
      { who: 'luke',   text: 'Ein weiterer Fall abgeschlossen.' },
    ],
    choices: [
      { text: '→ Fall abschließen', next: 'end_banter' }
    ]
  },

  // ── Abschluss-Banter ─────────────────────────────────────────────────────────
  end_banter: {
    messages: [
      { who: 'system', text: '(Sandra hat den Chat verlassen.)' },
      { who: 'mia',    text: 'Ich brauch kurz.' },
      { who: 'ben',    text: 'Ja.' },
      { who: 'zoe',    text: 'Geht mir auch so. Ich geh eben nach oben und hol mir nen Kaffee. Ich nehm mein Handy mit.' },
      { who: 'luke',   text: 'Zoe.' },
      { who: 'zoe',    text: 'Ja?' },
      { who: 'luke',   text: 'Du hast das heute richtig gemacht. Ich hätte das nicht gekonnt.' },
      { who: 'zoe',    text: 'Danke, aber wir hätten den Täter nicht gefunden ohne dich.' },
      { who: 'luke',   text: 'Korrekt. Deswegen sind wir ein Team.' },
      { who: 'zoe',    text: 'Bin wieder zurück, der Kaffee tut gut.' },
      { who: 'mia',    text: 'Okay ich wein jetzt offiziell. 😭' },
      { who: 'ben',    text: 'Geralt hätte übrigens auch seine Fotos online. Ich sag nur.' },
      { who: 'zoe',    text: 'Ben ich schwöre..' },
      { who: 'zoe',    text: 'warte, das war ich nicht' },
      { who: 'zoe',    text: 'Hat jemand mein Handy gesehn?' },
      { who: 'zoe',    text: 'SHIT ich habs oben gelassen! PAPA GIB MIR MEIN HANDY ZURÜCK!' },
      { who: 'zoe',    text: 'hier ist geralt. ben du kriegst heute keinen kaffee mehr. und dein telefon liegt neben der spüle Zoe.' },
      { who: 'mia',    text: '😂' },
      { who: 'luke',   text: '@Zoe Wir müssen nochmal über das Thema OPSEC reden.' },
      { who: 'zoe',    text: 'Ja sry @Luke. Hab mein Handy jetzt wieder und @Ben, er meint das ernst.' },
      { who: 'ben',    text: 'Ich bereue nichts.' },
      { who: 'luke',   text: 'Achte mal drauf welche Geräte mit Signal verbunden sind!' },
      { who: 'zoe',    text: '@Luke, bin dabei, danke..' },
      { who: 'system', text: 'Fall #001 geschlossen. ✓' },
    ],
    choices: [
      { text: '✅ Fall abgeschlossen', next: 'end' }
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
    delay: 1200,
    banter: [
      { who: 'mia', text: 'Ich hab ihren Account schon kurz gecheckt. Verdammt viele Posts und Fast alle mit den Kindern.' },
      { who: 'ben', text: 'Scheiß Montag.', delay: 1800 },
    ]
  },

  // ── Nach 'insta_profile' – GeoGuessr-Nachklang ───────────────────────────
  {
    after: 'insta_profile',
    delay: 2000,
    banter: [
      { who: 'zoe',  text: 'Also warte – GeoGuessr ist im Grunde OSINT als Spiel?' },
      { who: 'luke', text: 'Genau das.', delay: 1200 },
      { who: 'mia',  text: 'Und Luke spielt es täglich. Ergo: Luke ist eine OSINT-Maschine.', delay: 1500, reactions: [{ who: 'luke', emoji: '👍', delay: 1000 }] },
    ]
  },

  // ── Nach 'profile_pic' – Täter gefunden ──────────────────────────────────
  

  // ── Nach 'exif_data' – Raumstation-Nachklang ─────────────────────────────
  {
    after: 'exif_data',
    delay: 2000,
    banter: [
      { who: 'ben',  text: 'Raumstation. Ich bin immer noch bei Raumstation.' },
      { who: 'luke', text: 'Das war eine exakte Berechnung basierend auf Durchschnittszins und aktueller Weltraumindustrie-Preisentwicklung.', delay: 2000 },
      { who: 'ben',  text: '...natürlich war das das.', delay: 1500 },
    ]
  },

  // ── Nach 'convergence' – kurze Stille vor Sandra ─────────────────────────
  {
    after: 'convergence',
    delay: 1800,
    who: 'mia',
    text: 'Ich schreibe Sandra gerade. Ich muss kurz überlegen wie ich das formuliere ohne sie zu überfordern.'
  },
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

const NAMES = { luke: 'LUKE', mia: 'MIA', ben: 'BEN', zoe: 'ZOE', sandra: 'SANDRA', player: 'DU', system: '' };

// Tracks which message rows have player-reaction callbacks
const reactionHandlers = new Map();
let reactionPending = false;
const pendingPlayerReactions = [];

// Per-character reply personalities — null/missing means they don't react to that emoji
// Maps player emoji → what the character reacts with on the player's next choice.
// No 😂 — characters don't laugh at a player's serious action message.
// Per-character emoji reactions based on decision quality
const CHOICE_REACTION_MAP = {
  luke: { great: '👍', good: '👍' },
  mia:  { great: '🎉', good: '❤️', meh: '👀', bad: '😮' },
  zoe:  { great: '🎉', good: '👍', meh: '👀', bad: '😮' },
  ben:  { great: '🔥', good: '👍',             bad: '👀' },
};

window.onPlayerReaction = (row, emoji) => {
  if (reactionPending) return;
  // Run specific handler (follow-up messages etc.) if defined
  const handlers = reactionHandlers.get(row);
  if (!handlers || !handlers[emoji]) return;
  reactionPending = true;
  Promise.resolve(handlers[emoji](row)).finally(() => { reactionPending = false; });
};

function addMsg(who, html) {
  return new Promise(res => {
    const row = document.createElement('div');
    const _nm = typeof nerdikonMarkup === 'function' ? nerdikonMarkup : h => h;

    if (who === 'system') {
      row.className = 'ep-msg-row system-msg';
      row.innerHTML = `<div class="ep-bubble">${html}</div>`;
    } else {
      const side = who === 'player' ? 'right' : 'left';
      row.className = `ep-msg-row ${who} ${side}`;
      row.dataset.who = who;

      const wrap = document.createElement('div');
      wrap.className = 'ep-msg-bubble-wrap';
      const bubble = document.createElement('div');
      bubble.className = 'ep-bubble';
      bubble.innerHTML = _nm(html);
      wrap.appendChild(bubble);

      if (who !== 'player') {
        const avatar = document.createElement('div');
        avatar.className = `ep-msg-avatar ${who}`;
        avatar.innerHTML = `<div class="ep-msg-avatar-circle">${who[0].toUpperCase()}</div><span class="ep-msg-avatar-name">${NAMES[who]}</span>`;
        row.appendChild(avatar);
      }
      row.appendChild(wrap);
    }

    if (who === 'player' && pendingPlayerReactions.length) {
      const pending = pendingPlayerReactions.splice(0);
      for (const p of pending) {
        if (typeof scheduleCharReaction === 'function') scheduleCharReaction(row, p.who, p.emoji, p.delay);
      }
    }
    msgsEl.appendChild(row);
    if (typeof attachReactionUI === 'function') attachReactionUI(row);
    if (userAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight; else newMsgBtn.classList.add('visible');
    setTimeout(() => res(row), 80);
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
        const bRow = await addMsg(b.who, b.text);
        if (b.reactions) {
          for (const r of b.reactions) {
            if (typeof scheduleCharReaction === 'function') scheduleCharReaction(bRow, r.who, r.emoji, r.delay || 1200);
          }
        }
        if (b.onPlayerReact) reactionHandlers.set(bRow, b.onPlayerReact);
        await wait(300);
      }
    } else {
      // Einzelne Ambient-Nachricht
      showTyping(item.who);
      await wait(typingDuration(item.text));
      if (gen !== ambientGen) { removeTyping(); return; }
      removeTyping();
      const ambRow = await addMsg(item.who, item.text);
      if (item.reactions) {
        for (const r of item.reactions) {
          if (typeof scheduleCharReaction === 'function') scheduleCharReaction(ambRow, r.who, r.emoji, r.delay || 1200);
        }
      }
      if (item.onPlayerReact) reactionHandlers.set(ambRow, item.onPlayerReact);
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

  // Branching-State aktualisieren
  if (key === 'insta_profile' || key === 'insta_profile_short') S.played.a = true;
  if (key === 'profile_pic') S.played.b = true;
  if (key === 'exif_data' || key === 'exif_data_short') S.played.c = true;

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

    const msgRow = await addMsg(m.who, typeof m.text === 'function' ? m.text() : m.text);
    if (m.reactions) {
      for (const r of m.reactions) {
        if (typeof scheduleCharReaction === 'function') scheduleCharReaction(msgRow, r.who, r.emoji, r.delay || 1200);
      }
    }
    if (m.onPlayerReact) reactionHandlers.set(msgRow, m.onPlayerReact);
    await wait(isSystem ? 400 : isPlayer ? 200 : 500);
  }

  // Hinweis aufdecken
  if (scene.clue !== undefined) {
    await wait(300);
    revealClue(scene.clue);
  }

  // Ambient-Nachrichten starten (nicht-blockierend, parallel zu Choices)
  playAmbient(key, myGen);

  // Choices rendern (statisch oder dynamisch per Funktion)
  await wait(400);
  const choices = typeof scene.choices === 'function' ? scene.choices() : scene.choices;
  if (choices) {
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ep-choice-btn';
      btn.textContent = c.text;
      btn.onclick = async () => {
        gridEl.innerHTML = '';
        if (c.quality) {
          const skipChance = c.quality === 'great' ? 0.10 : c.quality === 'meh' ? 0.40 : 0.25;
          for (const [who, map] of Object.entries(CHOICE_REACTION_MAP)) {
            const emoji = map[c.quality];
            if (emoji && Math.random() > skipChance) {
              pendingPlayerReactions.push({ who, emoji, delay: 700 + Math.floor(Math.random() * 900) });
            }
          }
        }
        await addMsg('player', c.text);
        await wait(300);
        playScene(c.next);
      };
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
    { who: 'mia',    text: 'Sandra hat Anzeige erstattet. Die Schule weiß Bescheid.' },
    { who: 'ben',    text: 'Und ihr Profil ist jetzt privat.' },
    { who: 'zoe',    text: 'Die Kinder wissen von nichts. So soll es bleiben.' },
    { who: 'luke',   text: `Hinweise gefunden: <span class="ep-hl">${n}/4</span>. ${allFound ? 'Vollständige Analyse.' : 'Gut – aber da war noch mehr zu finden.'}` },
    { who: 'luke',   text: 'Nächster Fall wartet.' },
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
    <p>Ein Unbekannter hat Sandras Tochter über öffentliche Instagram-Posts verfolgt.</p>
    <p>Sandra hat heute gelernt: Familienfotos im Netz sind keine privaten Erinnerungen – sie sind öffentliche Daten.</p>
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
