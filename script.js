/* ============================================
   PRIMROSE — Special Ramadan Experience
   Main Script: Particles, Scenes, Interactions
   ============================================ */

// ─── GIF Stages (progressively sadder) ───
const gifStages = [
  "https://media1.tenor.com/m/ib9cT_-tG3oAAAAC/cat-whale.gif",          // happy waving
  "https://media1.tenor.com/m/W--wa2UZQAUAAAAC/cat-whale.gif",           // shocked
  "https://media1.tenor.com/m/O9HNKrRe-l0AAAAC/cat-whale.gif",           // shy / blushing
  "https://media1.tenor.com/m/29l5JSTkY7IAAAAC/cat-whale.gif",           // sulking
  "https://media1.tenor.com/m/erdZZKySwvoAAAAC/cat-whale.gif",            // shivering
  "https://media1.tenor.com/m/WNO66mz9mg0AAAAC/cat-whale.gif",           // exhausted
  "https://media1.tenor.com/m/Z5JKxYkzvgcAAAAC/cat-whale.gif",           // crying
  "https://media1.tenor.com/m/AYvZCMQD7OcAAAAC/animal-whale.gif",        // drowning in tears
];

// ─── No-button messages ───
const noMessages = [
  "No",
  "Are you sure? 🤔",
  "Pookie please... 🥺",
  "I'll be really sad fasting alone...",
  "I'll buy you your favorite takjil! 😢",
  "Don't do this to me... 💔",
  "It's the month of giving, give me your time 🕌",
  "Last chance! 😭",
  "You can't catch me anyway 😜",
];

// ─── Yes-button tease messages (before runaway is enabled) ───
const yesTeasePokes = [
  "trying to say no to free takjil? 😏",
  "go on, hit no... you know you want my company 👀",
  "missing out on a great Iftar date 😈",
  "click no, I double dare you 😏",
];

// ─── State ───
let noClickCount = 0;
let yesTeasedCount = 0;
let runawayEnabled = false;
let musicPlaying = false;
let currentScene = "envelope";

// ─── DOM ───
const catGif = document.getElementById("cat-gif");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

// ============================================
// PARTICLE SYSTEM (Stars)
// ============================================
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20 + Math.random() * 40;
    this.size = Math.random() * 14 + 6;
    this.speedY = -(Math.random() * 0.6 + 0.15);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    // Type: 0 = 8-point star, 1 = 4-point sparkle
    this.type = Math.random() < 0.3 ? 0 : 1;
    // Green and Gold hues
    this.hue =
      Math.random() < 0.5 ? 40 + Math.random() * 15 : 140 + Math.random() * 30;
    this.saturation = 60 + Math.random() * 30;
  }

  update() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.rotation += this.rotationSpeed;

    if (this.y < -30) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    if (this.type === 0) {
      // 8-point Islamic star
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 70%, 1)`;
      const s = this.size * 0.6;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const outerX = Math.cos(angle) * s;
        const outerY = Math.sin(angle) * s;
        const innerAngle = angle + Math.PI / 8;
        const innerX = Math.cos(innerAngle) * s * 0.4;
        const innerY = Math.sin(innerAngle) * s * 0.4;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      // Sparkle (4-point star)
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 85%, 1)`;
      const s = this.size * 0.45;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = Math.cos(angle) * s;
        const outerY = Math.sin(angle) * s;
        const innerAngle = angle + Math.PI / 4;
        const innerX = Math.cos(innerAngle) * s * 0.3;
        const innerY = Math.sin(innerAngle) * s * 0.3;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

// Init particles
function initParticles(count = 45) {
  particles = [];
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    // Spread initial y positions across the screen
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ============================================
// SCENE MANAGEMENT
// ============================================
function switchScene(to) {
  const scenes = document.querySelectorAll(".scene");
  scenes.forEach((s) => s.classList.remove("active"));

  setTimeout(() => {
    document.getElementById(`scene-${to}`).classList.add("active");
    currentScene = to;
  }, 100);
}

// ============================================
// SCENE 1: ENVELOPE
// ============================================
const envelopeTrigger = document.getElementById("envelope-trigger");
const envelope = document.getElementById("envelope");
let envelopeOpened = false;

envelopeTrigger.addEventListener("click", () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  envelope.classList.add("opening");

  // Start music on interaction
  startMusic();

  // Transition to question scene after animation
  setTimeout(() => {
    switchScene("question");
  }, 2000);
});

