/* =====================================================
   DIVERGEN-T — script.js (versión simplificada)
   ===================================================== */

// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile menu ---
const mobileBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen   = document.getElementById('menu-icon-open');
const iconClose  = document.getElementById('menu-icon-close');

mobileBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden',  !open);
  iconClose.classList.toggle('hidden', open);
  document.body.style.overflow = open ? '' : 'hidden';
});

// Cerrar menú al tocar un link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    document.body.style.overflow = '';
  });
});

// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
    }
  });
});

// --- Flip cards (teclado + touch) ---
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

// --- Back to top ---
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 300);
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Formulario de contacto ---
const form = document.getElementById('contact-form');
form?.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));

  // Validación básica
  if (!data.nombre?.trim() || !data.email?.trim() || !data.mensaje?.trim()) {
    showToast('Por favor, completa todos los campos obligatorios.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast('Ingresa un correo electrónico válido.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Aquí conectarías con tu backend / formspree / etc.
  await new Promise(r => setTimeout(r, 1200));

  console.log('Formulario:', data);
  showToast('¡Mensaje enviado! Nos pondremos en contacto pronto.', 'success');
  form.reset();
  btn.disabled = false;
  btn.textContent = 'Enviar mensaje';
});

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  existing?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 14px 20px; border-radius: 12px; color: white;
    font-family: 'Atkinson Hyperlegible', sans-serif; font-weight: 700;
    font-size: 0.9rem; max-width: 360px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    background: ${type === 'success' ? '#99CC33' : '#CC0000'};
    transform: translateY(-10px); opacity: 0;
    transition: all 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}