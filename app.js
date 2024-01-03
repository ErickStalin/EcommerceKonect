const exphbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();

// Configuración de Handlebars
const hbs = exphbs.create({ extname: "hbs", defaultLayout: "layout" });
app.set("view engine", "hbs");

// Carpeta de archivos estáticos
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(bodyParser.json());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dyrzihnrx",
  api_key: "725186379266327",
  api_secret: "SerMiIObG-I3y7g3_Q_LL-eFS1A",
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Erick",
  password: process.env.DB_PASSWORD || "0986167219",
  database: process.env.DB_NAME || "ventasKonect",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión exitosa a la base de datos.");
  }
});

// Rutas del proyecto PrincipalModify
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/productos", (req, res) => {
  res.sendFile(__dirname + "/public/index_productos.html");
});

app.get("/nosotros", (req, res) => {
  res.render("nosotros");
});

app.get("/contacto", (req, res) => {
  res.render("contacto");
});

// Nueva ruta para buscar productos desde el proyecto "productos"
app.get("/buscar_productos", (req, res) => {
  const query = `
    SELECT CodigoProducto, Nombre, Categoria, Imagenes FROM productos
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al buscar productos." });
    } else {
      results.forEach((producto) => {
        producto.Imagenes = cloudinary.url(producto.Imagenes, { secure: true });
      });

      res.json(results);
    }
  });
});

app.get("/detalles_producto/:id", (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT Nombre, Categoria, Existencia, Precio, Imagenes, Descripcion FROM productos WHERE CodigoProducto = '${productId}'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al buscar detalles del producto." });
    } else {
      if (results.length > 0) {
        res.render("detalles_producto", { producto: results[0] });
      } else {
        res.status(404).send("Producto no encontrado");
      }
    }
  });
});

app.get('/carrito', (req, res) => {
  res.render('carrito');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor web en ejecución en http://localhost:${PORT}`);
});
