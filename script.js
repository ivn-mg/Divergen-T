/* =====================================================
   DIVERGEN-T — script.js
===================================================== */

// ── LANGUAGE TOGGLE ──────────────────────────────────
let currentLang = localStorage.getItem('dt-lang') || 'es';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('dt-lang', lang);

  // Update every element that has data-es / data-en
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
  });

  // Update flag + label
  const isES = lang === 'es';
  const flag  = isES ? '🇲🇽' : '🇺🇸';
  const label = isES ? 'ES'   : 'EN';

  ['lang-flag', 'lang-flag-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = flag;
  });
  ['lang-label', 'lang-label-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });

  // html lang attribute
  document.getElementById('html-root')?.setAttribute('lang', lang);
}

function toggleLanguage() {
  applyLanguage(currentLang === 'es' ? 'en' : 'es');
}

document.getElementById('lang-toggle')?.addEventListener('click', toggleLanguage);
document.getElementById('lang-toggle-mobile')?.addEventListener('click', toggleLanguage);

// Apply on load
applyLanguage(currentLang);


// ── MODAL — FICHA DE INSCRIPCIÓN ─────────────────────
const modal    = document.getElementById('modal-inscripcion');
const backdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');

function openModal() {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


// ── NAVBAR SCROLL ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});


// ── MOBILE MENU ───────────────────────────────────────
const mobileBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen   = document.getElementById('menu-icon-open');
const iconClose  = document.getElementById('menu-icon-close');

function closeMobileMenu() {
  mobileMenu?.classList.add('hidden');
  iconOpen?.classList.remove('hidden');
  iconClose?.classList.add('hidden');
  document.body.style.overflow = '';
}

mobileBtn?.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden', !isHidden);
  iconClose.classList.toggle('hidden', isHidden);
  if (!isHidden) document.body.style.overflow = 'hidden';
  else           document.body.style.overflow = '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});


// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  });
});


// ── FLIP CARDS ────────────────────────────────────────
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});


// ── BACK TO TOP ───────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 300);
});
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ── EMAILJS ───────────────────────────────────────────
// Credenciales de tu cuenta EmailJS
const EMAILJS_SERVICE_ID  = 'service_up4ignu';
const EMAILJS_TEMPLATE_ID = 'template_mpi1tgc';
const EMAILJS_PUBLIC_KEY  = '5UjvPyAZiHqrSkKWv';

// Inicializar EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── CONTACT FORM ──────────────────────────────────────
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit');

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  // Validación
  if (!data.nombre?.trim() || !data.email?.trim() || !data.mensaje?.trim()) {
    showToast(currentLang === 'es'
      ? 'Por favor, completa todos los campos obligatorios.'
      : 'Please fill in all required fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast(currentLang === 'es'
      ? 'Ingresa un correo electrónico válido.'
      : 'Please enter a valid email address.', 'error');
    return;
  }

  // Estado de carga
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…';

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  data.nombre,
      name:       data.nombre,
      from_email: data.email,
      email:      data.email,
      phone:      data.telefono || '—',
      service:    data.servicio || '—',
      message:    data.mensaje,
      title:      `Mensaje de ${data.nombre}`,
    });

    showToast(currentLang === 'es'
      ? '¡Mensaje enviado! Nos pondremos en contacto pronto.'
      : 'Message sent! We will contact you shortly.', 'success');
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    showToast(currentLang === 'es'
      ? 'Hubo un error al enviar. Inténtalo de nuevo o escríbenos directo por WhatsApp.'
      : 'There was an error sending. Try again or contact us via WhatsApp.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = currentLang === 'es' ? 'Enviar mensaje' : 'Send message';
  }
});


// ── TOAST NOTIFICATION ────────────────────────────────
function showToast(msg, type = 'success') {
  document.querySelector('.dt-toast')?.remove();
  const toast = Object.assign(document.createElement('div'), { className: 'dt-toast' });
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:9999;
    padding:14px 20px;border-radius:12px;color:#fff;
    font-family:'Atkinson Hyperlegible',sans-serif;font-weight:700;font-size:.9rem;
    max-width:360px;box-shadow:0 8px 24px rgba(0,0,0,.15);
    background:${type === 'success' ? '#99CC33' : '#CC0000'};
    transform:translateY(-10px);opacity:0;transition:all .3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}