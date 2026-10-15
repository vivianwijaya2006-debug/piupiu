const bgMusic     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const navbar      = document.querySelector('.navbar');
const currentPage = document.body.dataset.page;

const PLAYLIST = [
  { title: 'Song One',   src: 'assets/audio/song3.mp3' },
  { title: 'Song Two',   src: 'assets/audio/song1.mp3' },
  { title: 'Song Three', src: 'assets/audio/song2.mp3' },
];

const DEFAULT_VOLUME = 0.35;

let currentTrack = 0;
let musicStarted = false;
let failedTracks = 0;

const savedTrack = parseInt(sessionStorage.getItem('musicTrack') || '0', 10);
if (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < PLAYLIST.length) {
  currentTrack = savedTrack;
}

window.voiceActive = false;

function setTrack(index, autoplay = false, resume = false) {
  if (!bgMusic || !PLAYLIST[index]) return;

  currentTrack = index;
  sessionStorage.setItem('musicTrack', currentTrack);

  bgMusic.src = PLAYLIST[index].src;
  bgMusic.load();

  bgMusic.addEventListener('loadedmetadata', () => {
    failedTracks = 0;

    if (resume) {
      const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
      if (savedTime > 0 && savedTime < bgMusic.duration) {
        try { bgMusic.currentTime = savedTime; } catch (e) {}
      }
    }

    if (autoplay && !window.voiceActive) {
      bgMusic.play().then(() => {
        musicStarted = true;
        if (musicToggle) musicToggle.classList.add('playing');
      }).catch(() => {});
    }
  }, { once: true });
}

let fadeTimer = null;
let bgWasPlaying = false;

function fadeVolume(target, duration, onDone) {
  if (!bgMusic) return;
  clearInterval(fadeTimer);

  const start = bgMusic.volume;
  const stepMs = 50;
  const steps = Math.max(1, Math.round(duration / stepMs));
  let i = 0;

  fadeTimer = setInterval(() => {
    i++;
    const v = start + (target - start) * (i / steps);
    bgMusic.volume = Math.max(0, Math.min(1, v));

    if (i >= steps) {
      clearInterval(fadeTimer);
      fadeTimer = null;
      if (onDone) onDone();
    }
  }, stepMs);
}

window.fadeOutBgMusic = function (duration = 2500) {
  if (!bgMusic || bgMusic.paused) return;

  bgWasPlaying = true;

  fadeVolume(0, duration, () => {
    bgMusic.pause();
    bgMusic.volume = DEFAULT_VOLUME;
    if (musicToggle) musicToggle.classList.remove('playing');
  });
};

window.fadeInBgMusic = function (duration = 2000) {
  if (!bgMusic || !bgWasPlaying) return;
  bgWasPlaying = false;

  clearInterval(fadeTimer);

  const startFade = () => {
    musicStarted = true;
    if (musicToggle) musicToggle.classList.add('playing');
    fadeVolume(DEFAULT_VOLUME, duration);
  };

  if (bgMusic.paused) {
    bgMusic.volume = 0;
    bgMusic.play().then(startFade).catch(() => {
      bgMusic.volume = DEFAULT_VOLUME;
    });
  } else {
    startFade();
  }
};

function tryPlayMusic() {
  if (!bgMusic || musicStarted) return;
  if (window.voiceActive) return;

  bgMusic.play().then(() => {
    musicStarted = true;
    if (musicToggle) musicToggle.classList.add('playing');
    sessionStorage.setItem('musicPlaying', 'true');
  }).catch(() => {
  });
}

function handleFirstInteraction(e) {
  if (musicStarted) return;
  if (e && e.target && e.target.closest && e.target.closest('#voicePlayer')) return;
  if (
    e && e.type === 'keydown' &&
    currentPage === 'voice' &&
    ['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)
  ) return;

  tryPlayMusic();
}

function attachInteractionListeners() {
  const events = ['click', 'touchstart', 'keydown', 'scroll'];

  events.forEach(evt => {
    document.addEventListener(evt, handleFirstInteraction, {
      once: false,
      passive: true,
      capture: true,
    });
  });
}

function cleanupInteractionListeners() {
  const events = ['click', 'touchstart', 'keydown', 'scroll'];
  events.forEach(evt => {
    document.removeEventListener(evt, handleFirstInteraction, true);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (bgMusic) {
    bgMusic.volume = DEFAULT_VOLUME;

    setTrack(currentTrack, false, true);

    bgMusic.addEventListener('loadedmetadata', () => {
      tryPlayMusic();

      if (!musicStarted) {
        attachInteractionListeners();
      }
    }, { once: true });
  }
});

setInterval(() => {
  if (musicStarted && bgMusic && !bgMusic.paused) {
    cleanupInteractionListeners();
  }
}, 1000);

if (bgMusic) {
  setInterval(() => {
    if (!bgMusic.paused) {
      sessionStorage.setItem('musicPlaying', 'true');
      sessionStorage.setItem('musicTime', bgMusic.currentTime);
      sessionStorage.setItem('musicTrack', currentTrack);
    } else {
      sessionStorage.setItem('musicPlaying', 'false');
    }
  }, 500);
}

if (bgMusic) {
  bgMusic.addEventListener('ended', () => {
    sessionStorage.setItem('musicTime', '0');
    const next = (currentTrack + 1) % PLAYLIST.length;
    setTrack(next, true);
  });

  bgMusic.addEventListener('error', () => {
    if (!bgMusic.getAttribute('src')) return;

    console.warn('Lagu gagal dimuat:', bgMusic.src);

    failedTracks++;
    if (failedTracks >= PLAYLIST.length) {
      console.warn('Semua lagu gagal dimuat. Cek nama file & folder assets/audio/.');
      return;
    }

    sessionStorage.setItem('musicTime', '0');
    const next = (currentTrack + 1) % PLAYLIST.length;
    setTrack(next, musicStarted);
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicStarted = true;
        sessionStorage.setItem('musicPlaying', 'true');
        cleanupInteractionListeners();
      }).catch(() => {});
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      sessionStorage.setItem('musicPlaying', 'false');
    }
  });
}

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

window.launchConfetti = function () {
  const colors = ['#d97757', '#e88a6a', '#f2ece6', '#8a817a'];
  for (let i = 0; i < 50; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    c.style.animationDelay = (Math.random() * 0.8) + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
    c.style.opacity = 0.85;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
};

let isNavigating = false;

document.querySelectorAll('a[href$=".html"], a[href^="index"]').forEach(link => {
  if (link.target === '_blank') return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    if (bgMusic && !bgMusic.paused) {
      sessionStorage.setItem('musicPlaying', 'true');
      sessionStorage.setItem('musicTime', bgMusic.currentTime);
      sessionStorage.setItem('musicTrack', currentTrack);
    } else {
      sessionStorage.setItem('musicPlaying', 'false');
    }

    document.body.classList.add('page-leaving');

    setTimeout(() => {
      window.location.href = href;
    }, 350);
  });
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving');
  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
  });
});

function prefetchPages() {
  const seen = new Set();
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || seen.has(href)) return;
    seen.add(href);

    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  });
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(prefetchPages);
} else {
  setTimeout(prefetchPages, 1500);
}