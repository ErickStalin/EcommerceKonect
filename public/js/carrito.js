window.onload = () => {
  const carritoContainer = document.getElementById('carrito');
  let productosEnCarrito = localStorage.getItem('productosEnCarrito');
  productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];

  let totalAPagar = 0;

  if (productosEnCarrito.length > 0) {
    productosEnCarrito.forEach((producto, index) => { 
      const productoElement = document.createElement('div');
      productoElement.innerHTML = `
        <p>Nombre: ${producto.primeraPalabra}, Precio: ${producto.precio}, Cantidad: ${producto.cantidad}</p>
        <span class="eliminar-producto" data-index="${index}">🗑️</span>
      `;
      carritoContainer.appendChild(productoElement);

      totalAPagar += parseFloat(producto.precio) * parseInt(producto.cantidad);
    });
  } else {
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.textContent = 'El carrito está vacío';
    carritoContainer.appendChild(emptyCartMessage);
  }

  const totalAPagarElement = document.getElementById('totalAPagar');
  totalAPagarElement.textContent = `Total a Pagar: $${totalAPagar.toFixed(2)}`;

  const pagarAhoraBtn = document.getElementById('pagarAhora');
  const seguirComprandoBtn = document.getElementById('seguirComprando');
  const formularioFactura = document.getElementById('formularioFactura');

  // Evento para eliminar productos del carrito
  carritoContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-producto')) {
      const productoIndex = event.target.dataset.index;
      productosEnCarrito.splice(productoIndex, 1);
      localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
      location.reload();
    }
  });

  pagarAhoraBtn.addEventListener('click', () => {
    formularioFactura.style.display = 'block';

    const datosFacturaForm = document.getElementById('datosFacturaForm');
    datosFacturaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      const nombre = document.getElementById('nombre').value;
      const direccion = document.getElementById('direccion').value;
      const correo = document.getElementById('correo').value;
      const identificacion = document.getElementById('identificacion').value;
    
      let productosEnCarrito = localStorage.getItem('productosEnCarrito');
      productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];
    
      let totalAPagar = 0;
      productosEnCarrito.forEach(producto => {
        totalAPagar += parseFloat(producto.precio) * parseInt(producto.cantidad);
      });
    
      try {
        const response = await fetch('/enviar-factura', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre, direccion, correo, identificacion, productosEnCarrito, totalAPagar })
        });
    
        if (!response.ok) {
          throw new Error('Error al enviar la factura');
        }
    
        alert('Factura enviada por correo electrónico.');
        localStorage.removeItem('productosEnCarrito');
        window.location.href = '/confirmacion';
      } catch (error) {
        console.error(error);
        alert('Hubo un error al enviar la factura');
      }
    });
  });
  seguirComprandoBtn.addEventListener('click', () => {
    window.location.href = 'index_productos.html';
  });
};
