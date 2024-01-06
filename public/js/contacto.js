const acordion = document.querySelector(".acordion");
const images = document.querySelectorAll(".acordion img");

let isMouseDown = false;
let startX;
let scrollLeft;
let isScrolling = false;

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      const headerContainer = document.querySelector('.contact-header-pc');
      const stickyHeader = document.querySelector('.sticky-header');
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > headerContainer.clientHeight) {
        stickyHeader.style.top = '0';
        if (currentScroll > headerContainer.clientHeight + 100) {
          stickyHeader.style.opacity = '1';
        }
      } else {
        stickyHeader.style.opacity = '0';
        stickyHeader.style.top = '90px'; // Ajusta la distancia superior según sea necesario
      }
      isScrolling = false;
    });
    isScrolling = true;
  }
});

acordion.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  startX = e.pageX - acordion.offsetLeft;
  scrollLeft = acordion.scrollLeft;
});

acordion.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

acordion.addEventListener("mouseup", () => {
  isMouseDown = false;
});

acordion.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  const x = e.pageX - acordion.offsetLeft;
  const walk = (x - startX) * 2; // Ajusta la sensibilidad del movimiento
  acordion.scrollLeft = scrollLeft - walk;
});

images.forEach((image) => {
  image.addEventListener("dragstart", (e) => e.preventDefault());
});

function iniciarMap(){
  var coord = {lat:-34.5956145 ,lng: -58.4431949};
  var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 10,
    center: coord
  });
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
}