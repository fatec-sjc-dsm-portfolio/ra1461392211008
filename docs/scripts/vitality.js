// Configurações
const particleCount = 40;
const flareCount = 10;
const motion = 0.05;
const color = '#0291ff'; // Alterado para azul
const particleSizeBase = 1;
const particleSizeMultiplier = 0.5;
const flareSizeBase = 100;
const flareSizeMultiplier = 100;
const lineWidth = 1;
const linkChance = 75;
const linkLengthMin = 5;
const linkLengthMax = 7;
const linkOpacity = 0.25;
const linkFade = 90;
const linkSpeed = 1;
const glareOpacityMultiplier = 0.05;
const flicker = true;
const flickerSmoothing = 15;
const randomMotion = true;
const noiseLength = 1000;
const noiseStrength = 1;

const canvas = document.getElementById('stars');
const context = canvas.getContext('2d');
let mouse = { x: 0, y: 0 };
let particles = [];
let flares = [];
let links = [];
let n = 0;
let nAngle = (Math.PI * 2) / noiseLength;
let nPos = { x: 0, y: 0 };

// Inicializar canvas
function init() {
  resize();
  mouse.x = canvas.width / 2;
  mouse.y = canvas.height / 2;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  for (let i = 0; i < flareCount; i++) {
    flares.push(new Flare());
  }

  document.body.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  requestAnimationFrame(animate);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function random(min, max, float) {
  return float
    ? Math.random() * (max - min) + min
    : Math.floor(Math.random() * (max - min + 1)) + min;
}

function position(x, y, z) {
  return {
    x: (x * canvas.width) + ((((canvas.width / 2) - mouse.x + ((nPos.x - 0.5) * noiseStrength)) * z) * motion),
    y: (y * canvas.height) + ((((canvas.height / 2) - mouse.y + ((nPos.y - 0.5) * noiseStrength)) * z) * motion)
  };
}

function sizeRatio() {
  return canvas.width >= canvas.height ? canvas.width : canvas.height;
}

function noisePoint(i) {
  const a = nAngle * i;
  const rad = 100;
  return {
    x: rad * Math.cos(a),
    y: rad * Math.sin(a)
  };
}

function Particle() {
  this.x = random(-0.1, 1.1, true);
  this.y = random(-0.1, 1.1, true);
  this.z = random(0, 4);
  this.color = color;
  this.opacity = random(0.1, 1, true);
  this.flicker = 0;
}

Particle.prototype.render = function() {
  const pos = position(this.x, this.y, this.z);
  const r = ((this.z * particleSizeMultiplier) + particleSizeBase) * (sizeRatio() / 1000);
  let o = this.opacity;

  if (flicker) {
    let newVal = random(-0.5, 0.5, true);
    this.flicker += (newVal - this.flicker) / flickerSmoothing;
    this.flicker = Math.min(0.5, Math.max(-0.5, this.flicker));
    o += this.flicker;
    o = Math.min(1, Math.max(0, o));
  }

  context.fillStyle = this.color;
  context.globalAlpha = o;
  context.beginPath();
  context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
};

function Flare() {
  this.x = random(-0.25, 1.25, true);
  this.y = random(-0.25, 1.25, true);
  this.z = random(0, 2);
  this.color = color;
  this.opacity = random(0.001, 0.01, true);
}

Flare.prototype.render = function() {
  const pos = position(this.x, this.y, this.z);
  const r = ((this.z * flareSizeMultiplier) + flareSizeBase) * (sizeRatio() / 1000);

  context.beginPath();
  context.globalAlpha = this.opacity;
  context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
  context.fillStyle = this.color;
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
};

function Link(startVertex, numPoints) {
  this.length = numPoints;
  this.verts = [startVertex];
  this.stage = 0;
  this.linked = [startVertex];
  this.distances = [];
  this.traveled = 0;
  this.fade = 0;
  this.finished = false;
}

Link.prototype.render = function() {
  switch (this.stage) {
    case 0:
      const last = particles[this.verts[this.verts.length - 1]];
      const neighbor = random(0, particles.length - 1);
      if (this.verts.indexOf(neighbor) === -1) {
        this.verts.push(neighbor);
      }

      if (this.verts.length >= this.length) {
        for (let i = 0; i < this.verts.length - 1; i++) {
          const p1 = particles[this.verts[i]];
          const p2 = particles[this.verts[i + 1]];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          this.distances.push(dist);
        }
        this.stage = 1;
      }
      break;

    case 1:
      if (this.distances.length > 0) {
        let points = [];
        for (let i = 0; i < this.linked.length; i++) {
          const p = particles[this.linked[i]];
          const pos = position(p.x, p.y, p.z);
          points.push([pos.x, pos.y]);
        }

        const linkSpeedRel = linkSpeed * 0.00001 * canvas.width;
        this.traveled += linkSpeedRel;
        const d = this.distances[this.linked.length - 1];

        if (this.traveled >= d) {
          this.traveled = 0;
          this.linked.push(this.verts[this.linked.length]);
          const p = particles[this.linked[this.linked.length - 1]];
          const pos = position(p.x, p.y, p.z);
          points.push([pos.x, pos.y]);

          if (this.linked.length >= this.verts.length) {
            this.stage = 2;
          }
        } else {
          const a = particles[this.linked[this.linked.length - 1]];
          const b = particles[this.verts[this.linked.length]];
          const t = d - this.traveled;
          const x = ((this.traveled * b.x) + (t * a.x)) / d;
          const y = ((this.traveled * b.y) + (t * a.y)) / d;
          const z = ((this.traveled * b.z) + (t * a.z)) / d;
          const pos = position(x, y, z);
          points.push([pos.x, pos.y]);
        }

        this.drawLine(points);
      } else {
        this.stage = 3;
        this.finished = true;
      }
      break;

    case 2:
      if (this.fade < linkFade) {
        this.fade++;
        let points = [];
        const alpha = (1 - (this.fade / linkFade)) * linkOpacity;
        for (let i = 0; i < this.verts.length; i++) {
          const p = particles[this.verts[i]];
          const pos = position(p.x, p.y, p.z);
          points.push([pos.x, pos.y]);
        }
        this.drawLine(points, alpha);
      } else {
        this.stage = 3;
        this.finished = true;
      }
      break;

    case 3:
      this.finished = true;
      break;
  }
};

Link.prototype.drawLine = function(points, alpha) {
  if (points.length > 1 && alpha > 0) {
    context.globalAlpha = alpha;
    context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      context.moveTo(points[i][0], points[i][1]);
      context.lineTo(points[i + 1][0], points[i + 1][1]);
    }
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
    context.globalAlpha = 1;
  }
};

function animate() {
  if (randomMotion) {
    n++;
    if (n >= noiseLength) n = 0;
    nPos = noisePoint(n);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => p.render());
  flares.forEach(f => f.render());

  if (random(0, linkChance) === linkChance) {
    const length = random(linkLengthMin, linkLengthMax);
    const start = random(0, particles.length - 1);
    links.push(new Link(start, length));
  }

  for (let i = links.length - 1; i >= 0; i--) {
    if (links[i] && !links[i].finished) {
      links[i].render();
    } else {
      links.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();