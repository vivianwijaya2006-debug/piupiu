const voicePlayer   = document.getElementById('voicePlayer');
const voiceAudio    = document.getElementById('voiceAudio');
const playBtn       = document.getElementById('playBtn');
const backBtn       = document.getElementById('backBtn');
const fwdBtn        = document.getElementById('fwdBtn');
const waveform      = document.getElementById('waveform');
const waveWrap      = document.getElementById('waveWrap');
const waveProgress  = document.getElementById('waveProgress');
const wavePlayhead  = document.getElementById('wavePlayhead');
const currentTimeEl = document.getElementById('currentTime');
const durationEl    = document.getElementById('duration');
const voiceBadgeText = document.getElementById('voiceBadgeText');
const TOTAL_BARS = 60;

const BG_FADE_OUT_MS = 2500;
const BG_FADE_IN_MS  = 2000;

for (let i = 0; i < TOTAL_BARS; i++) {
  const bar = document.createElement('div');
  bar.className = 'bar';

  const base = Math.sin(i / TOTAL_BARS * Math.PI * 4) * 0.3 + 0.5;
  const random = Math.random() * 0.4;
  const height = Math.max(8, Math.min(100, (base + random) * 100));

  bar.style.height = height + '%';
  waveform.appendChild(bar);
}
const bars = waveform.querySelectorAll('.bar');

function formatTime(sec) {
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

voiceAudio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(voiceAudio.duration);
});

voiceAudio.addEventListener('error', () => {
  console.warn('Voice note gagal dimuat. Cek path & nama file:', voiceAudio.src);
  setBadge('File tidak ditemukan');
});

voiceAudio.addEventListener('timeupdate', () => {
  const cur = voiceAudio.currentTime;
  const dur = voiceAudio.duration;
  if (!isFinite(dur) || dur === 0) return;
  currentTimeEl.textContent = formatTime(cur);
  const progress = cur / dur;
  const pct = progress * 100;

  const activeBars = Math.floor(progress * TOTAL_BARS);
  bars.forEach((bar, i) => {
    bar.classList.toggle('active', i < activeBars);
    bar.classList.toggle('near', i === activeBars || i === activeBars + 1);
  });

  waveProgress.style.width = pct + '%';
  wavePlayhead.style.left  = pct + '%';
});

function setBadge(text) {
  if (voiceBadgeText) voiceBadgeText.textContent = text;
}

function onVoiceStart() {
  window.voiceActive = true;
  voicePlayer.classList.add('playing');
  setBadge('Playing');
  if (window.fadeOutBgMusic) window.fadeOutBgMusic(BG_FADE_OUT_MS);
}

function onVoiceStop(label) {
  window.voiceActive = false;
  voicePlayer.classList.remove('playing');
  setBadge(label);
  if (window.fadeInBgMusic) window.fadeInBgMusic(BG_FADE_IN_MS);
}

function togglePlay() {
  if (voiceAudio.paused) {
    voiceAudio.play().catch((err) => {
      console.warn('Play failed:', err);
      setBadge('Error');
    });
  } else {
    voiceAudio.pause();
  }
}

playBtn.addEventListener('click', togglePlay);

backBtn.addEventListener('click', () => {
  voiceAudio.currentTime = Math.max(0, voiceAudio.currentTime - 10);
});

fwdBtn.addEventListener('click', () => {
  voiceAudio.currentTime = Math.min(
    voiceAudio.duration || 0,
    voiceAudio.currentTime + 10
  );
});

voiceAudio.addEventListener('play', onVoiceStart);

voiceAudio.addEventListener('pause', () => {
  if (voiceAudio.ended) return;
  onVoiceStop('Paused');
});

voiceAudio.addEventListener('ended', () => {
  onVoiceStop('Ready');
  voiceAudio.currentTime = 0;

  bars.forEach(b => b.classList.remove('active', 'near'));
  waveProgress.style.width = '0%';
  wavePlayhead.style.left  = '0%';
  currentTimeEl.textContent = '0:00';
});

let isSeeking = false;

function seekFromEvent(e) {
  const rect = waveWrap.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const x = clientX - rect.left;
  const pct = Math.max(0, Math.min(1, x / rect.width));

  if (isFinite(voiceAudio.duration) && voiceAudio.duration > 0) {
    voiceAudio.currentTime = pct * voiceAudio.duration;
  }

  waveProgress.style.width = (pct * 100) + '%';
  wavePlayhead.style.left  = (pct * 100) + '%';
}

waveWrap.addEventListener('mousedown', (e) => {
  isSeeking = true;
  seekFromEvent(e);
});

window.addEventListener('mousemove', (e) => {
  if (isSeeking) seekFromEvent(e);
});

window.addEventListener('mouseup', () => {
  isSeeking = false;
});

waveWrap.addEventListener('touchstart', (e) => {
  isSeeking = true;
  seekFromEvent(e);
}, { passive: true });

waveWrap.addEventListener('touchmove', (e) => {
  if (isSeeking) seekFromEvent(e);
}, { passive: true });

waveWrap.addEventListener('touchend', () => {
  isSeeking = false;
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  }
  if (e.code === 'ArrowLeft') {
    backBtn.click();
  }
  if (e.code === 'ArrowRight') {
    fwdBtn.click();
  }
});

setBadge('Ready');