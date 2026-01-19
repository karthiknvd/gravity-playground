const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ------------------------------
   Canvas Resize
------------------------------ */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let time = 0;

/* ------------------------------
   Mouse State
------------------------------ */
const mouse = {
    x: null,
    y: null,
    active: false
};

let lastMouseMove = Date.now();

/* ------------------------------
   Gravity Profiles
------------------------------ */
const gravityProfiles = {
    planet: {
        name: "Planet",
        strength: 0.6,
        minDist: 80,
        influenceRadius: 100
    },
    star: {
        name: "Star",
        strength: 1.6,
        minDist: 120,
        influenceRadius: 200
    },
    blackhole: {
        name: "Black Hole",
        strength: 4.5,
        minDist: 150,
        influenceRadius: 500
    },
    insane: {
        name: "Insane",
        strength: 12,
        minDist: 20,
        influenceRadius: 800
    },
    rupture: {
        name: "Rupture",
        strength: 20,
        minDist: 10,
        influenceRadius: 1200
    }
};

let activeGravity = gravityProfiles.planet;

/* ------------------------------
   UI Interaction
------------------------------ */
const buttons = document.querySelectorAll("#gravity-selector button");

function setGravity(type) {
    activeGravity = gravityProfiles[type];

    buttons.forEach(btn => btn.classList.remove("active"));
    document
        .querySelector(`#gravity-selector button[data-gravity="${type}"]`)
        .classList.add("active");
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        setGravity(btn.dataset.gravity);
    });
});

// Default active
setGravity("planet");

/* ------------------------------
   Keyboard Shortcuts
------------------------------ */
window.addEventListener("keydown", (e) => {
    if (e.key === "1") setGravity("planet");
    if (e.key === "2") setGravity("star");
    if (e.key === "3") setGravity("blackhole");
    if (e.key === "4") setGravity("insane");
    if (e.key === "5") setGravity("rupture");
});

/* ------------------------------
   Mouse Events
------------------------------ */
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    lastMouseMove = Date.now();
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

/* ------------------------------
   Particle System
------------------------------ */
const particles = [];
const PARTICLE_COUNT = 350;

const physics = {
    friction: 0.98,
    maxVelocity: 7,
    edgeDamping: 0.7
};

