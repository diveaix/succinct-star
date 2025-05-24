const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Play background music
const bgMusic = new Audio('asset/Faneto.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.6;
document.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {
      console.warn('Autoplay prevented.');
    });
  }
}, { once: true });

// 8 custom image filenames
const imageList = [
  'crashout.png',
  'fakedevv.jpg',
  'lsquare.jpg',
  'nair.jpg',
  'uma.jpg',
  'zkdan.jpg',
  'zkguy.jpg',
  'zksybil.jpg'
];

let tiles = [];
let firstTile = null;
let secondTile = null;
let score = 0;

// Create 8 pairs (16 tiles) and shuffle
let images = [...imageList, ...imageList];
images = images.sort(() => 0.5 - Math.random());

// Create 16 tiles with front/back for flip
for (let i = 0; i < 16; i++) {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.dataset.image = images[i];

  const tileInner = document.createElement('div');
  tileInner.classList.add('tile-inner');

  const tileFront = document.createElement('div');
  tileFront.classList.add('tile-front');

  const tileBack = document.createElement('div');
  tileBack.classList.add('tile-back');
  tileBack.style.backgroundImage = `url('asset/${images[i]}')`;

  tileInner.appendChild(tileFront);
  tileInner.appendChild(tileBack);
  tile.appendChild(tileInner);

  tile.addEventListener('click', () => handleClick(tile));
  board.appendChild(tile);
  tiles.push(tile);
}

function handleClick(tile) {
  if (tile.classList.contains('flipped') || secondTile) return;

  tile.classList.add('flipped');

  if (!firstTile) {
    firstTile = tile;
  } else {
    secondTile = tile;

    if (firstTile.dataset.image === secondTile.dataset.image) {
      score++;
      scoreDisplay.textContent = score;

      // Add bump animation on score update
      scoreDisplay.classList.add('bump');
      setTimeout(() => {
        scoreDisplay.classList.remove('bump');
      }, 300);

      // Check if game finished, start confetti
      if (score === 8) {
        startConfetti();
      }

      firstTile = null;
      secondTile = null;
    } else {
      setTimeout(() => {
        firstTile.classList.remove('flipped');
        secondTile.classList.remove('flipped');
        firstTile = null;
        secondTile = null;
      }, 1000);
    }
  }
}

/* ===== CONFETTI CODE ===== */

const canvas = document.createElement('canvas');
canvas.id = 'confetti-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let confettiPieces = [];
let animationFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 9999;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = (Math.random() * 8) + 4;
    this.speed = (Math.random() * 3) + 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.spin = (Math.random() - 0.5) * 0.1;
    this.opacity = 1;
    this.color = `hsl(${Math.random() * 50 + 320}, 80%, 70%)`; // pink/purple
  }

  update() {
    this.y += this.speed;
    this.angle += this.spin;
    if (this.y > canvas.height) {
      this.y = Math.random() * -canvas.height;
      this.x = Math.random() * canvas.width;
      this.opacity = 1;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    ctx.restore();
  }
}

function createConfetti(count = 150) {
  confettiPieces = [];
  for (let i = 0; i < count; i++) {
    confettiPieces.push(new Confetti());
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    p.update();
    p.draw();
  });
  animationFrameId = requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  createConfetti();
  animateConfetti();

  // Stop after 7 seconds
  setTimeout(stopConfetti, 7000);
}

function stopConfetti() {
  cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
