// =========================================================
// التفاعلات والحس التجريبي لعيادة د. محمد المعجار
// =========================================================

const WHATSAPP_NUMBER = "201007450402";
const FACEBOOK_URL = "https://www.facebook.com/share/14nyyZvFy2J/";

const whatsappBase = `https://wa.me/${WHATSAPP_NUMBER}`;

document.addEventListener("DOMContentLoaded", () => {
  // 1. تحديث الروابط والسنة
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. الهيدر الهابط والقائمة الجانبية في الموبايل
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });

    document.querySelectorAll(".nav-link, .btn-nav-cta").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. نافذة الحجز التفاعلية (Modal) وتجهيز رسالة الواتساب للفرع
  const modal = document.getElementById("contactModal");
  const modalText = document.getElementById("modalText");
  const modalWhatsapp = document.getElementById("modalWhatsapp");
  const modalClose = document.querySelector(".modal-close");
  const modalBackdrop = document.querySelector(".modal-backdrop");

  document.querySelectorAll(".schedule-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const location = btn.dataset.location;
      const message = `السلام عليكم د. محمد عبد الفتاح المعجار، أود الاستفسار وحجز موعد في فرع عيادة (${location}).`;

      if (modalText) {
        modalText.textContent = `لقد اخترت الحجز في فرع: ${location}. اضغط بالأسفل للتواصل المباشر مع العيادة عبر الواتساب.`;
      }

      if (modalWhatsapp) {
        modalWhatsapp.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
      }

      if (modal) {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  // 4. معرض الصور المطور (Lightbox)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.querySelector(".lightbox-close");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const fullSrc = item.dataset.full;
      const img = item.querySelector("img");

      if (lightboxImg && fullSrc) {
        lightboxImg.src = fullSrc;
        lightboxImg.alt = img ? img.alt : "";
      }

      if (lightbox) {
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    }
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 5. إغلاق النوافذ باستخدام Escape Key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeLightbox();
    }
  });

  // 6. التحريك التلقائي للعناصر أثناء التمرير (Scroll Reveal)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});