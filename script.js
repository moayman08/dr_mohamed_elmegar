// =========================================================
// EDIT THESE TWO LINKS ONLY:
// =========================================================
const WHATSAPP_NUMBER = "201007450402"; // Egypt number, digits only
const FACEBOOK_URL = "https://www.facebook.com/"; // Replace with the doctor's Facebook page

const whatsappBase = `https://wa.me/${201007450402}`;
document.getElementById("whatsappLink").href = whatsappBase;
document.getElementById("facebookLink").href = FACEBOOK_URL;
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Appointment buttons open WhatsApp with the selected clinic already included.
const modal = document.getElementById("contactModal");
const modalText = document.getElementById("modalText");
const modalWhatsapp = document.getElementById("modalWhatsapp");

document.querySelectorAll(".schedule-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const location = btn.dataset.location;
    const message = `Hello Dr. Mohamed Abdelfatah Elmegar, I would like to ask about an appointment at the ${location} clinic.`;
    modalText.textContent = `Your selected clinic: ${location}. Send a WhatsApp message to confirm the available appointment time.`;
    modalWhatsapp.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}
document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if(e.target === lightbox) closeLightbox(); });

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Keyboard accessibility
document.addEventListener("keydown", e => {
  if(e.key === "Escape"){
    closeModal();
    closeLightbox();
  }
});
