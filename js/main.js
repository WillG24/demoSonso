/* ============================================================
   CONFIGURACION EMAILJS
   ------------------------------------------------------------
   1. Crea cuenta en https://www.emailjs.com (gratis, 200 emails/mes)
   2. Add New Service (Gmail, Outlook, etc.) → copia el Service ID
   3. Email Templates → crea uno con estas variables:
        {{from_name}}  {{email}}  {{phone}}  {{service_type}}  {{message}}
   4. Account → General → Public Key
   5. Reemplaza los 3 valores de abajo con los tuyos
   ============================================================ */
const EMAILJS_CONFIG = {
  publicKey:  "TU_PUBLIC_KEY",    // Account > General > Public Key
  serviceId:  "TU_SERVICE_ID",    // Email Services > tu servicio
  templateId: "TU_TEMPLATE_ID",   // Email Templates > tu plantilla
};

/* ============================================================
   GALERIA — imágenes y captions
   ============================================================ */
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    caption: "Productos frescos y de calidad",
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    caption: "Atención personalizada para cada cliente",
  },
  {
    src: "https://images.unsplash.com/photo-1516594798947-e44042aa494c?auto=format&fit=crop&w=900&q=80",
    caption: "Variedad de productos seleccionados",
  },
  {
    src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=900&q=80",
    caption: "Mercado local con sabor a Sonsonate",
  },
  {
    src: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=900&q=80",
    caption: "Ambiente acogedor y familiar",
  },
  {
    src: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80",
    caption: "Servicio rápido y eficiente",
  },
];

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initEmailJS();
  buildGallery();
  initLightbox();
  initContactForm();
  initMobileMenu();
});

/* ============================================================
   EMAILJS INIT
   ============================================================ */
function initEmailJS() {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
}

/* ============================================================
   GALERIA — construcción dinámica
   ============================================================ */
function buildGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  galleryImages.forEach((item, idx) => {
    const el = document.createElement("div");
    el.className = "gallery-item";
    el.dataset.index = idx;
    el.innerHTML = `
      <img src="${item.src}&w=500" alt="${item.caption}" loading="lazy">
      <div class="gallery-overlay">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        Ver foto
      </div>`;
    el.addEventListener("click", () => openLightbox(idx));
    grid.appendChild(el);
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
let currentLightboxIndex = 0;

function initLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  document.getElementById("lb-next").addEventListener("click", (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  renderLightboxImage();
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  renderLightboxImage();
}

function renderLightboxImage() {
  const item = galleryImages[currentLightboxIndex];
  document.getElementById("lb-img").src = item.src;
  document.getElementById("lb-img").alt = item.caption;
  document.getElementById("lb-caption").textContent = item.caption;
}

/* ============================================================
   FORMULARIO DE CONTACTO + EMAILJS
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector(".form-submit");
    const feedback = document.getElementById("form-feedback");

    // Validar campos requeridos
    const name = form.from_name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !message) {
      showFeedback(feedback, "Por favor completa todos los campos requeridos.", "error");
      return;
    }

    // Estado de carga
    btn.disabled = true;
    btn.innerHTML = `<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
      M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando...`;

    try {
      if (typeof emailjs === "undefined") {
        throw new Error("EmailJS no está cargado. Revisa tu conexión a internet.");
      }

      if (EMAILJS_CONFIG.publicKey === "TU_PUBLIC_KEY") {
        throw new Error("Configura tus credenciales de EmailJS en js/main.js antes de usar el formulario.");
      }

      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        form
      );

      showFeedback(feedback, "¡Mensaje enviado! Te contactaremos pronto.", "success");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showFeedback(
        feedback,
        err.message || "Ocurrió un error. Intenta de nuevo o escríbenos por WhatsApp.",
        "error"
      );
    } finally {
      btn.disabled = false;
      btn.innerHTML = "Enviar mensaje";
    }
  });
}

function showFeedback(el, msg, type) {
  el.textContent = msg;
  el.className = `form-feedback ${type}`;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 6000);
}

/* ============================================================
   MENU MOBILE
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-mobile");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

/* ============================================================
   SCROLL SUAVE PARA BOTONES
   ============================================================ */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
