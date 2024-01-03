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