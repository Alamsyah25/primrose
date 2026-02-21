/* ============================================
   PRIMROSE — Aussie WHV Check-in Experience
   Main Script: Particles, Scenes, Interactions
   ============================================ */

const whvQuestions = [
  {
    title: "First things first... Have you accidentally eaten Vegemite thinking it was Nutella? 🍞",
    subtitle: "The classic rookie mistake.",
    yesText: "Yeah... it was awful 🤢",
    noText: "Nah, I'm too smart for that 😎",
    emoji: "🍞",
    anim: "anim-wobble",
    yesToast: "Crikey! Poor you!",
    noToast: "A true survivor!"
  },
  {
    title: "Did you actually see a Kangaroo, or just lots of empty fields? 🦘",
    subtitle: "Be honest now.",
    yesText: "Saw heaps of 'em mate! 🥊",
    noText: "Just empty fields... 🏜️",
    emoji: "🦘",
    anim: "anim-bounce", // bouncing animation
    yesToast: "Hope you didn't box one!",
    noToast: "Give it time, mate..."
  },
  {
    title: "Have you started saying 'Nah, yeah' and 'Yeah, nah' in every sentence? 🗣️",
    subtitle: "The true sign of integration.",
    yesText: "Yeah, nah, definitely! 🇦🇺",
    noText: "Nah, mate, not yet. 🤨",
    emoji: "🗣️",
    anim: "anim-pulse", // pulse speaking animation
    yesToast: "Fair dinkum!",
    noToast: "You'll get there!"
  },
  {
    title: "Did you survive your first magpie swooping season? 🦅",
    subtitle: "The real extreme sport of Australia.",
    yesText: "Barely escaped! 🪖",
    noText: "They spared me... 🤫",
    emoji: "🦅",
    anim: "anim-swoop", // swoop down and up
    yesToast: "Wear an ice-cream container next time!",
    noToast: "You're bloody lucky!"
  },
  {
    title: "And... have you had the pleasure of meeting a giant huntsman spider in your room? 🕷️",
    subtitle: "The ultimate WHV boss fight.",
    yesText: "It's paying rent now! 😭",
    noText: "Nope, hiding from them. 🔥",
    emoji: "🕷️",
    anim: "anim-drop", // dropping spider
    yesToast: "Strewth! Brave soul!",
    noToast: "Smart move!"
  },
  {
    title: "DID U MISS YOUR annoying little sister? 👧🏻",
    subtitle: "Be honest...",
    yesText: "Yeah, kinda miss her... 🥺",
    noText: "Nah, zero percent! 🙅‍♂️",
    image: "image/sister.jpg",
    anim: "anim-bounce", 
    yesToast: "Awww, she misses you too! 🥰",
    noToast: "Liar! We know you do! 😂"
  }
];

let currentQuestion = 0;
let musicPlaying = false;
let currentScene = "envelope";
let isTransitioning = false;

const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const questionSlide = document.getElementById("question-slide");
const questionTitle = document.getElementById("question-title");
const questionSubtitle = document.getElementById("question-subtitle");
const catGif = document.getElementById("cat-gif");
const buttonsContainer = document.getElementById("buttons-container");

