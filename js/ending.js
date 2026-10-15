const secretMessages = [
  'Your love is the best gift I could ever ask for. With you is my favorite place to be.',
  'Cayaa cuka cekalii kalau sayangku senyum cama cayaa',
  'Sayang jaga dirinya baik baik yaaa, huft hatiku cakit liat sayang cakit',
  'Sayang harus percaya kalau caya gamungkin pernah bicaa bocann cama sayangku ini',
  'Terima kasih udah pilih cayaa sayang, you are the best thing that ever happened to me.',
  'I love you so much, sayang. More than I can ever express in words. You are my everything.',
  'You make my life brighter and my heart fuller. I am so grateful for you.',
  'Maaci udaa ada di dunia ini sayangku, cekali lagi happy birhday yaaa',
];

const secretBox     = document.getElementById('secretBox');
const secretMessage = document.getElementById('secretMessage');
const heartBtn      = document.getElementById('heartBtn');
const heartCountEl  = document.getElementById('heartCount');
const hugBtn        = document.getElementById('hugBtn');
const kissBtn       = document.getElementById('kissBtn');
const footerHearts  = document.getElementById('footerHearts');

let secretIndex = 0;
function toggleSecret() {
  secretBox.classList.toggle('flipped');
  if (!secretBox.classList.contains('flipped')) {
    secretIndex = (secretIndex + 1) % secretMessages.length;
    secretMessage.textContent = secretMessages[secretIndex];
  }
}

if (secretBox) {
  secretBox.addEventListener('click', toggleSecret);
  secretBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSecret();
    }
  });
}
let heartCount = parseInt(localStorage.getItem('heartCount') || '0', 10) || 0;
if (heartCountEl) heartCountEl.textContent = heartCount;

if (heartBtn) {
  heartBtn.addEventListener('click', () => {
    heartCount++;
    heartCountEl.textContent = heartCount;
    localStorage.setItem('heartCount', heartCount);

    heartBtn.classList.add('pop');
    setTimeout(() => heartBtn.classList.remove('pop'), 400);

    spawnPop('💙', heartBtn);
  });
}

if (hugBtn) {
  hugBtn.addEventListener('click', () => {
    hugBtn.classList.add('pop');
    setTimeout(() => hugBtn.classList.remove('pop'), 400);
    spawnPop('🫶', hugBtn);
    showToast('huaa caya puk puk sayangku🫂');
  });
}

if (kissBtn) {
  kissBtn.addEventListener('click', () => {
    kissBtn.classList.add('pop');
    setTimeout(() => kissBtn.classList.remove('pop'), 400);
    spawnPop('💋', kissBtn);
    showToast('Mwah, I love u so much sayang 💙');
  });
}

function spawnPop(emoji, anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'pop-emoji';
  el.textContent = emoji;
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top + rect.height / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function showToast(text) {
  const existing = document.querySelector('.footer-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'footer-toast';
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

const heartEmojis = ['💙', '💌', '🤍', '💙', '✨', '🫶'];

if (footerHearts) {
  setInterval(() => {
    if (document.hidden) return;

    const s = document.createElement('span');
    s.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (12 + Math.random() * 12) + 'px';
    s.style.animationDuration = (6 + Math.random() * 4) + 's';

    footerHearts.appendChild(s);
    setTimeout(() => s.remove(), 10000);
  }, 900);
}

setTimeout(() => {
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti();
  }
}, 800);