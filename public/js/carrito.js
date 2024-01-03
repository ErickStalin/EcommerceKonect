window.onload = () => {
  const cantidad = localStorage.getItem('cantidadCarrito');
  const nombreProducto = localStorage.getItem('nombreProductoCarrito');
  const precioProducto = localStorage.getItem('precioProductoCarrito');

  if (cantidad !== null && nombreProducto !== null && precioProducto !== null) {
    const carritoContainer = document.getElementById('carrito');

    const cantidadElement = document.createElement('p');
    cantidadElement.textContent = `Cantidad en el carrito: ${cantidad}`;

    const productoInfoElement = document.createElement('p');
    productoInfoElement.textContent = `Producto: ${nombreProducto}, Precio: ${precioProducto}`;

    carritoContainer.appendChild(cantidadElement);
    carritoContainer.appendChild(productoInfoElement);
  }
};
