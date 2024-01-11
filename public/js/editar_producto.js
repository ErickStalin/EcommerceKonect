document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const productIdInput = document.getElementById("productId");
  const cancelarBtn = document.querySelector(".cancelarBtnEdi");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const productId = productIdInput.value;
    const nuevoNombre = document.getElementById("nuevoNombre").value;
    const nuevoPrecio = document.getElementById("nuevoPrecio").value;
    const nuevoCosto = document.getElementById("nuevoCosto").value;
    const nuevaExistencia = document.getElementById("nuevaExistencia").value;
    const nuevaDescripcion = document.getElementById("nuevaDescripcion").value;

    const data = {
      productId,
      nuevoNombre,
      nuevoPrecio,
      nuevoCosto,
      nuevaExistencia,
      nuevaDescripcion,
    };

    // Hacer la solicitud para actualizar el producto
    fetch("/editar_producto/" + productId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Error al actualizar el producto:",
            response.statusText
          );
          alert("Hubo un error al actualizar el producto");
        } else {
          // Mostrar una alerta de éxito
          alert("Producto actualizado correctamente");
          window.location.href = '/edicion';
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
        // Manejar el error según sea necesario
        alert("Hubo un error al actualizar el producto");
      });
  });

  cancelarBtn.addEventListener("click", () => {
    window.location.href = '/edicion';
  });
});
