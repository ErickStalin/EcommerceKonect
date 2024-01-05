document.addEventListener("DOMContentLoaded", () => {
  const agregarAlCarritoBtn = document.getElementById("agregarAlCarrito");
  const carritoBtn = document.getElementById("carritoBtn");

  carritoBtn.addEventListener("click", () => {
    window.location.href = "/carrito"; // Redirige a la página del carrito
  });

  if (agregarAlCarritoBtn) {
    agregarAlCarritoBtn.addEventListener("click", () => {
      const nombre = document.getElementById("nombreProducto").textContent;
      const precio = document.getElementById("precioProducto").textContent;
      const cantidad = document.getElementById("cantidad").value;

      const productoAgregado = {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad
      };

      let productosEnCarrito = localStorage.getItem('productosEnCarrito');
      productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];

      // Agregar el nuevo producto a la lista existente de productos en el carrito
      productosEnCarrito.push(productoAgregado);

      // Actualizar el localStorage con la lista actualizada de productos en el carrito
      localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));

      alert("Producto agregado al carrito");
    });
  } else {
    console.error("El botón 'agregarAlCarrito' no se encuentra en el documento");
  }
});