// Also handle touch
envelopeTrigger.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    envelopeTrigger.click();
  },
  { passive: false },
);

// ============================================
// SCENE 2: QUESTION — Button Handlers
// ============================================
yesBtn.addEventListener("click", handleYesClick);
noBtn.addEventListener("click", handleNoClick);

function handleYesClick() {
  if (!runawayEnabled) {
    const msg =
      yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
    yesTeasedCount++;
    showTeaseMessage(msg);
    return;
  }
  // Transition to celebration
  switchScene("celebration");
  setTimeout(launchCelebration, 400);
}

function showTeaseMessage(msg) {
  const toast = document.getElementById("tease-toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function handleNoClick() {
  noClickCount++;

  // Guilt-trip messages
  const msgIndex = Math.min(noClickCount, noMessages.length - 1);
  noBtn.textContent = noMessages[msgIndex];

  // Grow Yes button
  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
  yesBtn.style.fontSize = `${currentSize * 1.3}px`;
  const padY = Math.min(16 + noClickCount * 5, 55);
  const padX = Math.min(42 + noClickCount * 10, 110);
  yesBtn.style.padding = `${padY}px ${padX}px`;

  // Keep No button always visible (no shrinking)

  // Swap GIF
  const gifIndex = Math.min(noClickCount, gifStages.length - 1);
  swapGif(gifStages[gifIndex]);

  // Enable runaway after 5 clicks
  if (noClickCount >= 5 && !runawayEnabled) {
    enableRunaway();
    runawayEnabled = true;
  }
}

function swapGif(src) {
  catGif.style.opacity = "0";
  setTimeout(() => {
    catGif.src = src;
    catGif.style.opacity = "1";
  }, 250);
}

function enableRunaway() {
  noBtn.addEventListener("mouseover", runAway);
  noBtn.addEventListener("touchstart", runAway, { passive: true });
}

function runAway() {
  const margin = 24;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;

  const randomX = Math.random() * maxX + margin / 2;
  const randomY = Math.random() * maxY + margin / 2;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.zIndex = "50";
}

// ============================================
// SCENE 3: CELEBRATION
// ============================================
function launchCelebration() {
  // Big initial burst (Emerald and Gold colors)
  const colors = [
    "#1b8a53",
    "#34d399",
    "#6ee7b7",
    "#d4a574",
    "#f0d0a8",
    "#ffffff",
    "#fef08a",
  ];

  confetti({
    particleCount: 180,
    spread: 120,
    origin: { x: 0.5, y: 0.35 },
    colors,
    startVelocity: 45,
    gravity: 0.8,
  });

  // Side cannons
  const duration = 5000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      startVelocity: 35,
    });

    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      startVelocity: 35,
    });
  }, 350);

  // Start typewriter
  setTimeout(startTypewriter, 800);

  // Extra burst of particles
  for (let i = 0; i < 20; i++) {
    const p = new Particle();
    p.opacity = Math.random() * 0.4 + 0.1;
    p.speedY = -(Math.random() * 1.2 + 0.4);
    particles.push(p);
  }
}

function startTypewriter() {
  const message =
    "I'm so happy! Let's break our fast together and make this Ramadan extra special ✨💕";
  const el = document.getElementById("typewriter-text");
  const cursor = document.getElementById("typewriter-cursor");
  let i = 0;

  function type() {
    if (i < message.length) {
      el.textContent += message.charAt(i);
      i++;
      const delay =
        message.charAt(i - 1) === "."
          ? 300
          : message.charAt(i - 1) === ","
            ? 150
            : message.charAt(i - 1) === " "
              ? 60
              : 35 + Math.random() * 25;
      setTimeout(type, delay);
    } else {
      // Hide cursor after typing is done
      setTimeout(() => {
        cursor.style.display = "none";
      }, 2000);
    }
  }

  type();
}

// ============================================
// MUSIC
// ============================================
music.volume = 0.3;

function startMusic() {
  music
    .play()
    .then(() => {
      musicPlaying = true;
      musicToggle.textContent = "🔊";
    })
    .catch(() => {
      // Will try again on next user interaction
    });
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicToggle.textContent = "🔇";
  } else {
    music
      .play()
      .then(() => {
        musicPlaying = true;
        musicToggle.textContent = "🔊";
      })
      .catch(() => {});
  }
});
