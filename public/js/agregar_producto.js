document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tuFormulario");
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      // Validar nombre (máximo 30 caracteres)
      const nombreInput = document.getElementById("nombre");
      const nombre = nombreInput.value;
      if (nombre.length > 30) {
        alert("El nombre no puede tener más de 30 caracteres.");
        return;
      }
  
      // Validar código único (solo números y 10 dígitos)
      const codigoInput = document.getElementById("codigo");
      const codigo = codigoInput.value;
      if (!/^\d{10}$/.test(codigo)) {
        alert("El código debe contener solo números y tener 10 dígitos.");
        return;
      }
  
      // Validar código de barras (máximo 10 caracteres)
      const codigoBarrasInput = document.getElementById("codigoBarras");
      const codigoBarras = codigoBarrasInput.value;
      if (codigoBarras.length > 10) {
        alert("El código de barras no puede tener más de 10 caracteres.");
        return;
      }
  
      // Validar categoría (máximo 10 caracteres)
      const categoriaInput = document.getElementById("categoria");
      const categoria = categoriaInput.value;
      if (categoria.length > 10) {
        alert("La categoría no puede tener más de 10 caracteres.");
        return;
      }
  
      // Validar precio (no puede ser 0)
      const precioInput = document.getElementById("precio");
      const precio = parseFloat(precioInput.value);
      if (precio <= 0 || isNaN(precio)) {
        alert("El precio debe ser un número mayor a 0.");
        return;
      }
  
      // Resto del código para enviar el formulario
      form.submit(); // Envía el formulario si no hay errores
    });
  });
  