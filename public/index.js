/* Script encargado del movimiento de la cabecera */
const contactHeader = document.querySelector(".contact-header-pc");
const stickyHeader = document.querySelector(".sticky-header");

let isSticky = false;

window.addEventListener("scroll", () => {
    const contactHeaderHeight = contactHeader.clientHeight;

    if (window.scrollY > contactHeaderHeight) {
        if (!isSticky) {
            // Establece la cabecera como fija
            stickyHeader.style.position = "fixed";
            stickyHeader.style.top = "0";
            isSticky = true;
        }
    } else {
        // Restaura la posición original
        stickyHeader.style.position = "relative";
        isSticky = false;
    }
});

/* Script encargado del carrusel de imagenes */
const cloudName = "dpofvpe7b";
const publicIDs = [
  "distribuidor-master-equipos-mikrotik-telecomunicaciones-ecuador-1_lxhwm3",
  "portafolio/ecgmpb9czjnavh7ib4to",
  "portafolio/jrgbitrswuztljkq030l",
  "portafolio/rs2t2grvmlxqccfdk3zs",
  "portafolio/cuwkxf5cjjqcwdbl49uj",
  "portafolio/cw7tn73brtpcqllvb5mt",
];
const apiKey = "236239313584192";

const sliderImage = document.getElementById("slider-image");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentImageIndex = 0;

function loadImage(index) {
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicIDs[index]}.jpg`;

  sliderImage.style.opacity = 0; // Establecer la opacidad en 0 para desvanecer
  setTimeout(() => {
    sliderImage.src = imageUrl;
    sliderImage.style.opacity = 1; // Aumentar la opacidad después de cambiar la imagen
  }, 1000);
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % publicIDs.length;
  loadImage(currentImageIndex);
}

function showPrevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + publicIDs.length) % publicIDs.length;
  loadImage(currentImageIndex);
}

prevBtn.addEventListener("click", showPrevImage);
nextBtn.addEventListener("click", showNextImage);

loadImage(currentImageIndex);
setInterval(showNextImage, 5000);

/* Script para la cabecera movible */
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".sticky-header");

menuToggle.addEventListener("click", () => {
    header.classList.toggle("active");
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        header.style.backgroundColor = "#FFFFFF"; // Cambia el color de fondo al hacer scroll
    } else {
        header.style.backgroundColor = "#ffffff"; // Restaura el color de fondo
    }
});

