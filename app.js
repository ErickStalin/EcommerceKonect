const exphbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
let productosEnCarrito = [];
const app = express();
require("dotenv").config();
const transporter = require("./helpers/mailer");
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const jwt = require("jsonwebtoken");
const blobStream = require('blob-stream'); 

// Configuración de Handlebars
const hbs = exphbs.create({ extname: "hbs", defaultLayout: "layout" });
app.set("view engine", "hbs");

// Carpeta de archivos estáticos
app.use(
  express.static(__dirname + "/public", { extensions: ["html", "css", "js"] })
);
app.use(cors());
app.use(bodyParser.json());
app.get('/favicon.ico', (req, res) => res.status(204));

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Establecer el motor de vistas como Handlebars

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


app.post("/editar_producto/:id", (req, res) => {
  const productId = req.params.id;
  const nuevoNombre = req.body.nuevoNombre; // Obtener el nuevo nombre del cuerpo de la solicitud
  const nuevoPrecio = req.body.nuevoPrecio; // Obtener el nuevo precio del cuerpo de la solicitud

  console.log(`Solicitud recibida para actualizar el producto con ID: ${productId}`);

  const query = `
      UPDATE productos SET Nombre = ?, Precio = ? WHERE CodigoProducto =  '${productId}'
  `;

  db.query(query, [nuevoNombre, nuevoPrecio], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al actualizar el producto." });
    } else {
      if (results.affectedRows > 0) {
        console.log(`Producto con ID ${productId} actualizado correctamente`);
        res.status(200).json({ message: "Producto actualizado correctamente" });
      } else {
        console.log(`No se encontró ningún producto con ID: ${productId}`);
        res.status(404).json({ error: "Producto no encontrado" });
      }
    }
  });
});


app.post("/eliminar_producto/:id", (req, res) => {
  const productId = req.params.id;

  console.log(`Solicitud recibida para eliminar el producto con ID: ${productId}`);

  const query = `
      DELETE FROM productos WHERE CodigoProducto = '${productId}'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al eliminar el producto." });
    } else {
      if (results.affectedRows > 0) {
        console.log(`Producto con ID ${productId} eliminado correctamente`);
        res.status(200).json({ message: "Producto eliminado correctamente" });
      } else {
        console.log(`No se encontró ningún producto con ID: ${productId}`);
        res.status(404).json({ error: "Producto no encontrado" });
      }
    }
  });
});



app.get("/carrito", (req, res) => {
  res.render("carrito");
});

app.post('/enviar-factura', async (req, res) => {
  const { nombre, direccion, correo, productosEnCarrito, totalAPagar } = req.body;

  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();

  doc.text(`Factura para: ${nombre}`);
  doc.text(`Dirección: ${direccion}`);
  doc.text('Detalles de la compra:');

  // Encabezado de la tabla
  doc.text('Producto                              Precio                              Cantidad');
  doc.moveDown(0.5); // Espacio después del encabezado

  const productosImprimir = productosEnCarrito.slice(0, 10); // Limitar a las primeras 10 líneas de productos

  productosImprimir.forEach(producto => {
    const { nombre, precio, cantidad } = producto;
    const productName = nombre.padEnd(40); // Ajusta el tamaño de la columna
    const productPrice = `$${precio}`.padEnd(32); // Ajusta el tamaño de la columna
    const productQuantity = cantidad.toString().padEnd(16); // Ajusta el tamaño de la columna

    doc.text(`${productName}${productPrice}${productQuantity}`);
  });

  doc.moveDown(1); // Espacio después de la tabla
  doc.text(`Total a Pagar: $${totalAPagar.toFixed(2)}`);

  // Generar el PDF y guardar en una variable de tipo buffer
  const pdfBuffer = await new Promise(resolve => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.end();
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Reemplaza con el host SMTP de tu proveedor de correo
    port: 587, // Puerto del servidor SMTP
    secure: false, // false para TLS; true para SSL
    auth: {
      user: process.env.EMAIL, // Dirección de correo electrónico desde la que enviarás los correos
      pass: process.env.EMAIL_PASSWORD // Contraseña de tu cuenta de correo
    }
  });

  transporter.sendMail({
    from: `Konect Soluciones: ${process.env.EMAIL}`,
    to: correo,
    subject: 'Factura de compra',
    text: `Hola ${nombre}, adjuntamos la factura de tu compra. Gracias por tu compra.`,
    attachments: [{
      filename: 'factura.pdf',
      content: pdfBuffer, // Aquí adjuntas el buffer del PDF
      contentType: 'application/pdf'
    }]
  }, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar la factura por correo electrónico' });
    } else {
      console.log('Correo enviado:', info.response);
      res.status(200).json({ message: 'Factura enviada exitosamente por correo electrónico' });
    }
  });
});

app.get('/confirmacion', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'ok.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al cargar la página de confirmación');
    } else {
      res.send(data);
    }
  });
});
//LOGIN
app.get('/edicion', (req, res) => {
  res.render('edicion'); 
});

// Función para verificar las credenciales
function verificarCredenciales(email, contraseña, callback) {
  // Consultar la base de datos
  const query = "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?";
  db.query(query, [email, contraseña], (error, resultados) => {
      if (error) {
          console.error("Error en la consulta: " + error.message);
          callback(false);
      } else {
          // Verificar si se encontraron resultados en la consulta
          if (resultados.length > 0) {
              callback(true); // Credenciales válidas
          } else {
              callback(false); // Credenciales inválidas
          }
      }
  });
}

// Definir la ruta para verificar las credenciales
app.post("/verificar-credenciales", (req, res) => {
  // Obtener las credenciales del cuerpo de la solicitud
  const { email, contraseña } = req.body;

  // Llamar a la función verificarCredenciales de manera asincrónica
  verificarCredenciales(email, contraseña, (autenticado) => {
      if (autenticado) {
          res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
      } else {
          res.status(401).json({ mensaje: "Credenciales incorrectas" });
      }
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor web en ejecución en http://localhost:${PORT}`);
});

module.exports = db;

