(function () {
  const css = `
    .pets-container {
      position: fixed;
      bottom: 72px;
      left: 0;
      right: 0;
      height: 220px;
      pointer-events: none;
      z-index: 45;
    }

    .pet {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 74px;
      height: 120px;
      pointer-events: auto;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      transform-origin: bottom center;
      will-change: transform;
    }

    .pet-shadow {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 9px;
      background: radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%);
      border-radius: 50%;
      animation: petShadow 2.8s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    }

    @keyframes petShadow {
      0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.55; }
      50%      { transform: translateX(-50%) scaleX(0.85); opacity: 0.35; }
    }

    .pet-body {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 64px;
      height: 104px;
      transform-origin: center bottom;
      will-change: transform;
    }

    .pet:not(.walking) .pet-body {
      animation: petIdle 2.8s ease-in-out infinite;
    }

    @keyframes petIdle {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50%      { transform: translateX(-50%) translateY(-3px); }
    }

    .pet.walking .pet-body {
      animation: petWalk 0.4s ease-in-out infinite;
    }

    @keyframes petWalk {
      0%, 100% { transform: translateX(-50%) translateY(0) rotate(-2deg); }
      25%      { transform: translateX(-50%) translateY(-5px) rotate(0deg); }
      50%      { transform: translateX(-50%) translateY(0) rotate(2deg); }
      75%      { transform: translateX(-50%) translateY(-5px) rotate(0deg); }
    }

    .pet.pet-react .pet-body {
      animation: petReact 0.7s cubic-bezier(0.4, 1.6, 0.6, 1) !important;
    }

    @keyframes petReact {
      0%   { transform: translateX(-50%) translateY(0) scale(1) rotate(0deg); }
      30%  { transform: translateX(-50%) translateY(-24px) scale(1.12) rotate(-10deg); }
      55%  { transform: translateX(-50%) translateY(-6px) scale(0.96) rotate(6deg); }
      100% { transform: translateX(-50%) translateY(0) scale(1) rotate(0deg); }
    }

    .pet-bubble {
      position: absolute;
      bottom: calc(100% - 4px);
      left: 50%;
      transform: translateX(-50%) translateY(6px) scale(0.85);
      background: #f2ece6;
      color: #2a1f17;
      padding: 7px 14px;
      border-radius: 14px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 1.6, 0.6, 1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.15);
      z-index: 100;
      border: 2px solid #2a1f17;
      letter-spacing: 0.01em;
    }

    .pet-bubble::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 9px solid #2a1f17;
    }

    .pet-bubble::before {
      content: '';
      position: absolute;
      top: calc(100% - 2px);
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 7px solid #f2ece6;
      z-index: 1;
    }

    .pet-bubble.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }

    .pet-head,
    .pet-torso,
    .pet-arm,
    .pet-leg,
    .pet-foot,
    .pet-wing {
      position: absolute;
    }

    .pet-eye {
      position: absolute;
      width: 7px;
      height: 8px;
      background: #1a1010;
      border-radius: 50%;
      z-index: 5;
      animation: petBlink 4s ease-in-out infinite;
    }

    .pet-eye::after {
      content: '';
      position: absolute;
      top: 1px;
      right: 1px;
      width: 3px;
      height: 3px;
      background: #ffffff;
      border-radius: 50%;
    }

    @keyframes petBlink {
      0%, 88%, 100% { transform: scaleY(1); }
      92%           { transform: scaleY(0.1); }
    }

    .xiaoxuan .pet-ear {
      position: absolute;
      top: 2px;
      width: 22px;
      height: 22px;
      background: radial-gradient(circle at 35% 30%, #b8855a 0%, #7a5236 100%);
      border: 2.5px solid #3a2415;
      border-radius: 50%;
      z-index: 1;
    }
    .xiaoxuan .pet-ear.left  { left: 4px; }
    .xiaoxuan .pet-ear.right { right: 4px; }

    .xiaoxuan .pet-ear::after {
      content: '';
      position: absolute;
      inset: 4px;
      background: #e8b8a8;
      border-radius: 50%;
    }

    .xiaoxuan .pet-head {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 54px;
      height: 50px;
      background: radial-gradient(circle at 38% 32%, #b8855a 0%, #7a5236 100%);
      border: 2.5px solid #3a2415;
      border-radius: 50% 50% 48% 48% / 55% 55% 45% 45%;
      z-index: 3;
    }

    .xiaoxuan .pet-snout {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 20px;
      background: linear-gradient(180deg, #f5dcb8 0%, #e8c9a4 100%);
      border-radius: 50%;
      z-index: 4;
      box-shadow: inset 0 -2px 3px rgba(0,0,0,0.1);
    }

    .xiaoxuan .pet-nose {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      height: 8px;
      background: radial-gradient(circle at 40% 30%, #3a2a20 0%, #1a1010 100%);
      border-radius: 50% 50% 45% 45%;
      z-index: 6;
    }

    .xiaoxuan .pet-mouth {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      height: 5px;
      border-bottom: 2px solid #3a2415;
      border-radius: 0 0 50% 50%;
      z-index: 6;
    }

    .xiaoxuan .pet-eye.left  { top: 20px; left: 12px; }
    .xiaoxuan .pet-eye.right { top: 20px; right: 12px; }

    .xiaoxuan .pet-cheek {
      position: absolute;
      top: 30px;
      width: 10px;
      height: 6px;
      background: rgba(232, 130, 100, 0.65);
      border-radius: 50%;
      z-index: 4;
      filter: blur(0.3px);
    }
    .xiaoxuan .pet-cheek.left  { left: 4px; }
    .xiaoxuan .pet-cheek.right { right: 4px; }

    .xiaoxuan .pet-torso {
      top: 52px;
      left: 50%;
      transform: translateX(-50%);
      width: 52px;
      height: 48px;
      background: radial-gradient(circle at 38% 30%, #b8855a 0%, #7a5236 100%);
      border: 2.5px solid #3a2415;
      border-radius: 50% 50% 45% 45% / 40% 40% 60% 60%;
      z-index: 2;
    }

    .xiaoxuan .pet-belly {
      position: absolute;
      top: 62px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 32px;
      background: linear-gradient(180deg, #f5dcb8 0%, #e8c9a4 100%);
      border-radius: 50% 50% 45% 45%;
      z-index: 3;
    }

    .xiaoxuan .pet-arm {
      top: 58px;
      width: 18px;
      height: 16px;
      background: radial-gradient(circle at 35% 30%, #a5754f 0%, #6a4229 100%);
      border: 2.5px solid #3a2415;
      border-radius: 50%;
      z-index: 1;
      transform-origin: 50% 20%;
    }
    .xiaoxuan .pet-arm.left {
      left: -3px;
      animation: xiaoxuanArmLeft 0.5s ease-in-out infinite;
    }
    .xiaoxuan .pet-arm.right {
      right: -3px;
      animation: xiaoxuanArmRight 0.5s ease-in-out infinite;
    }

    .pet:not(.walking) .xiaoxuan .pet-arm.left  { animation: none; transform: rotate(6deg); }
    .pet:not(.walking) .xiaoxuan .pet-arm.right { animation: none; transform: rotate(-6deg); }

    @keyframes xiaoxuanArmLeft {
      0%, 100% { transform: rotate(10deg); }
      50%      { transform: rotate(-14deg); }
    }
    @keyframes xiaoxuanArmRight {
      0%, 100% { transform: rotate(-10deg); }
      50%      { transform: rotate(14deg); }
    }

    .xiaoxuan .pet-leg {
      bottom: 0;
      width: 22px;
      height: 14px;
      background: radial-gradient(circle at 35% 30%, #8a5e3e 0%, #5a3a25 100%);
      border: 2.5px solid #3a2415;
      border-radius: 50%;
      z-index: 1;
      transform-origin: 50% 20%;
    }
    .xiaoxuan .pet-leg.left  { left: 6px; }
    .xiaoxuan .pet-leg.right { right: 6px; }

    .pet.walking .xiaoxuan .pet-leg.left {
      animation: xiaoxuanLegLeft 0.4s ease-in-out infinite;
    }
    .pet.walking .xiaoxuan .pet-leg.right {
      animation: xiaoxuanLegRight 0.4s ease-in-out infinite;
    }

    @keyframes xiaoxuanLegLeft {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-3px); }
    }
    @keyframes xiaoxuanLegRight {
      0%, 100% { transform: translateY(-3px); }
      50%      { transform: translateY(0); }
    }

    .xiaofei .pet-head {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 52px;
      height: 48px;
      background: radial-gradient(circle at 38% 32%, #4a5a6a 0%, #1a2430 100%);
      border: 2.5px solid #0a1018;
      border-radius: 50% 50% 48% 48% / 55% 55% 45% 45%;
      z-index: 3;
    }

    .xiaofei .pet-face {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 38px;
      height: 34px;
      background: linear-gradient(180deg, #fdfaf3 0%, #f2ece6 100%);
      border-radius: 50% 50% 48% 48%;
      z-index: 4;
      box-shadow: inset 0 -2px 4px rgba(0,0,0,0.06);
    }

    .xiaofei .pet-eye.left  { top: 11px; left: 8px; z-index: 6; }
    .xiaofei .pet-eye.right { top: 11px; right: 8px; z-index: 6; }

    .xiaofei .pet-cheek {
      position: absolute;
      top: 22px;
      width: 8px;
      height: 5px;
      background: rgba(232, 130, 120, 0.7);
      border-radius: 50%;
      z-index: 6;
      filter: blur(0.3px);
    }
    .xiaofei .pet-cheek.left  { left: 4px; }
    .xiaofei .pet-cheek.right { right: 4px; }

    .xiaofei .pet-beak {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 9px solid #ff9d4d;
      z-index: 7;
      filter: drop-shadow(0 1px 0 #b5662e);
    }

    .xiaofei .pet-torso {
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      width: 48px;
      height: 52px;
      background: radial-gradient(circle at 38% 30%, #4a5a6a 0%, #1a2430 100%);
      border: 2.5px solid #0a1018;
      border-radius: 50% 50% 45% 45% / 40% 40% 60% 60%;
      z-index: 2;
    }

    .xiaofei .pet-belly {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 38px;
      background: linear-gradient(180deg, #fdfaf3 0%, #f2ece6 100%);
      border-radius: 50% 50% 45% 45%;
      z-index: 3;
      box-shadow: inset 0 -3px 5px rgba(0,0,0,0.05);
    }

    .xiaofei .pet-wing {
      top: 56px;
      width: 14px;
      height: 28px;
      background: linear-gradient(180deg, #3a4a5a 0%, #1a2430 100%);
      border: 2.5px solid #0a1018;
      border-radius: 50% 50% 60% 60% / 30% 30% 70% 70%;
      z-index: 1;
      transform-origin: 50% 8%;
      box-shadow: inset -2px 0 3px rgba(0, 0, 0, 0.4);
    }

    .xiaofei .pet-wing.left {
      left: -4px;
      border-radius: 60% 50% 70% 50% / 30% 40% 70% 60%;
    }

    .xiaofei .pet-wing.right {
      right: -4px;
      border-radius: 50% 60% 50% 70% / 40% 30% 60% 70%;
    }

    .pet:not(.walking) .xiaofei .pet-wing.left  { transform: rotate(4deg); }
    .pet:not(.walking) .xiaofei .pet-wing.right { transform: rotate(-4deg); }

    .pet.walking .xiaofei .pet-wing.left  { animation: penguinWingLeft 0.6s ease-in-out infinite; }
    .pet.walking .xiaofei .pet-wing.right { animation: penguinWingRight 0.6s ease-in-out infinite; }

    @keyframes penguinWingLeft {
      0%, 100% { transform: rotate(6deg); }
      50%      { transform: rotate(-12deg); }
    }
    @keyframes penguinWingRight {
      0%, 100% { transform: rotate(-6deg); }
      50%      { transform: rotate(12deg); }
    }

    .xiaofei .pet-foot {
      bottom: 0;
      width: 22px;
      height: 10px;
      background: radial-gradient(circle at 35% 30%, #ffb866 0%, #ff9d4d 100%);
      border: 2.5px solid #b5662e;
      border-radius: 50% 50% 40% 40%;
      z-index: 1;
      transform-origin: 50% 20%;
    }
    .xiaofei .pet-foot.left  { left: 4px; }
    .xiaofei .pet-foot.right { right: 4px; }

    .pet.walking .xiaofei .pet-foot.left {
      animation: penguinFootLeft 0.4s ease-in-out infinite;
    }
    .pet.walking .xiaofei .pet-foot.right {
      animation: penguinFootRight 0.4s ease-in-out infinite;
    }

    @keyframes penguinFootLeft {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-3px); }
    }
    @keyframes penguinFootRight {
      0%, 100% { transform: translateY(-3px); }
      50%      { transform: translateY(0); }
    }

    .pet-heart {
      position: fixed;
      font-size: 22px;
      pointer-events: none;
      z-index: 9999;
      animation: petHeartFloat 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    @keyframes petHeartFloat {
      0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
      }
      20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        transform: translate(
          calc(-50% + var(--tx, 0px)),
          calc(-50% + var(--ty, -70px))
        ) scale(1.2);
        opacity: 0;
      }
    }

    .pet-sparkle {
      position: fixed;
      font-size: 12px;
      pointer-events: none;
      z-index: 9998;
      animation: petSparkle 0.9s ease-out forwards;
    }

    @keyframes petSparkle {
      0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
      }
      30% {
        opacity: 0.9;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        transform: translate(-50%, -30%) scale(0.3);
        opacity: 0;
      }
    }

    @media (max-width: 500px) {
      .pets-container {
        bottom: 90px;
        height: 180px;
      }
      .pet {
        width: 62px;
        height: 100px;
      }
      .pet-body {
        width: 54px;
        height: 88px;
      }
      .pet-bubble {
        font-size: 0.68rem;
        padding: 5px 10px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pet-body,
      .pet-shadow,
      .pet-eye,
      .pet-arm,
      .pet-leg,
      .pet-wing,
      .pet-foot {
        animation: none !important;
      }
    }
  `;

  const style = document.createElement('style');
  style.id = 'petsStyles';
  style.textContent = css;
  document.head.appendChild(style);

  const PETS = [
    {
      id: 'xiaoxuan',
      name: 'xiaoxuan',
      kind: 'xiaoxuan',
      speed: 0.9,
      startX: 0.25,
      messages: ['halo koko caya xiao xuan', 'huaa xiao xuan lapar', 'Happy birthday sayang ♡','🫶', 'koko rindu cece yaa hihihi'],
    },
    {
      id: 'xiaofei',
      name: 'xiaofei',
      kind: 'xiaofei',
      speed: 1.3,
      startX: 0.7,
      messages: ['halo koko caya xiao fei', 'huaa dingin', 'mwah sayang koko', 'xiao fei mau es krim'],
    },
  ];

  const PET_SCALE = 0.8;

  const STATE = { IDLE: 'idle', WALKING: 'walking' };

  function buildBearHTML() {
    return `
      <div class="pet-shadow"></div>
      <div class="pet-bubble"></div>
      <div class="pet-body">
        <div class="pet-ear left"></div>
        <div class="pet-ear right"></div>
        <div class="pet-head">
          <div class="pet-eye left"></div>
          <div class="pet-eye right"></div>
          <div class="pet-cheek left"></div>
          <div class="pet-cheek right"></div>
          <div class="pet-snout"></div>
          <div class="pet-nose"></div>
          <div class="pet-mouth"></div>
        </div>
        <div class="pet-torso"></div>
        <div class="pet-belly"></div>
        <div class="pet-arm left"></div>
        <div class="pet-arm right"></div>
        <div class="pet-leg left"></div>
        <div class="pet-leg right"></div>
      </div>
    `;
  }

  function buildPenguinHTML() {
    return `
      <div class="pet-shadow"></div>
      <div class="pet-bubble"></div>
      <div class="pet-body">
        <div class="pet-head">
          <div class="pet-face">
            <div class="pet-eye left"></div>
            <div class="pet-eye right"></div>
            <div class="pet-cheek left"></div>
            <div class="pet-cheek right"></div>
            <div class="pet-beak"></div>
          </div>
        </div>
        <div class="pet-torso"></div>
        <div class="pet-belly"></div>
        <div class="pet-wing left"></div>
        <div class="pet-wing right"></div>
        <div class="pet-foot left"></div>
        <div class="pet-foot right"></div>
      </div>
    `;
  }

  const container = document.createElement('div');
  container.className = 'pets-container';
  container.id = 'petsContainer';
  document.body.appendChild(container);

  const petList = [];
  const sparkleEmojis = ['✨', '⭐', '💫', '🌟'];

  PETS.forEach((config) => {
    const el = document.createElement('div');
    el.className = `pet ${config.kind}`;
    el.dataset.petId = config.id;

    el.innerHTML = config.kind === 'xiaoxuan'
      ? buildBearHTML()
      : buildPenguinHTML();

    container.appendChild(el);

    const pet = {
      el,
      config,
      x: window.innerWidth * config.startX,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: config.speed,
      state: STATE.IDLE,
      stateTimer: 0,
      walkDuration: 0,
      bubbleCooldown: 0,
      sparkleTimer: 0,
      _bubbleTimer: null,
    };

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      reactToClick(pet);
    });

    petList.push(pet);
  });

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min((now - lastTime) / 16.67, 2);
    lastTime = now;

    petList.forEach((pet) => {
      updatePet(pet, dt);
      renderPet(pet);
    });

    requestAnimationFrame(loop);
  }

  function updatePet(pet, dt) {
    pet.stateTimer += dt;
    pet.bubbleCooldown = Math.max(0, pet.bubbleCooldown - dt);

    if (pet.state === STATE.IDLE) {
      if (pet.stateTimer > 60 + Math.random() * 120) {
        pet.state = STATE.WALKING;
        pet.stateTimer = 0;
        pet.walkDuration = 60 + Math.random() * 140;

        if (Math.random() > 0.5) pet.direction *= -1;

        maybeSpeak(pet);
      }
    } else if (pet.state === STATE.WALKING) {
      pet.walkDuration -= dt;

      pet.x += pet.speed * pet.direction * dt;

      pet.sparkleTimer -= dt;
      if (pet.sparkleTimer <= 0) {
        pet.sparkleTimer = 10 + Math.random() * 12;
        spawnSparkle(pet);
      }

      const margin = 40;
      const maxX = window.innerWidth - margin;

      if (pet.x < margin) {
        pet.x = margin;
        pet.direction = 1;
      } else if (pet.x > maxX) {
        pet.x = maxX;
        pet.direction = -1;
      }

      if (pet.walkDuration <= 0) {
        pet.state = STATE.IDLE;
        pet.stateTimer = 0;

        if (Math.random() > 0.6) maybeSpeak(pet);
      }
    }
  }

  function renderPet(pet) {
    const el = pet.el;

    el.style.transform = `translate3d(${pet.x}px, 0, 0) translateX(-50%) scale(${PET_SCALE})`;

    const body   = el.querySelector('.pet-body');
    const shadow = el.querySelector('.pet-shadow');

    const flipVal = pet.direction > 0 ? '-1 1' : '1 1';
    if (body)   body.style.scale   = flipVal;
    if (shadow) shadow.style.scale = flipVal;

    el.classList.toggle('walking', pet.state === STATE.WALKING);
  }

  function spawnSparkle(pet) {
    const rect = pet.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + (Math.random() - 0.5) * 30;
    const cy = rect.bottom - 10 + Math.random() * 10;

    const s = document.createElement('span');
    s.className = 'pet-sparkle';
    s.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    s.style.left = cx + 'px';
    s.style.top = cy + 'px';
    s.style.color = pet.config.kind === 'xiaoxuan' ? '#ffd77a' : '#a8d8ea';

    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  function reactToClick(pet) {
    const el = pet.el;

    el.classList.add('pet-react');
    setTimeout(() => el.classList.remove('pet-react'), 750);

    const bubble = el.querySelector('.pet-bubble');
    const messages = pet.config.messages;
    bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
    bubble.classList.add('show');
    clearTimeout(pet._bubbleTimer);
    pet._bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1500);

    pet.bubbleCooldown = 200;

    spawnHearts(el);
  }

  function maybeSpeak(pet) {
    if (pet.bubbleCooldown > 0) return;
    if (Math.random() > 0.7) {
      const bubble = pet.el.querySelector('.pet-bubble');
      const messages = pet.config.messages;
      bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
      bubble.classList.add('show');
      clearTimeout(pet._bubbleTimer);
      pet._bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1700);
      pet.bubbleCooldown = 300;
    }
  }

  function spawnHearts(anchor) {
    const rect = anchor.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const emojis = ['💙', '💕', '✨', '🫶', '🤍', '🍯', '❄️'];
    const count = 8;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'pet-heart';
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 40 + Math.random() * 40;
      s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--ty', Math.sin(angle) * dist - 40 + 'px');
      s.style.animationDelay = i * 0.05 + 's';

      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1500);
    }
  }

  window.addEventListener('resize', () => {
    petList.forEach((pet) => {
      const maxX = window.innerWidth - 40;
      if (pet.x > maxX) pet.x = maxX;
      if (pet.x < 40) pet.x = 40;
    });
  });

  document.addEventListener('visibilitychange', () => {
    lastTime = performance.now();
  });

  requestAnimationFrame(loop);
})();