document.addEventListener("DOMContentLoaded", () => {
  const carritoBtn = document.getElementById("carritoBtn");

  carritoBtn.addEventListener("click", () => {
    window.location.href = "/carrito"; // Redirige a la página del carrito
  });
});

function agregarAlCarrito(codigoProducto) {
  const cantidad = document.getElementById("cantidad").value;
  const nombreProducto = document.getElementById("nombreProducto").textContent;
  const precioProducto = document.getElementById("precioProducto").textContent;

  // Guardar la cantidad, nombre y precio del producto en el LocalStorage
  localStorage.setItem('cantidadCarrito', cantidad);
  localStorage.setItem('nombreProductoCarrito', nombreProducto);
  localStorage.setItem('precioProductoCarrito', precioProducto);
}


