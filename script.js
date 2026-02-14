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
let cursorEffectsEnabled = true;

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
    
    // Show mode indicator
    showModeIndicator(type);
}

/* ------------------------------
   Mode Indicator
------------------------------ */
const modeIndicator = document.getElementById("mode-indicator");
let indicatorTimeout;

function showModeIndicator(type) {
    // Clear any existing animation
    if (indicatorTimeout) {
        clearTimeout(indicatorTimeout);
    }
    
    // Remove all classes
    modeIndicator.className = '';
    
    // Set text based on mode
    const modeNames = {
        planet: "Planet",
        star: "Star",
        blackhole: "Black Hole",
        insane: "Insane",
        rupture: "Rupture"
    };
    
    modeIndicator.innerHTML = `Gravity Mode:<br>${modeNames[type]}`;
    
    // Add mode-specific class and show class
    modeIndicator.classList.add(type);
    
    // Trigger reflow to restart animation
    void modeIndicator.offsetWidth;
    
    modeIndicator.classList.add('show');
    
    // Remove show class after animation completes
    indicatorTimeout = setTimeout(() => {
        modeIndicator.classList.remove('show');
    }, 1500);
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        setGravity(btn.dataset.gravity);
    });
});

// Default active
setGravity("planet");

/* ------------------------------
   Cursor Effect Toggle
------------------------------ */
const cursorToggleBtn = document.getElementById("cursor-toggle");

function toggleCursorEffects() {
    cursorEffectsEnabled = !cursorEffectsEnabled;
    
    if (cursorEffectsEnabled) {
        cursorToggleBtn.classList.remove("inactive");
        cursorToggleBtn.classList.add("active");
    } else {
        cursorToggleBtn.classList.remove("active");
        cursorToggleBtn.classList.add("inactive");
    }
}

cursorToggleBtn.addEventListener("click", toggleCursorEffects);

// Set initial state
cursorToggleBtn.classList.add("active");


