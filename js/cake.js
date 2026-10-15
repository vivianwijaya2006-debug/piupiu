const cakeEl              = document.getElementById('cakeEl');
const cakeStage           = document.getElementById('cakeStage');
const cakeMessage         = document.getElementById('cakeMessage');
const cakeInstruction     = document.getElementById('cakeInstruction');
const cakeInstructionIcon = document.getElementById('cakeInstructionIcon');
const cakeInstructionText = document.getElementById('cakeInstructionText');
const cakeBurst           = document.getElementById('cakeBurst');
const cakeSparkles        = document.getElementById('cakeSparkles');
const cakeFireflies       = document.getElementById('cakeFireflies');
const candleProgress      = document.getElementById('candleProgress');
const progressDots        = candleProgress.querySelectorAll('.cake-progress-dot');
const candleEls           = document.querySelectorAll('.candle');
const wishInputWrap       = document.getElementById('wishInputWrap');
const wishInput           = document.getElementById('wishInput');
const wishSave            = document.getElementById('wishSave');
const wishHint            = document.getElementById('wishHint');
const wishCountEl         = document.getElementById('wishCount');
const wishGalaxyStars     = document.getElementById('wishGalaxyStars');
const cakeReset           = document.getElementById('cakeReset');

let litCandles = 0;
let isBlowing  = false;
let isDone     = false;
let wishes    = JSON.parse(localStorage.getItem('cakeWishes') || '[]');
let wishCount = parseInt(localStorage.getItem('wishCount') || '0', 10) || 0;

const messages = {
  idle:    'The candles are waiting for a spark.',
  partial: (n) => `${n} of 3 lit. Keep going ✨`,
  allLit:  'Close your eyes, make a wish… then tap the cake.',
  blown:   'Your wish is on its way. I hope it finds you.',
};

const instructions = {
  idle:    { icon: '✨', text: 'Tap each candle to light them',   cls: '' },
  partial: { icon: '🔥', text: 'Keep lighting the rest…',         cls: 'lit' },
  allLit:  { icon: '🌠', text: 'Now tap the cake to blow them out', cls: 'ready' },
  blown:   { icon: '💙', text: 'Wish made ✨',                   cls: 'blown' },
};

const secretMessages = [
  {
    emoji: '💌',
    tag:   'Secret unlocked',
    title: 'Wish #1 sent to the sky.',
    body:  'Waaa, sayangku udaa buat wish hihihi, apa yaa wishnya sayangku. cemogaa terkabul yaa sayang♡'
  },
  {
    emoji: '✨',
    tag:   'Another one',
    title: 'Two wishes now, sayang.',
    body: 'Ehhh, macii ada wishnya? sayangku mau wish apaa lagiii? cinii kacii tau huaa, caya mau tau🤭',
  },
  {
    emoji: '🌟',
    tag:   'Keep going',
    title: 'Three wishes — a lucky number.',
    body:  'Sayangku banyak cekaliii wishnya. Semoga semuanya bisa jadi kenyataann yaaa, aminnn sadhu*3! ♡',
  },
  {
    emoji: '🌙',
    tag:   'Still counting',
    title: 'You keep making wishes…',
    body:  'waa sayangku ini buat banyak cekalii harapan, sayang gamauu kacii tau caya apaa wishnya? hihihi',
  },
  {
    emoji: '💫',
    tag:   'So many wishes',
    title: 'Five wishes, five prayers.',
    body:  'hihihi, sayangku belum celecai jugaaa. kacii tauu dong apa wishnya sayang, tapi gapapa dehh, sayang cimpan aja rahacia wishnya🤏🏻',
  },
  {
    emoji: '🔓',
    tag:   'Secret unlocked',
    title: 'You’ve made so many wishes.',
    body:  'Apapun yang sayangku harapkan semoga cemua bisa terkabul, caya titip catu wish dong sayang cemoga kita bica celalu cama cama huaa aminn hihihi♡',
  },
];

function setMessage(text, muted = false) {
  cakeMessage.classList.add('fade');
  setTimeout(() => {
    cakeMessage.textContent = text;
    cakeMessage.classList.toggle('muted', muted);
    cakeMessage.classList.remove('fade');
  }, 220);
}

function setInstruction(state) {
  const cfg = instructions[state];
  cakeInstructionIcon.textContent = cfg.icon;
  cakeInstructionText.textContent = cfg.text;
  cakeInstruction.classList.remove('lit', 'ready', 'blown');
  if (cfg.cls) cakeInstruction.classList.add(cfg.cls);
}

(function spawnFireflies() {
  for (let i = 0; i < 14; i++) {
    const f = document.createElement('span');
    f.className = 'firefly';
    f.style.left = (Math.random() * 100) + '%';
    f.style.bottom = (Math.random() * 40) + '%';
    f.style.animationDuration = (6 + Math.random() * 6) + 's';
    f.style.animationDelay = (Math.random() * 8) + 's';
    const size = 4 + Math.random() * 4;
    f.style.width  = size + 'px';
    f.style.height = size + 'px';
    cakeFireflies.appendChild(f);
  }
})();

