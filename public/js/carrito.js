window.onload = () => {
  const carritoContainer = document.getElementById('carrito');
  let productosEnCarrito = localStorage.getItem('productosEnCarrito');
  productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];

  let totalAPagar = 0;

  if (productosEnCarrito.length > 0) {
    productosEnCarrito.forEach(producto => {
      const productoElement = document.createElement('p');
      productoElement.textContent = `Nombre: ${producto.nombre}, Precio: ${producto.precio}, Cantidad: ${producto.cantidad}`;
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
  const formularioFactura = document.getElementById('formularioFactura');

  pagarAhoraBtn.addEventListener('click', () => {
    formularioFactura.style.display = 'block';

    const datosFacturaForm = document.getElementById('datosFacturaForm');
    datosFacturaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      const nombre = document.getElementById('nombre').value;
      const direccion = document.getElementById('direccion').value;
      const correo = document.getElementById('correo').value;
    
      // Obtener datos del carrito del local storage
      let productosEnCarrito = localStorage.getItem('productosEnCarrito');
      productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];
    
      // Calcular el total a pagar
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
          body: JSON.stringify({ nombre, direccion, correo, productosEnCarrito, totalAPagar }) // Enviar productos y total a pagar al servidor
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
};