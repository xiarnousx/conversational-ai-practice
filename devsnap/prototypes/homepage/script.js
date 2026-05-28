/* ===== Navbar scroll opacity ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===== Mobile menu ===== */
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

/* ===== Footer year ===== */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ===== Pricing toggle ===== */
const pricingToggle = document.getElementById('pricingToggle');
const proPrice = document.getElementById('proPrice');
const proPeriod = document.getElementById('proPeriod');
const proDescription = document.getElementById('proDescription');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel = document.getElementById('yearlyLabel');
let isYearly = false;

pricingToggle.addEventListener('click', () => {
  isYearly = !isYearly;
  pricingToggle.classList.toggle('active', isYearly);
  pricingToggle.setAttribute('aria-pressed', isYearly);

  if (isYearly) {
    proPrice.textContent = '$72';
    proPeriod.textContent = '/year';
    proDescription.textContent = '$6 / mo · Save $24 yearly';
    monthlyLabel.classList.remove('active');
    yearlyLabel.classList.add('active');
  } else {
    proPrice.textContent = '$8';
    proPeriod.textContent = '/month';
    proDescription.textContent = 'Billed monthly';
    monthlyLabel.classList.add('active');
    yearlyLabel.classList.remove('active');
  }
});

/* ===== Scroll fade-in (IntersectionObserver) ===== */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach((el) => fadeObserver.observe(el));

/* ===== Chaos icon animation ===== */
function initChaosAnimation() {
  const container = document.getElementById('chaosIcons');
  if (!container) return;

  const icons = Array.from(container.querySelectorAll('.chaos-icon'));
  if (!icons.length) return;

  const ICON_SIZE = 50;
  const REPULSION_RADIUS = 110;
  const REPULSION_STRENGTH = 0.35;
  const MAX_SPEED = 3.5;
  const MIN_SPEED = 0.4;
  const FRICTION = 0.992;

  let mouseX = -9999;
  let mouseY = -9999;

  /* Track mouse relative to the chaos container */
  const chaosContainer = document.getElementById('chaosContainer');
  chaosContainer.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  chaosContainer.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* Initialise icon states with random positions */
  const states = icons.map((icon) => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const pad = ICON_SIZE / 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = MIN_SPEED + Math.random() * 1.5;
    return {
      el: icon,
      x: pad + Math.random() * (w - ICON_SIZE - pad),
      y: pad + Math.random() * (h - ICON_SIZE - pad),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.7,
      scale: 0.92 + Math.random() * 0.16,
      scaleDir: Math.random() > 0.5 ? 1 : -1,
    };
  });

  function getMaxX() { return container.offsetWidth - ICON_SIZE; }
  function getMaxY() { return container.offsetHeight - ICON_SIZE; }

  function tick() {
    const mxBound = getMaxX();
    const myBound = getMaxY();

    states.forEach((s) => {
      /* Mouse repulsion */
      const cx = s.x + ICON_SIZE / 2;
      const cy = s.y + ICON_SIZE / 2;
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < REPULSION_RADIUS && dist > 1) {
        const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_STRENGTH;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
      }

      /* Friction */
      s.vx *= FRICTION;
      s.vy *= FRICTION;

      /* Speed limits */
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > MAX_SPEED) {
        s.vx = (s.vx / speed) * MAX_SPEED;
        s.vy = (s.vy / speed) * MAX_SPEED;
      }
      /* Nudge if nearly stopped */
      if (speed < MIN_SPEED * 0.5) {
        const a = Math.random() * Math.PI * 2;
        s.vx += Math.cos(a) * 0.25;
        s.vy += Math.sin(a) * 0.25;
      }

      /* Position update */
      s.x += s.vx;
      s.y += s.vy;

      /* Wall bounce */
      if (s.x <= 0)         { s.x = 0;       s.vx =  Math.abs(s.vx); }
      if (s.x >= mxBound)   { s.x = mxBound; s.vx = -Math.abs(s.vx); }
      if (s.y <= 0)         { s.y = 0;       s.vy =  Math.abs(s.vy); }
      if (s.y >= myBound)   { s.y = myBound; s.vy = -Math.abs(s.vy); }

      /* Subtle rotation */
      s.rotation += s.rotSpeed;

      /* Scale pulse */
      s.scale += s.scaleDir * 0.0025;
      if (s.scale > 1.08) s.scaleDir = -1;
      if (s.scale < 0.92) s.scaleDir =  1;

      /* Apply to DOM */
      s.el.style.left = `${s.x}px`;
      s.el.style.top  = `${s.y}px`;
      s.el.style.transform = `rotate(${s.rotation}deg) scale(${s.scale})`;
    });

    requestAnimationFrame(tick);
  }

  tick();
}

/* Wait one frame to ensure layout is complete before reading offsetWidth/Height */
requestAnimationFrame(() => {
  requestAnimationFrame(initChaosAnimation);
});