(function spawnSparkles() {
  const chars = ['✦', '✧', '·', '•', '✨'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.textContent = chars[Math.floor(Math.random() * chars.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.bottom = '-10px';
    s.style.animationDuration = (4 + Math.random() * 4) + 's';
    s.style.animationDelay = (Math.random() * 6) + 's';
    s.style.fontSize = (8 + Math.random() * 10) + 'px';
    s.style.color = Math.random() > 0.5 ? '#ffd77a' : '#a8d8ea';
    cakeSparkles.appendChild(s);
  }
})();

function renderGalaxy() {
  wishCountEl.textContent = wishCount;

  if (wishes.length === 0) {
    wishGalaxyStars.innerHTML = '<span class="wish-galaxy-empty">No wishes yet…</span>';
    return;
  }

  wishGalaxyStars.innerHTML = '';
  wishes.forEach((w, i) => {
    const star = document.createElement('span');
    star.className = 'wish-star';
    star.textContent = '✦';
    star.title = w.text || 'A silent wish';
    star.style.animationDelay = (i * 0.05) + 's';
    wishGalaxyStars.appendChild(star);
  });
}

function lightCandle(candleEl, idx) {
  if (candleEl.classList.contains('lit') || isDone) return;

  candleEl.classList.add('lit');
  litCandles++;

  progressDots[idx].classList.add('lit');

  const rect      = candleEl.getBoundingClientRect();
  const stageRect = cakeBurst.getBoundingClientRect();
  spawnBurst('✨', 4, 'small',
    rect.left - stageRect.left + rect.width / 2,
    rect.top  - stageRect.top
  );

  if (litCandles < 3) {
    setMessage(messages.partial(litCandles), true);
    setInstruction('partial');
  } else {
    setMessage(messages.allLit);
    setInstruction('allLit');
    cakeStage.classList.add('all-lit');

    setTimeout(() => {
      wishInputWrap.classList.add('visible');
    }, 300);
  }
}

function blowCandles() {
  if (isBlowing || isDone || litCandles < 3) return;
  isBlowing = true;
  isDone    = true;

  const wishText = wishInput.value.trim();
  if (wishText) {
    wishes.push({ text: wishText, date: new Date().toISOString() });
    localStorage.setItem('cakeWishes', JSON.stringify(wishes));
  }

  wishCount++;
  localStorage.setItem('wishCount', wishCount);

  candleEls.forEach((c, i) => {
    setTimeout(() => {
      c.classList.remove('lit');
      c.classList.add('blowing');

      const rect      = c.getBoundingClientRect();
      const stageRect = cakeBurst.getBoundingClientRect();
      spawnBurst('💨', 3, 'small',
        rect.left - stageRect.left + rect.width / 2,
        rect.top  - stageRect.top
      );
    }, i * 220);
  });

  setTimeout(() => {
    spawnBurst('💙', 16, 'big');
    spawnBurst('✨', 12, 'mid');
    spawnBurst('⭐',  8, 'big');

    if (typeof window.launchConfetti === 'function') window.launchConfetti();
  }, 700);

  setTimeout(() => spawnBalloons(), 900);
  setTimeout(() => spawnFireworks(), 1200);

  setTimeout(() => {
    setMessage(messages.blown);
    setInstruction('blown');
    cakeStage.classList.remove('all-lit');
    renderGalaxy();

    wishInputWrap.classList.remove('visible');
    cakeReset.hidden = false;

    setTimeout(() => showSecret(), 1400);
  }, 1100);
}

function resetCake() {
  litCandles = 0;
  isBlowing  = false;
  isDone     = false;

  candleEls.forEach((c) => c.classList.remove('lit', 'blowing'));
  progressDots.forEach((d) => d.classList.remove('lit'));
  cakeStage.classList.remove('all-lit');

  wishInput.value = '';
  wishInput.disabled = false;
  wishSave.disabled  = false;
  wishInputWrap.classList.remove('visible');
  cakeReset.hidden = true;

  setMessage(messages.idle, true);
  setInstruction('idle');
}

function spawnBurst(emoji, count, size = 'mid', baseX, baseY) {
  const rect = cakeBurst.getBoundingClientRect();
  const cx = baseX != null ? baseX : rect.width / 2;
  const cy = baseY != null ? baseY : rect.height / 2 - 60;

  const sizeMap  = { small: 14, mid: 20, big: 28 };
  const rangeMap = { small: 50, mid: 110, big: 180 };
  const baseSize = sizeMap[size];
  const range    = rangeMap[size];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.textContent = emoji;
    p.style.left = cx + 'px';
    p.style.top  = cy + 'px';
    p.style.fontSize = (baseSize + Math.random() * 10) + 'px';

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist  = range + Math.random() * range * 0.6;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 40;

    p.style.setProperty('--tx', tx + 'px');
    p.style.setProperty('--ty', ty + 'px');
    p.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    p.style.animationDelay = (Math.random() * 0.2) + 's';

    cakeBurst.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

function spawnBalloons() {
  const emojis = ['🎈', '💙', '🎈', '✨', '🎈'];
  const count  = 8;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'balloon-fly';
    b.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    b.style.left = (10 + Math.random() * 80) + 'vw';
    b.style.animationDelay = (i * 0.25) + 's';
    b.style.fontSize = (32 + Math.random() * 16) + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }
}

function spawnFireworks() {
  const colors = ['#ffd77a', '#ff8fa3', '#a8d8ea', '#cdb4db', '#d97757'];
  const bursts = 5;

  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      const x = 15 + Math.random() * 70;
      const y = 15 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let j = 0; j < 12; j++) {
        const dot = document.createElement('span');
        dot.style.cssText = `
          position: fixed;
          left: ${x}vw;
          top: ${y}vh;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 12px ${color}, 0 0 24px ${color};
          pointer-events: none;
          z-index: 9998;
          transition: transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.4s ease;
        `;
        document.body.appendChild(dot);

        const angle = (Math.PI * 2 * j) / 12;
        const dist  = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        requestAnimationFrame(() => {
          dot.style.transform = `translate(${tx}px, ${ty}px) scale(0.3)`;
          dot.style.opacity = '0';
        });

        setTimeout(() => dot.remove(), 1500);
      }
    }, i * 350);
  }
}

