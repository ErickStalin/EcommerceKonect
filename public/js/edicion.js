document.getElementById('cerrarSesionBtn').addEventListener('click', async function() {
  window.location.href = '/index_productos.html';
});

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
        productoDiv.dataset.codigoProducto = producto.CodigoProducto;

        const imagen = document.createElement("img");
        imagen.src = producto.Imagenes;
        imagen.alt = producto.CodigoProducto;

        const nombre = document.createElement("p");
        nombre.classList.add("nombre");
        nombre.textContent = producto.Nombre;

        function obtenerCodigoProducto(event) {
          const parentElement = event.target.closest("[data-codigo-producto]");

          if (parentElement) {
            return parentElement.dataset.codigoProducto;
          } else {
            console.error("No se pudo obtener el código del producto");
            return null;
          }
        }

        const editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        editarButton.addEventListener("click", (event) => {
          const codigoProducto = obtenerCodigoProducto(event);

          if (codigoProducto) {
            window.location.href = `/editar_producto/${codigoProducto}`;
          }
        });


        const CodigoProducto = document.createElement("p");
        CodigoProducto.classList.add("CodigoProducto");
        CodigoProducto.textContent = `Código: ${producto.CodigoProducto}`;

        function eliminarProductoDeLista(codigoProducto) {
          productos = productos.filter(producto => producto.CodigoProducto !== codigoProducto);
          showProductsOnPage(currentPage, currentCategoriaFiltro);
        }
      
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "ELIMINAR";
        eliminarButton.addEventListener("click", (event) => {
          const codigoProducto = obtenerCodigoProducto(event);
      
          if (codigoProducto) {
            const confirmacion = confirm("¿Estás seguro de eliminar el producto?");
      
            if (confirmacion) {
              fetch(`/eliminar_producto/${codigoProducto}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Error al eliminar el producto");
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log("Producto eliminado correctamente", data);
                  alert("Producto eliminado con éxito");
                  eliminarProductoDeLista(codigoProducto); 
                })
                .catch((error) => {
                  console.error("Hubo un problema al eliminar el producto", error);
                });
            }
          }
        });
        productoDiv.appendChild(imagen);
        productoDiv.appendChild(nombre);
        productoDiv.appendChild(CodigoProducto);
        productoDiv.appendChild(editarButton); 
        productoDiv.appendChild(eliminarButton); 
        productosDiv.appendChild(productoDiv);
      });
  }

  const agregarProductoBtn = document.getElementById('agregarProductoBtn');

  agregarProductoBtn.addEventListener('click', () => {
    console.log("Botón 'Agregar Producto' clickeado");
    window.location.href = 'nuevo_producto';
  });

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

  fetch("https://ecommercekonect-production.up.railway.app/buscar_productos")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      showProductsOnPage(currentPage, currentCategoriaFiltro);
    })
    .catch((error) => {
      console.error("Error al obtener datos de productos:", error);
    });
});
