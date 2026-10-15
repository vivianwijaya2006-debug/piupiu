const vouchers = [
  {
    icon: '🍦',
    code: 'ICE-001',
    title: 'Ice Cream Date',
    desc: 'Caya beliin sayangku 2 es krim, caya cepuluh hihihi',
  },
  {
    icon: '🫂',
    code: 'HUG-002',
    title: 'Peluk 10 Menit',
    desc: 'huaaa caya peluk sayang cepuluh menit hihihi',
  },
  {
    icon: '🧸',
    code: 'KISS-003',
    title: 'Kiss cepuluh kali',
    desc: 'Tapi karena sayangku macii kecik cayaa kiss jauh aja hihihi',
  },
  {
    icon: '🎬',
    code: 'MOV-004',
    title: 'Movie Date',
    desc: 'Sayang yang pilih filmnyaaa, nanti kita cama cama nonton',
  },
];

const giftGrid         = document.getElementById('giftGrid');
const giftModal        = document.getElementById('giftModal');
const modalIcon        = document.getElementById('modalIcon');
const modalCode        = document.getElementById('modalCode');
const modalTitle       = document.getElementById('modalTitle');
const modalDesc        = document.getElementById('modalDesc');
const modalBarcode     = document.getElementById('modalBarcode');
const modalSerial      = document.getElementById('modalSerial');
const modalStatus      = document.getElementById('modalStatus');
const modalClaim       = document.getElementById('modalClaim');
const modalClaimText   = document.getElementById('modalClaimText');
const giftTicket       = document.getElementById('giftTicket');
let usedVouchers = JSON.parse(localStorage.getItem('usedVouchers') || '[]');
let currentVoucher = null;

function renderCards() {
  giftGrid.innerHTML = '';

  vouchers.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.dataset.code = v.code;

    if (usedVouchers.includes(v.code)) card.classList.add('used');

    card.innerHTML = `
      <div class="gift-head">
        <span class="gift-icon">${v.icon}</span>
        <span class="gift-code">${v.code}</span>
      </div>
      <div class="gift-body">
        <h3 class="gift-title">${v.title}</h3>
        <p class="gift-desc">${v.desc}</p>
      </div>
      <div class="gift-foot">
        <span class="gift-valid">Berlaku</span>
        <span class="gift-hint">Lihat</span>
      </div>
      <span class="gift-stamp">Sudah Dipakai</span>
    `;

    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('click', () => openModal(v));
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.05}s`;

    giftGrid.appendChild(card);

    setTimeout(() => {
      card.style.opacity = '';
      card.style.transform = '';
      card.style.transition = '';
    }, 60);
  });

  updateProgress();
}

function handleTilt(e) {
  const card = e.currentTarget;
  if (card.classList.contains('used')) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const px = x / rect.width;
  const py = y / rect.height;

  const rotateY = (px - 0.5) * 12;
  const rotateX = (0.5 - py) * 12;

  card.style.setProperty('--rx', rotateX + 'deg');
  card.style.setProperty('--ry', rotateY + 'deg');
  card.style.setProperty('--mx', (px * 100) + '%');
  card.style.setProperty('--my', (py * 100) + '%');
  card.style.transition = 'transform 0.15s ease, border-color 0.3s ease, box-shadow 0.3s ease';
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
  card.style.setProperty('--mx', '50%');
  card.style.setProperty('--my', '50%');
  card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease';
}

function openModal(voucher) {
  currentVoucher = voucher;
  const isUsed = usedVouchers.includes(voucher.code);

  modalIcon.textContent = voucher.icon;
  modalCode.textContent = voucher.code;
  modalTitle.textContent = voucher.title;
  modalDesc.textContent = voucher.desc;

  modalBarcode.innerHTML = '';
  for (let i = 0; i < 42; i++) {
    const bar = document.createElement('span');
    bar.style.height = (30 + Math.random() * 40) + '%';
    bar.style.width = (Math.random() > 0.5 ? 2 : 3) + 'px';
    bar.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
    modalBarcode.appendChild(bar);
  }

  const serial = voucher.code.replace(/\D/g, '') + Math.floor(Math.random() * 9000 + 1000);
  modalSerial.textContent = formatSerial(serial);

  giftTicket.classList.toggle('used', isUsed);
  modalStatus.textContent = isUsed ? 'Sudah diklaim' : 'Ready to claim';
  modalClaimText.textContent = isUsed ? 'Sudah dipakai' : 'Claim voucher';
  modalClaim.disabled = isUsed;

  giftModal.classList.add('open');
  giftModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  giftModal.classList.remove('open');
  giftModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentVoucher = null;
}

function formatSerial(num) {
  const s = String(num).padStart(12, '0');
  return s.match(/.{1,4}/g).join(' ');
}

giftModal.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && giftModal.classList.contains('open')) {
    closeModal();
  }
});

modalClaim.addEventListener('click', () => {
  if (!currentVoucher) return;
  const v = currentVoucher;

  if (usedVouchers.includes(v.code)) return;

  usedVouchers.push(v.code);
  localStorage.setItem('usedVouchers', JSON.stringify(usedVouchers));

  giftTicket.classList.add('used');
  modalStatus.textContent = 'Sudah diklaim';
  modalClaimText.textContent = 'Sudah dipakai';
  modalClaim.disabled = true;

  const card = giftGrid.querySelector(`[data-code="${v.code}"]`);
  if (card) card.classList.add('used');

  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti();
  }

  spawnPop(v.icon, modalClaim);
  showToast(`"${v.title}" berhasil diklaim! 🎉`);
  updateProgress();

  if (usedVouchers.length === vouchers.length) {
    setTimeout(() => {
      showToast('Semua kupon udah kamu klaim. Aku siap ditagih 😅');
    }, 1800);
  }
});

function spawnPop(emoji, anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'pop-emoji';
  el.textContent = emoji;
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top = (rect.top + rect.height / 2) + 'px';
  el.style.fontSize = '40px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function showToast(text) {
  const existing = document.querySelector('.gift-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'gift-toast';
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

renderCards();