const PARTICLE_COLORS = [
    { name: "blue", base: "180,220,255", glow: "120,180,255" },
    { name: "yellow", base: "255,220,150", glow: "255,200,120" },
    { name: "white", base: "245,245,255", glow: "255,255,255" }
];

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
        const c = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.colorBase = c.base;
        this.colorGlow = c.glow;
        this.alpha = Math.random() * 0.4 + 0.4;
        this.baseRadius = this.radius; // for rupture fluctuation
    }

    update() {
        /* ------------------------------
           Ambient Flow (always active)
        ------------------------------ */
        const flowStrength = 0.003;
        this.vx += Math.sin(this.y * 0.01 + time) * flowStrength;
        this.vy += Math.cos(this.x * 0.01 + time) * flowStrength;

        /* ------------------------------
           Gravity Interaction
        ------------------------------ */
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.hypot(dx, dy);
            const influenceRadius = activeGravity.influenceRadius;

            if (distance < influenceRadius) {
                const clampedDist = Math.max(distance, activeGravity.minDist);
                const nx = dx / clampedDist;
                const ny = dy / clampedDist;
                const tx = -ny;
                const ty = nx;

                /* ---------- RUPTURE MODE ---------- */
                /* ---------- RUPTURE MODE ---------- */
if (activeGravity === gravityProfiles.rupture) {
    const d = Math.max(40, distance);

    const nxR = dx / d;
    const nyR = dy / d;

    // VERY SLOW INWARD PULL
    const slowPull = activeGravity.strength * 0.002;
    this.vx += nxR * slowPull;
    this.vy += nyR * slowPull;

    // AXIS SHAKING
    this.vx += (Math.random() - 0.5) * 1.5;
    this.vy += (Math.random() - 0.5) * 1.5;

    // DIRECTION CORRUPTION
    if (Math.random() < 0.05) {
        this.vx *= -1;
        this.vy *= -1;
    }

    // MICRO ORBIT FLIPS
    this.vx += tx * (Math.random() - 0.5) * 0.8;
    this.vy += ty * (Math.random() - 0.5) * 0.8;

    // TIME DESYNC
    if (Math.random() < 0.15) {
        this.x += this.vx;
        this.y += this.vy;
    }

    // VISUAL CHAOS
    this.alpha = Math.random() * 0.8 + 0.2;
    this.radius = this.baseRadius + (Math.random() - 0.5) * 1.5;
}


                /* ---------- INSANE MODE ---------- */
                else if (activeGravity === gravityProfiles.insane) {
                    const force = activeGravity.strength / clampedDist;
                    this.vx += nx * force * 2.0;
                    this.vy += ny * force * 2.0;
                    this.vx += (Math.random() - 0.5) * 0.4;
                    this.vy += (Math.random() - 0.5) * 0.4;
                }
                /* ---------- BLACK HOLE ---------- */
                else if (activeGravity === gravityProfiles.blackhole) {
                    const captureRadius = activeGravity.influenceRadius;
                    const depth = Math.max(0, (captureRadius - distance) / captureRadius);
                    const orbitForce = depth * 0.04;
                    const inwardForce = Math.pow(depth, 2) * 0.03;

                    this.vx += tx * orbitForce;
                    this.vy += ty * orbitForce;
                    this.vx += nx * inwardForce;
                    this.vy += ny * inwardForce;
                }
                /* ---------- PLANET + STAR ---------- */
                else {
                    const gravityForce = activeGravity.strength / clampedDist;
                    this.vx += nx * gravityForce;
                    this.vy += ny * gravityForce;

                    const orbitStrength = (influenceRadius - distance) / influenceRadius;
                    this.vx += tx * orbitStrength * 0.03;
                    this.vy += ty * orbitStrength * 0.03;

                    if (activeGravity === gravityProfiles.planet) {
                        const idealOrbit = activeGravity.minDist * 1.6;
                        const orbitError = distance - idealOrbit;
                        this.vx -= nx * orbitError * 0.0001;
                        this.vy -= ny * orbitError * 0.0001;
                    }
                }
            }
        }

        /* ------------------------------
           Anti-freeze
        ------------------------------ */
        const minSpeed = 0.02;
        if (Math.abs(this.vx) < minSpeed) this.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(this.vy) < minSpeed) this.vy += (Math.random() - 0.5) * 0.05;

        /* ------------------------------
           Physics
        ------------------------------ */
        this.vx *= physics.friction;
        this.vy *= physics.friction;

        const speed = Math.hypot(this.vx, this.vy);
        if (speed > physics.maxVelocity) {
            this.vx = (this.vx / speed) * physics.maxVelocity;
            this.vy = (this.vy / speed) * physics.maxVelocity;
        }

        /* ------------------------------
           Move + Bounds
        ------------------------------ */
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.vx *= -physics.edgeDamping;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }
        if (this.y < this.radius || this.y > canvas.height - this.radius) {
            this.vy *= -physics.edgeDamping;
            this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        }
    }

    draw() {
        const speed = Math.hypot(this.vx, this.vy);
        const glow = Math.min(20, 6 + speed * 3);

        ctx.save();
        ctx.shadowBlur = glow;
        ctx.shadowColor = `rgba(${this.colorGlow}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorBase}, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
    }
}

/* ------------------------------
   Init
------------------------------ */
function init() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

/* ------------------------------
   Animation Loop
------------------------------ */
function animate() {
    ctx.fillStyle = "rgba(11,11,15,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time += 0.01;

    // Screen shake for rupture mode
    if (activeGravity === gravityProfiles.rupture) {
        ctx.save();
        const shake = 6;
        ctx.translate(
            (Math.random() - 0.5) * shake,
            (Math.random() - 0.5) * shake
        );
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    if (activeGravity === gravityProfiles.rupture) {
        ctx.restore();
    }

    requestAnimationFrame(animate);
}

init();
animate();