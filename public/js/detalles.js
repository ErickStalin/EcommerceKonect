document.addEventListener("DOMContentLoaded", () => {
  const agregarAlCarritoBtn = document.getElementById("agregarAlCarrito");
  const carritoBtn = document.getElementById("carritoBtn");
  const atrasBtn = document.getElementById("atrasBtn");

  carritoBtn.addEventListener("click", () => {
    window.location.href = "/carrito";
  });

  atrasBtn.addEventListener("click", () => {
    window.location.href = "/index_productos";
  });

  if (agregarAlCarritoBtn) {
    agregarAlCarritoBtn.addEventListener("click", () => {
      const nombre = document.getElementById("nombreProducto").textContent;
      const precio = document.getElementById("precioProducto").textContent;
      const cantidad = document.getElementById("cantidad").value;
      const primeraPalabra = obtenerPrimerasPalabras(nombre, 10);

      const productoAgregado = {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        primeraPalabra: primeraPalabra
      };

      let productosEnCarrito = localStorage.getItem('productosEnCarrito');
      productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];

      productosEnCarrito.push(productoAgregado);

      localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));

      alert("Producto agregado al carrito");
    });
  } else {
    console.error("El botón 'agregarAlCarrito' no se encuentra en el documento");
  }
});

function obtenerPrimerasPalabras(texto, n) {
  const palabras = texto.split(' ');
  return palabras.slice(0, n).join(' ');
}
