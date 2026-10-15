const photos = [
  { src: 'assets/images/photo1.jpeg',  label: 'Favorite', caption: 'One of my favorite days with you ♡' },
  { src: 'assets/images/photo2.jpeg',  label: 'Candid',   caption: 'That smile gets me every time' },
  { src: 'assets/images/photo3.jpeg',  label: 'Portrait', caption: 'You, just the way I love you' },
  { src: 'assets/images/photo4.jpeg',  label: 'Together', caption: 'My favorite kind of day is with you' },
  { src: 'assets/images/photo5.jpeg',  label: 'Sweet',    caption: 'You make ordinary days feel special' },
  { src: 'assets/images/photo6.jpeg',  label: 'Us',       caption: 'Here\u2019s to more little moments together ♡' },
  { src: 'assets/images/photo7.jpeg',  label: 'Golden',   caption: 'Somehow, you make every view better' },
  { src: 'assets/images/photo8.jpeg',  label: 'Little',   caption: 'Little things about you mean the most' },
  { src: 'assets/images/photo9.jpeg',  label: 'Sunday',   caption: 'If peace had a picture, it would be this' },
  { src: 'assets/images/photo10.jpeg', label: 'Smile',    caption: 'My favorite smile, always' },
  { src: 'assets/images/photo11.jpeg', label: 'Quiet',    caption: 'Even the quiet moments feel special with you' },
  { src: 'assets/images/photo12.jpeg', label: 'Forever',  caption: 'I hope we make a thousand more memories ♡' },
];

const galleryGrid    = document.getElementById('galleryGrid');
const galleryCount   = document.getElementById('galleryCount');
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption= document.getElementById('lightboxCaption');
const lightboxIndex  = document.getElementById('lightboxIndex');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');

let currentIndex = 0;
galleryCount.textContent = String(photos.length).padStart(2, '0');

photos.forEach((p, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.index = String(i + 1).padStart(2, '0');

  item.innerHTML = `
    <img src="${p.src}" alt="${p.caption}" loading="${i > 5 ? 'lazy' : 'eager'}" />
    <div class="caption">
      <span class="caption-label">${p.label}</span>
      <span class="caption-text">${p.caption}</span>
    </div>
    <span class="corner"></span>
  `;

  item.addEventListener('click', () => openLightbox(i));
  galleryGrid.appendChild(item);
});

const items = document.querySelectorAll('.gallery-item');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const idx = Array.from(items).indexOf(el);
      el.style.transitionDelay = `${Math.min(idx * 0.05, 0.6)}s`;
      el.classList.add('visible');
      io.unobserve(el);
    }
  });
}, { threshold: 0.08 });

items.forEach((el) => io.observe(el));

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const p = photos[currentIndex];
  lightboxImg.src = p.src;
  lightboxCaption.textContent = p.caption;
  const cur = String(currentIndex + 1).padStart(2, '0');
  const tot = String(photos.length).padStart(2, '0');
  lightboxIndex.textContent = `${cur} / ${tot}`;
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % photos.length;
  updateLightbox();
}

function prevPhoto() {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
});

let lbStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  lbStartX = e.touches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - lbStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextPhoto();
    else prevPhoto();
  }
}, { passive: true });