/* ------------------------------
   Keyboard Shortcuts
------------------------------ */
window.addEventListener("keydown", (e) => {
    if (e.key === "1") setGravity("planet");
    if (e.key === "2") setGravity("star");
    if (e.key === "3") setGravity("blackhole");
    if (e.key === "4") setGravity("insane");
    if (e.key === "5") setGravity("rupture");
    if (e.key === "e" || e.key === "E") toggleCursorEffects();
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
   Cursor Animation Effect
------------------------------ */
function drawCursorEffect() {
    const pulse = Math.sin(time * 3) * 0.5 + 0.5;
    
    ctx.save();
    
    if (activeGravity === gravityProfiles.planet) {
        // Planet: Gentle pulsing ring
        const radius = 60 + pulse * 15;
        ctx.strokeStyle = `rgba(120, 180, 255, ${0.4 - pulse * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring
        ctx.strokeStyle = `rgba(120, 180, 255, ${0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
        ctx.stroke();
    }
    else if (activeGravity === gravityProfiles.star) {
        // Star: Bright pulsing with glow
        const radius = 100 + pulse * 30;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 220, 120, 0.6)';
        ctx.strokeStyle = `rgba(255, 220, 120, ${0.5 - pulse * 0.25})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Multiple rings
        ctx.strokeStyle = `rgba(255, 200, 100, ${0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
        ctx.stroke();
    }
    else if (activeGravity === gravityProfiles.blackhole) {
        // Black Hole: Spiraling vortex effect
        const numRings = 4;
        for (let i = 0; i < numRings; i++) {
            const offset = (time * 2 + i * 0.5) % 2;
            const radius = 80 + i * 40 + offset * 20;
            const alpha = (0.6 - i * 0.15) * (1 - offset / 2);
            
            ctx.strokeStyle = `rgba(180, 100, 255, ${alpha})`;
            ctx.lineWidth = 3 - i * 0.5;
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'rgba(180, 100, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    else if (activeGravity === gravityProfiles.insane) {
        // Insane: Chaotic expanding rings
        const numRings = 6;
        for (let i = 0; i < numRings; i++) {
            const chaosOffset = Math.sin(time * 5 + i) * 20;
            const radius = 50 + i * 60 + chaosOffset + pulse * 30;
            const alpha = 0.5 - i * 0.08;
            
            ctx.strokeStyle = `rgba(255, 100, 150, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'rgba(255, 100, 150, 0.6)';
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Chaotic particles
            if (i % 2 === 0) {
                ctx.fillStyle = `rgba(255, 150, 200, ${alpha})`;
                for (let j = 0; j < 8; j++) {
                    const angle = (j / 8) * Math.PI * 2 + time * 3;
                    const x = mouse.x + Math.cos(angle) * radius;
                    const y = mouse.y + Math.sin(angle) * radius;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
    else if (activeGravity === gravityProfiles.rupture) {
        // Rupture: Crackling webpage-breaking effect
        const crackCount = 25;
        const maxCrackLength = 300;
        
        for (let i = 0; i < crackCount; i++) {
            // Random crack starting from cursor
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxCrackLength;
            
            const endX = mouse.x + Math.cos(angle) * distance;
            const endY = mouse.y + Math.sin(angle) * distance;
            
            // Jagged crack line
            ctx.strokeStyle = `rgba(255, ${Math.random() * 100}, ${Math.random() * 100}, ${0.3 + Math.random() * 0.4})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.shadowBlur = 10 + Math.random() * 15;
            ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
            
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            
            // Create jagged segments
            const segments = 5 + Math.floor(Math.random() * 8);
            let currentX = mouse.x;
            let currentY = mouse.y;
            
            for (let j = 1; j <= segments; j++) {
                const progress = j / segments;
                const targetX = mouse.x + (endX - mouse.x) * progress;
                const targetY = mouse.y + (endY - mouse.y) * progress;
                
                // Add randomness for jagged effect
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                
                currentX = targetX + offsetX;
                currentY = targetY + offsetY;
                
                ctx.lineTo(currentX, currentY);
            }
            ctx.stroke();
        }
        
        // Shattered glass effect - radiating shards
        const shardCount = 15;
        for (let i = 0; i < shardCount; i++) {
            const angle = (i / shardCount) * Math.PI * 2 + time * 2;
            const radius = 80 + Math.random() * 120;
            
            const x = mouse.x + Math.cos(angle) * radius;
            const y = mouse.y + Math.sin(angle) * radius;
            
            // Draw shard triangle
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
            ctx.strokeStyle = `rgba(255, 100, 100, ${0.4 + Math.random() * 0.3})`;
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            const size = 15 + Math.random() * 25;
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.random() * size - size/2, y + Math.random() * size - size/2);
            ctx.lineTo(x + Math.random() * size - size/2, y + Math.random() * size - size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        // Distortion waves
        const waveCount = 8;
        for (let i = 0; i < waveCount; i++) {
            const radius = 50 + i * 80 + Math.sin(time * 4 + i) * 30;
            const alpha = (0.4 - i * 0.04) * (0.5 + Math.sin(time * 6) * 0.5);
            
            ctx.strokeStyle = `rgba(255, ${50 + i * 20}, 150, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 50, 150, 0.6)';
            
            // Draw distorted circle
            ctx.beginPath();
            const points = 16;
            for (let j = 0; j <= points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const distortion = (Math.random() - 0.5) * 25;
                const r = radius + distortion;
                const px = mouse.x + Math.cos(angle) * r;
                const py = mouse.y + Math.sin(angle) * r;
                
                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.stroke();
        }
        
        // Screen tear effect near cursor
        if (Math.random() > 0.7) {
            const tearX = mouse.x + (Math.random() - 0.5) * 100;
            const tearY = mouse.y + (Math.random() - 0.5) * 100;
            const tearWidth = 2 + Math.random() * 4;
            const tearHeight = 50 + Math.random() * 150;
            
            ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + Math.random() * 0.4})`;
            ctx.fillRect(tearX, tearY, tearWidth, tearHeight);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
            ctx.fillRect(tearX + tearWidth, tearY, 1, tearHeight);
        }
    }
    
    ctx.restore();
}

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

    // Draw cursor animation effect
    if (mouse.x !== null && mouse.active && cursorEffectsEnabled) {
        drawCursorEffect();
    }

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