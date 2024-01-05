document.addEventListener("DOMContentLoaded", () => {
  const productosDiv = document.querySelector(".catalogo");
  const pageList = document.querySelector(".page-list");
  const categoriaSelect = document.getElementById("categoria");
  const itemsPerPage = 16;
  let currentPage = 1;
  let productos = [];
  let productosEnCarrito = [];
  let currentCategoriaFiltro = "Todas";

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

        const leerMasButton = document.createElement("button");
        leerMasButton.textContent = "Leer más";
        leerMasButton.addEventListener("click", () => {
          window.location.href = `/detalles_producto/${producto.CodigoProducto}`;
        });


        productoDiv.appendChild(imagen);
        productoDiv.appendChild(nombre);
        productoDiv.appendChild(CodigoProducto);
        productoDiv.appendChild(leerMasButton);
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
