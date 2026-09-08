document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     GLOBAL ELEMENTS
  ========================================================= */

  const body = document.body;
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  const whatsappNumber = '201007450402';


  /* =========================================================
     NAVBAR - MOBILE MENU
  ========================================================= */

  if (mobileToggle && navLinks) {

    mobileToggle.addEventListener('click', () => {

      const isOpen = navLinks.classList.toggle('active');

      const icon = mobileToggle.querySelector('i');

      if (icon) {

        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);

      }

      body.classList.toggle('menu-open', isOpen);

    });


    document.querySelectorAll('.nav-link').forEach(link => {

      link.addEventListener('click', () => {

        navLinks.classList.remove('active');

        body.classList.remove('menu-open');

        const icon = mobileToggle.querySelector('i');

        if (icon) {

          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');

        }

      });

    });

  }


  /* =========================================================
     NAVBAR SCROLL EFFECT
  ========================================================= */

  const updateNavbar = () => {

    if (!navbar) return;

    if (window.scrollY > 40) {

      navbar.classList.add('scrolled');

    } else {

      navbar.classList.remove('scrolled');

    }

  };

  window.addEventListener('scroll', updateNavbar, {
    passive: true
  });

  updateNavbar();


  /* =========================================================
     ACTIVE NAVIGATION LINK
  ========================================================= */

  const sections = document.querySelectorAll(
    'header[id], section[id]'
  );


  const updateActiveLink = () => {

    const scrollPosition =
      window.scrollY + 160;


    sections.forEach(section => {

      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');


      if (
        scrollPosition >= top &&
        scrollPosition < top + height
      ) {

        document.querySelectorAll('.nav-link').forEach(link => {

          link.classList.remove('active');

        });


        const activeLink =
          document.querySelector(
            `.nav-link[href="#${id}"]`
          );


        if (activeLink) {

          activeLink.classList.add('active');

        }

      }

    });

  };


  window.addEventListener(
    'scroll',
    updateActiveLink,
    { passive: true }
  );

  updateActiveLink();


  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */

  const statNumbers =
    document.querySelectorAll('.stat-number');


  let countersStarted = false;


  const animateCounters = () => {

    if (countersStarted) return;

    countersStarted = true;


    statNumbers.forEach(stat => {

      const target =
        Number(
          stat.dataset.target || 0
        );

      let current = 0;

      const duration = 1400;

      const startTime =
        performance.now();


      const update = currentTime => {

        const elapsed =
          currentTime - startTime;

        const progress =
          Math.min(elapsed / duration, 1);


        /* Ease Out */

        const eased =
          1 - Math.pow(1 - progress, 3);


        current =
          Math.floor(target * eased);


        stat.textContent = current;


        if (progress < 1) {

          requestAnimationFrame(update);

        } else {

          stat.textContent =
            `${target}+`;

        }

      };


      requestAnimationFrame(update);

    });

  };


  const statsSection =
    document.querySelector('.stats-section');


  if (statsSection) {

    const counterObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              animateCounters();

              counterObserver.disconnect();

            }

          });

        },
        {
          threshold: 0.25
        }
      );


    counterObserver.observe(statsSection);

  }


  /* =========================================================
     WHATSAPP BOOKING BUTTONS
  ========================================================= */

  document.querySelectorAll(
    '.open-booking'
  ).forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const clinic =
          button.dataset.clinic || 'العيادة';


        const originalHTML =
          button.innerHTML;


        /* Button feedback */

        button.disabled = true;

        button.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحويل...';


        const message =
          `السلام عليكم، أود حجز موعد في عيادة د. محمد عبد الفتاح المعجار - فرع (${clinic}).`;


        const url =
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


        setTimeout(() => {

          window.open(
            url,
            '_blank',
            'noopener,noreferrer'
          );


          button.disabled = false;

          button.innerHTML =
            originalHTML;

        }, 450);

      }
    );

  });


  /* =========================================================
     CONTACT FORM
  ========================================================= */

  const contactForm =
    document.getElementById('contactForm');


  if (contactForm) {

    contactForm.addEventListener(
      'submit',
      event => {

        event.preventDefault();


        const name =
          document.getElementById('name')?.value.trim() || '';


        const phone =
          document.getElementById('phone')?.value.trim() || '';


        const clinic =
          document.getElementById('clinicSelect')?.value || '';


        const message =
          document.getElementById('message')?.value.trim() || '';


        if (!name || !phone) {

          showToast(
            'من فضلك اكتب الاسم ورقم الهاتف أولاً.',
            'warning'
          );

          return;

        }


        const button =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        const originalHTML =
          button ? button.innerHTML : '';


        if (button) {

          button.disabled = true;

          button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';

        }


        const fullMessage =
          `مرحباً دكتور، لدي استفسار جديد:

- الاسم: ${name}
- الهاتف: ${phone}
- الفرع المفضل: ${clinic}
- الرسالة: ${message || 'لا توجد رسالة إضافية'}`;


        const url =
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;


        setTimeout(() => {

          window.open(
            url,
            '_blank',
            'noopener,noreferrer'
          );


          showToast(
            'تم تجهيز رسالتك وتحويلك إلى واتساب.',
            'success'
          );


          contactForm.reset();


          if (button) {

            button.disabled = false;

            button.innerHTML =
              originalHTML;

          }

        }, 450);

      }
    );

  }


  /* =========================================================
     GALLERY LIGHTBOX
  ========================================================= */

  const galleryItems =
    document.querySelectorAll(
      '.gallery-item'
    );


  let currentGalleryIndex = 0;


  const galleryImages = [];


  galleryItems.forEach((item, index) => {

    const image =
      item.querySelector('img');


    if (!image) return;


    const src =
      item.dataset.src ||
      image.getAttribute('src');


    const title =
      item.querySelector('.gallery-caption')?.textContent.trim() ||
      image.alt ||
      'صورة';


    galleryImages.push({
      src,
      title
    });


    item.dataset.galleryIndex =
      index;


    item.addEventListener(
      'click',
      () => {

        currentGalleryIndex =
          Number(
            item.dataset.galleryIndex
          );


        openLightbox(
          currentGalleryIndex
        );

      }
    );

  });


  function openLightbox(index) {

    if (!lightbox || !lightboxImg) {
      return;
    }


    if (
      !galleryImages[index]
    ) {
      return;
    }


    const image =
      galleryImages[index];


    lightboxImg.src =
      image.src;


    lightboxImg.alt =
      image.title;


    lightbox.style.display =
      'flex';


    lightbox.classList.add(
      'active'
    );


    body.style.overflow =
      'hidden';


    updateLightboxButtons();

  }


  function closeLightbox() {

    if (!lightbox) return;


    lightbox.classList.remove(
      'active'
    );


    lightbox.style.display =
      'none';


    if (lightboxImg) {

      lightboxImg.src = '';

    }


    body.style.overflow =
      '';

  }


  function showNextImage() {

    if (!galleryImages.length) {
      return;
    }


    currentGalleryIndex =
      (currentGalleryIndex + 1) %
      galleryImages.length;


    openLightbox(
      currentGalleryIndex
    );

  }


  function showPreviousImage() {

    if (!galleryImages.length) {
      return;
    }


    currentGalleryIndex =
      (
        currentGalleryIndex -
        1 +
        galleryImages.length
      ) %
      galleryImages.length;


    openLightbox(
      currentGalleryIndex
    );

  }


  function updateLightboxButtons() {

    let nextButton =
      document.getElementById(
        'lightboxNext'
      );

    let prevButton =
      document.getElementById(
        'lightboxPrev'
      );


    if (!lightbox) return;


    /*
      Create navigation buttons
      automatically so you don't
      need to add them to HTML.
    */

    if (!nextButton) {

      nextButton =
        document.createElement(
          'button'
        );

      nextButton.id =
        'lightboxNext';

      nextButton.className =
        'lightbox-nav lightbox-next';

      nextButton.innerHTML =
        '<i class="fa-solid fa-chevron-left"></i>';

      nextButton.setAttribute(
        'aria-label',
        'الصورة التالية'
      );

      lightbox.appendChild(
        nextButton
      );


      nextButton.addEventListener(
        'click',
        event => {

          event.stopPropagation();

          showNextImage();

        }
      );

    }


    if (!prevButton) {

      prevButton =
        document.createElement(
          'button'
        );

      prevButton.id =
        'lightboxPrev';

      prevButton.className =
        'lightbox-nav lightbox-prev';

      prevButton.innerHTML =
        '<i class="fa-solid fa-chevron-right"></i>';

      prevButton.setAttribute(
        'aria-label',
        'الصورة السابقة'
      );

      lightbox.appendChild(
        prevButton
      );


      prevButton.addEventListener(
        'click',
        event => {

          event.stopPropagation();

          showPreviousImage();

        }
      );

    }

  }


  /* Close button */

  lightboxClose?.addEventListener(
    'click',
    closeLightbox
  );


  /* Close by clicking background */

  lightbox?.addEventListener(
    'click',
    event => {

      if (
        event.target === lightbox
      ) {

        closeLightbox();

      }

    }
  );


  /* Keyboard controls */

  document.addEventListener(
    'keydown',
    event => {

      if (
        !lightbox ||
        lightbox.style.display !== 'flex'
      ) {

        return;

      }


      if (event.key === 'Escape') {

        closeLightbox();

      }


      if (event.key === 'ArrowLeft') {

        showNextImage();

      }


      if (event.key === 'ArrowRight') {

        showPreviousImage();

      }

    }
  );


  /* =========================================================
     SCROLL REVEAL ANIMATION
  ========================================================= */

  const revealElements =
    document.querySelectorAll(
      '.service-card, .clinic-card, .qual-item, .about-image-column, .about-text-column, .gallery-item, .contact-form-card, .contact-info'
    );


  revealElements.forEach(
    element => {

      element.classList.add(
        'reveal-on-scroll'
      );

    }
  );


  if ('IntersectionObserver' in window) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'revealed'
                );


                revealObserver.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px'
        }
      );


    revealElements.forEach(
      element => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      element => {

        element.classList.add(
          'revealed'
        );

      }
    );

  }


  /* =========================================================
     SCROLL TO TOP BUTTON
  ========================================================= */

  const createScrollTop =
    () => {

      if (
        document.getElementById(
          'scrollTopBtn'
        )
      ) {

        return;

      }


      const button =
        document.createElement(
          'button'
        );


      button.id =
        'scrollTopBtn';

      button.className =
        'scroll-top-btn';

      button.innerHTML =
        '<i class="fa-solid fa-arrow-up"></i>';

      button.setAttribute(
        'aria-label',
        'العودة لأعلى الصفحة'
      );


      document.body.appendChild(
        button
      );


      button.addEventListener(
        'click',
        () => {

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        }
      );


      const update =
        () => {

          button.classList.toggle(
            'visible',
            window.scrollY > 500
          );

        };


      window.addEventListener(
        'scroll',
        update,
        { passive: true }
      );


      update();

    };


  createScrollTop();


  /* =========================================================
     TOAST NOTIFICATION
  ========================================================= */

  function showToast(
    message,
    type = 'success'
  ) {

    let container =
      document.getElementById(
        'toastContainer'
      );


    if (!container) {

      container =
        document.createElement(
          'div'
        );

      container.id =
        'toastContainer';

      container.className =
        'toast-container';

      document.body.appendChild(
        container
      );

    }


    const toast =
      document.createElement(
        'div'
      );


    toast.className =
      `toast toast-${type}`;


    let icon =
      'fa-circle-check';


    if (type === 'warning') {

      icon =
        'fa-triangle-exclamation';

    }


    if (type === 'error') {

      icon =
        'fa-circle-xmark';

    }


    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;


    container.appendChild(
      toast
    );


    requestAnimationFrame(() => {

      toast.classList.add(
        'show'
      );

    });


    setTimeout(() => {

      toast.classList.remove(
        'show'
      );


      setTimeout(() => {

        toast.remove();

      }, 300);

    }, 3200);

  }


  /* =========================================================
     PHONE NUMBER CLICK FEEDBACK
  ========================================================= */

  document.querySelectorAll(
    'a[href^="tel:"], a[href*="wa.me"]'
  ).forEach(link => {

    link.addEventListener(
      'click',
      () => {

        link.classList.add(
          'clicked'
        );


        setTimeout(() => {

          link.classList.remove(
            'clicked'
          );

        }, 500);

      }
    );

  });


  /* =========================================================
     PAGE LOADED
  ========================================================= */

  window.addEventListener(
    'load',
    () => {

      document.body.classList.add(
        'page-loaded'
      );

    }
  );

});