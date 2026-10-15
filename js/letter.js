const message1 = `alooo, knock knock! waa, sayangku ulang tahun hari ini. Happy birthday, my favorite person 🤍🥹🎂

The person who means so much to me and makes my world a little brighter just by being in it. Semoga in this new chapter of your life, you find so much happiness, good health, success, and all the beautiful things you've been wishing for.

Semoga cemua yang sayangku harapkan bicaa terkabul, and may life give you so many reasons to smile. Sayang deserves all the love and happiness in this world, and I hope today reminds you of just how special you are to me.`;

const message2 = `I wish you could see yourself through my eyes because then you would understand just how amazing you are and how lucky I feel to have you in my life.

I'm so proud of you and everything you've been through to become the person you are today. Please always take care of yourself, eat well, get enough rest, and don't be too hard on yourself when things don't go as planned. Jangan nakal lagi yaa sayang, caya cediii cekali kalau sayangku cakit. 🥹

I hope you always remember that you don't have to go through everything alone because I'll always be cheering for you, supporting you, and reminding you of how capable you are.

And I also hope I get to celebrate many more birthdays with you, sayang. I want to be there for your little achievements, your biggest dreams, your happiest moments, and even the days when everything feels a little too much. I want to make more memories with you, go on more dates, laugh at the silliest things, have random conversations, eat ice cream together, and collect all the little moments that might seem ordinary now but will mean so much to us someday.`;

const message3 = `I love u more than words can explain, sayang. I love you yesterday, today, tomorrow, and forever. No matter what happens, I hope you know that my heart will always choose you.

You make my days better just by being in them, and even the simplest moments feel special when I'm with you. I don't know what the future holds for us, but I know that I want to keep making memories with you, growing with you, and loving you through every season of life.

Thank you for being you, for coming into my life, and for giving me someone so special to love. You're not just someone I love; you're someone I want to keep choosing every single day. I hope I can make you feel loved, appreciated, and cared for, not only on your birthday but on all the ordinary days in between, too.

Once again, happy birthday, my favorite person! 🤍 I hope today is as special as you are and that this new age brings you everything your heart has been hoping for.

Here's to more birthdays, more adventures, more laughter, more love, and more beautiful memories together. Whatever tomorrow brings, I hope we get to face it hand in hand.

I love you so, so much, sayang, more than you'll ever know. Today, tomorrow, and for all the days that come after. I love you endlessly. ♡`;

const quotes = [
  'Every version of you is worth loving.',
  'Loving you is a choice I keep making.',
  'You are my favorite kind of ordinary.',
  'Slowly, softly, always — with you.',
  'You make the quiet feel full.',
  'To me, you are enough. Always enough.',
  'Home isn\u2019t a place. It\u2019s you.',
  'I\u2019d choose you in a hundred lifetimes.',
];

const envelopeStage  = document.getElementById('envelopeStage');
const envelope       = document.getElementById('envelope');
const letterPaper    = document.getElementById('letterPaper');
const el1            = document.getElementById('typedMessage1');
const el2            = document.getElementById('typedMessage2');
const el3            = document.getElementById('typedMessage3');
const letterDate     = document.getElementById('letterDate');
const polaroidWrap   = document.getElementById('polaroidWrap');
const quoteCard      = document.getElementById('quoteCard');
const quoteText      = document.getElementById('quoteText');
const letterFooter   = document.getElementById('letterFooter');
const polaroidEnd    = document.getElementById('polaroidEnd');

if (letterDate) {
  letterDate.textContent = '— 16 October 2026 —';
}

function typeInto(el, text, speed = 22, done) {
  if (!el) { if (done) done(); return; }

  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  function step() {
    if (i < text.length) {
      const ch = text.charAt(i);
      cursor.insertAdjacentText('beforebegin', ch);
      i++;

      let delay = speed;
      if (ch === '.' || ch === '?' || ch === '!') delay = speed * 8;
      else if (ch === ',' || ch === ';' || ch === ':') delay = speed * 4;
      else if (ch === '\n') delay = speed * 6;

      setTimeout(step, delay);
    } else {
      cursor.remove();
      if (done) done();
    }
  }
  step();
}

function startLetterSequence() {
  typeInto(el1, message1, 18, () => {
    setTimeout(() => {
      if (polaroidWrap) polaroidWrap.classList.add('revealed');

      setTimeout(() => {
        typeInto(el2, message2, 18, () => {
          setTimeout(() => {
            if (quoteCard) quoteCard.classList.add('revealed');

            setTimeout(() => {
              typeInto(el3, message3, 18, () => {
                setTimeout(() => {
                  if (polaroidEnd) polaroidEnd.classList.add('revealed');
                }, 500);
                setTimeout(() => {
                  if (letterFooter) letterFooter.classList.add('revealed');
                }, 2400);
              });
            }, 1400);
          }, 500);
        });
      }, 1500);
    }, 500);
  });
}

let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  envelope.classList.add('open');

  setTimeout(() => {
    envelopeStage.classList.add('fade-out');
  }, 900);

  setTimeout(() => {
    envelopeStage.style.display = 'none';
    letterPaper.hidden = false;
    requestAnimationFrame(() => {
      letterPaper.classList.add('visible');
    });

    setTimeout(startLetterSequence, 800);
  }, 1500);
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

let quoteIndex = 0;
if (quoteCard && quoteText) {
  quoteIndex = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[quoteIndex];

  quoteCard.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;

    quoteText.classList.add('fade');
    setTimeout(() => {
      quoteText.textContent = quotes[quoteIndex];
      quoteText.classList.remove('fade');
    }, 220);
  });
}