// ============================================
// PARTICLE SYSTEM
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
    this.size = Math.random() * 12 + 6;
    this.speedY = -(Math.random() * 0.7 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.35 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    
    // Type: 0 = circle (sun/dust), 1 = diamond (sparkle)
    this.type = Math.random() < 0.6 ? 0 : 1;
    
    // Colors: Outback Orange/Red vs Ocean Blue/Gold
    const r = Math.random();
    if (r < 0.33) {
      // Outback Terracotta
      this.hue = 10 + Math.random() * 20; 
      this.saturation = 80;
      this.lightness = 55;
    } else if (r < 0.66) {
      // Ocean Blue
      this.hue = 190 + Math.random() * 20;
      this.saturation = 90;
      this.lightness = 60;
    } else {
      // Gold
      this.hue = 45 + Math.random() * 10;
      this.saturation = 90;
      this.lightness = 65;
    }
  }

  update() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.4;
    this.rotation += this.rotationSpeed;

    if (this.y < -30) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 1)`;

    if (this.type === 0) {
      // Circle dust / sun
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 4-point Diamond
      const s = this.size * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = Math.cos(angle) * s;
        const outerY = Math.sin(angle) * s;
        const innerAngle = angle + Math.PI / 4;
        const innerX = Math.cos(innerAngle) * s * 0.25;
        const innerY = Math.sin(innerAngle) * s * 0.25;
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

function initParticles(count = 45) {
  particles = [];
  for (let i = 0; i < count; i++) {
    const p = new Particle();
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
  startMusic();

  setTimeout(() => {
    switchScene("question");
    loadQuestion(0);
  }, 2000);
});

envelopeTrigger.addEventListener("touchend", (e) => {
  e.preventDefault();
  envelopeTrigger.click();
}, { passive: false });

// ============================================
// SCENE 2: QUIZ / QUESTIONS
// ============================================
function loadQuestion(index) {
  const q = whvQuestions[index];
  
  questionSlide.classList.add("hidden");
  
  setTimeout(() => {
    questionTitle.textContent = q.title;
    questionSubtitle.textContent = q.subtitle;
    yesBtn.textContent = q.yesText;
    noBtn.textContent = q.noText;
    
    catGif.style.opacity = "0";
    setTimeout(() => {
      if (q.image) {
        catGif.textContent = "";
        catGif.innerHTML = `<img src="${q.image}" style="width: 180px; height: 180px; object-fit: cover; border-radius: 16px; box-shadow: 0 8px 24px rgba(217, 91, 50, 0.3);">`;
        catGif.className = q.anim;
        catGif.style.transition = "opacity 0.15s ease";
      } else {
        catGif.innerHTML = "";
        catGif.textContent = q.emoji;
        catGif.className = `emoji-display ${q.anim}`;
      }
      catGif.style.opacity = "1";
    }, 150);
    
    questionSlide.classList.remove("hidden");
  }, 350); 
}

function showToast(msg) {
  const toast = document.getElementById("tease-toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function handleAnswer(isYes) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  const q = whvQuestions[currentQuestion];
  showToast(isYes ? q.yesToast : q.noToast);
  
  buttonsContainer.classList.add("locked");
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion >= whvQuestions.length) {
      switchScene("celebration");
      setTimeout(launchCelebration, 400);
    } else {
      loadQuestion(currentQuestion);
    }
    
    // Unlock buttons slightly after the next slide load finishes
    setTimeout(() => {
      buttonsContainer.classList.remove("locked");
      isTransitioning = false;
    }, 800);
    
  }, 2000); // Time showing the toast before fading out
}

yesBtn.addEventListener("click", () => handleAnswer(true));
noBtn.addEventListener("click", () => handleAnswer(false));


// ============================================
// SCENE 3: CELEBRATION
// ============================================
function launchCelebration() {
  // Aussie colors
  const colors = [
    "#d95b32", // Terracotta
    "#f2b705", // Gold
    "#007791", // Ocean Blue
    "#ffffff",
    "#00a8cc",
    "#8b371b"
  ];

  confetti({
    particleCount: 180,
    spread: 120,
    origin: { x: 0.5, y: 0.35 },
    colors,
    startVelocity: 45,
    gravity: 0.8,
  });

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

  setTimeout(startTypewriter, 800);

  for (let i = 0; i < 20; i++) {
    const p = new Particle();
    p.opacity = Math.random() * 0.4 + 0.1;
    p.speedY = -(Math.random() * 1.5 + 0.4);
    particles.push(p);
  }
}

function startTypewriter() {
  const message = "Hope you're having the time of your life down under! Catch a wave, cuddle a koala, and make sure to send some Tim Tams back soon! 🇦🇺🐨🌊";
  const el = document.getElementById("typewriter-text");
  const cursor = document.getElementById("typewriter-cursor");
  let i = 0;

  function type() {
    if (i < message.length) {
      el.textContent += message.charAt(i);
      i++;
      const delay = message.charAt(i - 1) === "." ? 300 : message.charAt(i - 1) === "," ? 150 : message.charAt(i - 1) === " " ? 50 : 35 + Math.random() * 25;
      setTimeout(type, delay);
    } else {
      setTimeout(() => { cursor.style.display = "none"; }, 2000);
    }
  }
  type();
}

// ============================================
// MUSIC
// ============================================
music.volume = 0.3;

function startMusic() {
  music.play().then(() => {
    musicPlaying = true;
    musicToggle.textContent = "🔊";
  }).catch(() => {});
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicToggle.textContent = "🔇";
  } else {
    music.play().then(() => {
      musicPlaying = true;
      musicToggle.textContent = "🔊";
    }).catch(() => {});
  }
});
