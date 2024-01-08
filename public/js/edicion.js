document.addEventListener("DOMContentLoaded", () => {
  const productosDiv = document.querySelector(".catalogo");
  const pageList = document.querySelector(".page-list");
  const categoriaSelect = document.getElementById("categoria");
  const itemsPerPage = 16;
  let currentPage = 1;
  let productos = [];
  let productosEnCarrito = [];
  let currentCategoriaFiltro = "Todas";
  let isScrolling = false;

  function showProductsOnPage(page, categoriaFiltro) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let productsToShow = productos;

    if (categoriaFiltro !== "Todas") {
      productsToShow = productsToShow.filter(
        (producto) => producto.Categorias === categoriaFiltro
      );
    }

    const totalPages = Math.ceil(productsToShow.length / itemsPerPage);
    createPaginationButtons(totalPages);

    productosDiv.innerHTML = "";

    const startIndexToShow = (page - 1) * itemsPerPage;
    const endIndexToShow = startIndexToShow + itemsPerPage;

    productsToShow
      .slice(startIndexToShow, endIndexToShow)
      .forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");

        const imagen = document.createElement("img");
        imagen.src = producto.Imagenes;
        imagen.alt = producto.CodigoProducto;

        const nombre = document.createElement("p");
        nombre.classList.add("nombre");
        nombre.textContent = producto.Nombre;

        const CodigoProducto = document.createElement("p");
        CodigoProducto.classList.add("CodigoProducto");
        CodigoProducto.textContent = `Código: ${producto.CodigoProducto}`;

        function obtenerCodigoProducto(event) {
            // Verifica si event está disponible y si su objetivo tiene el atributo 'data-codigo-producto'
            if (event && event.target && event.target.dataset.codigoProducto) {
              return event.target.dataset.codigoProducto;
            } else {
              console.error('No se pudo obtener el código del producto');
              return null;
            }
        }
          

        const editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        // Aquí puedes añadir lógica de evento para el botón de editar si es necesario

        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "ELIMINAR";
        eliminarButton.addEventListener("click", () => {
          const codigoProducto = producto.CodigoProducto;

          fetch(`/eliminar_producto/${codigoProducto}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el producto');
            }
            return response.json();
          })
          .then(data => {
            console.log('Producto eliminado correctamente', data);
            // Realizar acciones adicionales si es necesario después de eliminar
            // Por ejemplo, actualizar la interfaz o mostrar un mensaje al usuario
          })
          .catch(error => {
            console.error('Hubo un problema al eliminar el producto', error);
            // Manejar errores, mostrar mensajes al usuario, etc.
          });
        });



          


        productoDiv.appendChild(imagen);
        productoDiv.appendChild(nombre);
        productoDiv.appendChild(CodigoProducto);
        productoDiv.appendChild(editarButton); // Agregar el botón de editar al div del producto
        productoDiv.appendChild(eliminarButton); // Agregar el botón de eliminar al div del producto
        productosDiv.appendChild(productoDiv);
      });
  }

  categoriaSelect.addEventListener("change", () => {
    const categoriaFiltro = categoriaSelect.value.trim();
    currentPage = 1;
    currentCategoriaFiltro = categoriaFiltro;
    showProductsOnPage(currentPage, categoriaFiltro);
  });

  function createPaginationButtons(totalPages) {
    pageList.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("li");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        showProductsOnPage(currentPage, currentCategoriaFiltro);
      });
      pageList.appendChild(pageButton);
    }
  }

  fetch("http://localhost:3000/buscar_productos")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      showProductsOnPage(currentPage, currentCategoriaFiltro);
    })
    .catch((error) => {
      console.error("Error al obtener datos de productos:", error);
    });
});