function showSecret() {
  const idx = (wishCount - 1) % secretMessages.length;
  const msg = secretMessages[idx];

  const secret = document.createElement('div');
  secret.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(13, 11, 10, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
    opacity: 0;
    transition: opacity 0.5s ease;
    cursor: pointer;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    max-width: 440px;
    width: 100%;
    background: linear-gradient(135deg, var(--surface) 0%, var(--bg-2) 100%);
    border: 1px solid var(--accent);
    border-radius: var(--radius-xl);
    padding: 40px 36px;
    text-align: center;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(217, 119, 87, 0.2);
    transform: scale(0.9);
    transition: transform 0.5s cubic-bezier(0.4, 1.6, 0.6, 1);
  `;

  box.innerHTML = `
    <div style="font-size: 2.5rem; margin-bottom: 20px;">${msg.emoji}</div>
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; font-weight: 600; margin-bottom: 16px;">${msg.tag}</p>
    <h3 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; margin-bottom: 16px;">${msg.title}</h3>
    <p style="font-family: var(--font-serif); font-style: italic; font-size: 1.1rem; color: var(--text-muted); line-height: 1.55;">
      ${msg.body}
    </p>
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-dim); margin-top: 24px; letter-spacing: 0.1em;">tap anywhere to close</p>
  `;

  secret.appendChild(box);
  document.body.appendChild(secret);

  requestAnimationFrame(() => {
    secret.style.opacity = '1';
    box.style.transform = 'scale(1)';
  });

  const close = () => {
    secret.style.opacity = '0';
    box.style.transform = 'scale(0.9)';
    setTimeout(() => secret.remove(), 500);
  };

  secret.addEventListener('click', close);

  const auto = setTimeout(close, 6000);
  secret.addEventListener('click', () => clearTimeout(auto), { once: true });
}

candleEls.forEach((c, idx) => {
  c.addEventListener('click', (e) => {
    e.stopPropagation();
    lightCandle(c, idx);
  });
  c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      lightCandle(c, idx);
    }
  });
});

cakeEl.addEventListener('click', () => {
  if (isDone) return;

  if (litCandles === 0) {
    setMessage('Light the candles first — tap them one by one ✨', true);
  } else if (litCandles < 3) {
    setMessage(`Only ${litCandles} of 3 lit. Light the rest first.`, true);
  } else {
    blowCandles();
  }
});

cakeReset.addEventListener('click', resetCake);

wishSave.addEventListener('click', () => {
  const txt = wishInput.value.trim();
  if (!txt) {
    wishHint.textContent = 'Write something first… or just blow ✨';
    wishHint.style.color = 'var(--accent)';
    return;
  }
  wishes.push({ text: txt, date: new Date().toISOString() });
  localStorage.setItem('cakeWishes', JSON.stringify(wishes));

  wishHint.textContent = 'Saved ✨ Now tap the cake to blow the candles.';
  wishHint.style.color = 'var(--accent)';
  wishInput.value = '';
  wishInput.disabled = true;
  wishSave.disabled  = true;

  spawnBurst('💫', 6, 'mid');
});

wishInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    wishSave.click();
  }
});

renderGalaxy();
setMessage(messages.idle, true);
setInstruction('idle');

if (wishes.length > 0) {
  setTimeout(() => {
    setMessage(`You've made ${wishCount} wishes before. Ready for another?`, true);
  }, 1200);
}