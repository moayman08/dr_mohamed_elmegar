document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     GLOBAL ELEMENTS
  ========================================================= */

  const body = document.body;

  const navbar = document.getElementById("navbar");

  const mobileToggle = document.getElementById("mobileToggle");

  const navLinks = document.getElementById("navLinks");

  const lightbox = document.getElementById("lightbox");

  const lightboxImg = document.getElementById("lightboxImg");

  const lightboxClose = document.getElementById("lightboxClose");

  const whatsappNumber = "201007450402";

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      const icon = mobileToggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);

        icon.classList.toggle("fa-xmark", isOpen);
      }

      body.classList.toggle("menu-open", isOpen);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        body.classList.remove("menu-open");

        const icon = mobileToggle.querySelector("i");

        if (icon) {
          icon.classList.remove("fa-xmark");

          icon.classList.add("fa-bars");
        }
      });
    });
  }

  /* =========================================================
     NAVBAR SCROLL
  ========================================================= */

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateNavbar, { passive: true });

  updateNavbar();

  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections = document.querySelectorAll("header[id], section[id]");

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;

      const height = section.offsetHeight;

      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });

        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

        activeLink?.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });

  updateActiveLink();

  /* =========================================================
     COUNTERS
  ========================================================= */

  const statNumbers = document.querySelectorAll(".stat-number");

  let countersStarted = false;

  const animateCounters = () => {
    if (countersStarted) return;

    countersStarted = true;

    statNumbers.forEach((stat) => {
      const target = Number(stat.dataset.target || 0);

      const duration = 1400;

      const startTime = performance.now();

      const update = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        stat.textContent = Math.floor(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = `${target}+`;
        }
      };

      requestAnimationFrame(update);
    });
  };

  const statsSection = document.querySelector(".stats-section");

  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateCounters();

          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(statsSection);
  }

  /* =========================================================
     WHATSAPP BOOKING
  ========================================================= */

  document.querySelectorAll(".open-booking").forEach((button) => {
    button.addEventListener("click", () => {
      const clinic = button.dataset.clinic || "العيادة";

      const originalHTML = button.innerHTML;

      button.disabled = true;

      button.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحويل...';

      const message = `السلام عليكم، أود حجز موعد في عيادة د. محمد عبد الفتاح المعجار - فرع (${clinic}).`;

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");

        button.disabled = false;

        button.innerHTML = originalHTML;
      }, 450);
    });
  });

  /* =========================================================
     CONTACT FORM
  ========================================================= */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";

      const phone = document.getElementById("phone")?.value.trim() || "";

      const clinic = document.getElementById("clinicSelect")?.value || "";

      const message = document.getElementById("message")?.value.trim() || "";

      if (!name || !phone) {
        showToast("من فضلك اكتب الاسم ورقم الهاتف أولاً.", "warning");

        return;
      }

      const button = contactForm.querySelector('button[type="submit"]');

      const originalHTML = button?.innerHTML || "";

      if (button) {
        button.disabled = true;

        button.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
      }

      const fullMessage = `مرحباً دكتور، لدي استفسار جديد:

- الاسم: ${name}
- الهاتف: ${phone}
- الفرع المفضل: ${clinic}
- الرسالة: ${message || "لا توجد رسالة إضافية"}`;

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");

        showToast("تم تجهيز رسالتك وتحويلك إلى واتساب.", "success");

        contactForm.reset();

        if (button) {
          button.disabled = false;

          button.innerHTML = originalHTML;
        }
      }, 450);
    });
  }

  /* =========================================================
     GALLERY
     DESKTOP + MOBILE
  ========================================================= */

  const galleryItems = document.querySelectorAll(".gallery-item");

  let currentGalleryIndex = 0;

  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const image = item.querySelector("img");

    if (!image) return;

    const src = item.dataset.src || image.getAttribute("src");

    const title =
      item.querySelector(".gallery-caption")?.textContent.trim() ||
      image.alt ||
      "صورة";

    galleryImages.push({
      src,
      title,
    });

    item.dataset.galleryIndex = index;

    item.addEventListener("click", () => {
      currentGalleryIndex = Number(item.dataset.galleryIndex);

      openLightbox(currentGalleryIndex);
    });
  });

  /* =========================================================
     MOBILE GALLERY SWIPE
  ========================================================= */

  const mobileGallery = document.querySelector(".gallery-grid");

  if (mobileGallery) {
    let touchStartX = 0;
    let touchStartY = 0;

    mobileGallery.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;

        touchStartY = event.touches[0].clientY;
      },
      {
        passive: true,
      },
    );

    mobileGallery.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].clientX;

        const touchEndY = event.changedTouches[0].clientY;

        const diffX = touchStartX - touchEndX;

        const diffY = touchStartY - touchEndY;

        /*
          نتأكد إن الحركة أفقية
          وليست Scroll رأسي
        */

        if (Math.abs(diffX) <= Math.abs(diffY)) {
          return;
        }

        if (Math.abs(diffX) < 50) {
          return;
        }

        const items = mobileGallery.querySelectorAll(".gallery-item");

        if (!items.length) {
          return;
        }

        const currentIndex = Math.round(
          mobileGallery.scrollLeft / (mobileGallery.clientWidth + 14),
        );

        let nextIndex;

        if (diffX > 0) {
          /* سحب لليسار */

          nextIndex = Math.min(currentIndex + 1, items.length - 1);
        } else {
          /* سحب لليمين */

          nextIndex = Math.max(currentIndex - 1, 0);
        }

        mobileGallery.scrollTo({
          left: nextIndex * (mobileGallery.clientWidth + 14),

          behavior: "smooth",
        });
      },
      {
        passive: true,
      },
    );
  }

  /* =========================================================
     LIGHTBOX
  ========================================================= */

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryImages[index]) {
      return;
    }

    const image = galleryImages[index];

    lightboxImg.src = image.src;

    lightboxImg.alt = image.title;

    lightbox.style.display = "flex";

    requestAnimationFrame(() => {
      lightbox.classList.add("active");
    });

    body.style.overflow = "hidden";

    createLightboxNavigation();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");

    setTimeout(() => {
      lightbox.style.display = "none";
    }, 200);

    if (lightboxImg) {
      lightboxImg.src = "";
    }

    body.style.overflow = "";
  }

  function showNextImage() {
    if (!galleryImages.length) {
      return;
    }

    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;

    openLightbox(currentGalleryIndex);
  }

  function showPreviousImage() {
    if (!galleryImages.length) {
      return;
    }

    currentGalleryIndex =
      (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;

    openLightbox(currentGalleryIndex);
  }

  function createLightboxNavigation() {
    if (!lightbox) return;

    let next = document.getElementById("lightboxNext");

    let prev = document.getElementById("lightboxPrev");

    if (!next) {
      next = document.createElement("button");

      next.id = "lightboxNext";

      next.className = "lightbox-nav lightbox-next";

      next.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

      next.setAttribute("aria-label", "الصورة التالية");

      next.addEventListener("click", (event) => {
        event.stopPropagation();

        showNextImage();
      });

      lightbox.appendChild(next);
    }

    if (!prev) {
      prev = document.createElement("button");

      prev.id = "lightboxPrev";

      prev.className = "lightbox-nav lightbox-prev";

      prev.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

      prev.setAttribute("aria-label", "الصورة السابقة");

      prev.addEventListener("click", (event) => {
        event.stopPropagation();

        showPreviousImage();
      });

      lightbox.appendChild(prev);
    }
  }

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  /* =========================================================
     KEYBOARD LIGHTBOX
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.style.display !== "flex") {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showNextImage();
    }

    if (event.key === "ArrowRight") {
      showPreviousImage();
    }
  });

  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = document.querySelectorAll(
    ".service-card, .clinic-card, .qual-item, .about-image-column, .about-text-column, .gallery-item, .contact-form-card, .contact-info",
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }

  /* =========================================================
     SCROLL TO TOP
  ========================================================= */

  const scrollTopButton = document.createElement("button");

  scrollTopButton.id = "scrollTopBtn";

  scrollTopButton.className = "scroll-top-btn";

  scrollTopButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

  scrollTopButton.setAttribute("aria-label", "العودة لأعلى الصفحة");

  document.body.appendChild(scrollTopButton);

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const updateScrollTop = () => {
    scrollTopButton.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", updateScrollTop, { passive: true });

  updateScrollTop();

  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");

    if (!container) {
      container = document.createElement("div");

      container.id = "toastContainer";

      container.className = "toast-container";

      document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    let icon = "fa-circle-check";

    if (type === "warning") {
      icon = "fa-triangle-exclamation";
    }

    if (type === "error") {
      icon = "fa-circle-xmark";
    }

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  /* =========================================================
     CLICK FEEDBACK
  ========================================================= */

  document
    .querySelectorAll('a[href^="tel:"], a[href*="wa.me"]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        link.classList.add("clicked");

        setTimeout(() => {
          link.classList.remove("clicked");
        }, 500);
      });
    });

  /* =========================================================
     PAGE LOADED
  ========================================================= */

  window.addEventListener("load", () => {
    body.classList.add("page-loaded");
  });
});
