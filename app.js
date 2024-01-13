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
const multer = require('multer');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(cors());
app.get('/favicon.ico', (req, res) => res.status(204));

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
app.set('view engine', 'hbs');

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

//VERIFICAAAAAR
app.post("/agregar_producto", (req, res) => {
  const { nombre, codigo, codigoBarras, descripcion, categoria, existencia, precio, coste } = req.body;

  const query = "INSERT INTO productos (Nombre, CodigoProducto, CodigoBarras, Descripcion, Categoria, Existencia, Precio, Costo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [nombre, codigo, codigoBarras, descripcion, categoria, existencia, precio, coste], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al agregar el producto" });
    } else {
      res.render('agregar_producto');
      res.status(200).json({ message: "Producto agregado correctamente" });
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

app.get("/editar_producto/:id", (req, res) => {
  const productId = req.params.id;

  // Realizar una consulta a la base de datos para obtener los datos del producto
  const query = "SELECT * FROM productos WHERE CodigoProducto = ?";
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Error al obtener datos del producto:", err);
      res.status(500).json({ error: "Error al obtener datos del producto." });
    } else {
      const producto = results[0]; // Suponiendo que obtienes solo un resultado
      res.render("editar_producto.hbs", { productId, producto });
    }
  });
});

app.post("/editar_producto/:id", (req, res) => {
  const productId = req.params.id;
  const nuevoNombre = req.body.nuevoNombre;
  const nuevoPrecio = req.body.nuevoPrecio;
  const nuevoCosto = req.body.nuevoCosto;
  const nuevaExistencia = req.body.nuevaExistencia;
  const nuevaDescripcion = req.body.nuevaDescripcion;

  const query = `
    UPDATE productos 
    SET Nombre = ?, Precio = ?, Costo = ?, Existencia = ?, Descripcion = ?
    WHERE CodigoProducto = ?
  `;

  db.query(
    query,
    [nuevoNombre, nuevoPrecio, nuevoCosto, nuevaExistencia, nuevaDescripcion, productId],
    (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).json({ error: "Error al actualizar el producto." });
      } else {
        if (results.affectedRows > 0) {
          console.log(`Producto con ID ${productId} actualizado correctamente`);
          
          // Redirigir a la página de productos después de la actualización
          res.redirect('/edicion');
        } else {
          console.log(`No se encontró ningún producto con ID: ${productId}`);
          res.status(404).json({ error: "Producto no encontrado" });
        }
      }
    }
  );
});


app.get("/nuevo_producto", (req, res) => {
  res.render('agregar_producto');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Directorio donde se guardan temporalmente los archivos antes de subirlos a Cloudinary
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = file.originalname.split('.').pop(); // Obtener la extensión del archivo original
    const filename = `${uniqueSuffix}.${extension}`; // Nuevo nombre de archivo único con extensión
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.post("/nuevo_producto", upload.single('imagen'), (req, res) => {
  const { nombre, codigo, codigoBarras, descripcion, categoria, existencia, precio, coste } = req.body;

  // Verificar la existencia del código en el servidor antes de insertar
  const consultaExistencia = 'SELECT COUNT(*) AS total FROM productos WHERE CodigoProducto = ?';
  db.query(consultaExistencia, [codigo], (error, resultados) => {
    if (error) {
      console.error('Error al verificar la existencia del código:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      const codigoExistente = resultados[0].total > 0;
      if (codigoExistente) {
        res.status(400).json({ error: 'El código ya existe, no se puede agregar el producto' });
      } else {
        // Cargar la imagen a Cloudinary desde el archivo temporal en el servidor
        cloudinary.uploader.upload(req.file.path, { folder: "tu_carpeta_en_cloudinary" }, (error, result) => {
          if (error) {
            console.error("Error al cargar la imagen a Cloudinary:", error);
            res.status(500).json({ error: "Error al agregar el producto" });
          } else {
            // Obtener el Public ID de la imagen cargada en Cloudinary
            console.log("Imagen subida a Cloudinary. Public ID:", result.public_id);
            const publicId = result.public_id; // Public ID de la imagen en Cloudinary

            // Insertar el Public ID en la base de datos
            const query = "INSERT INTO productos (Nombre, CodigoProducto, CodigoBarras, Descripcion, Categoria, Existencia, Precio, Costo, Imagenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(query, [nombre, codigo, codigoBarras, descripcion, categoria, existencia, precio, coste, publicId], (err, results) => {
              if (err) {
                console.error("Error al ejecutar la consulta:", err);
                res.status(500).json({ error: "Error al agregar el producto" });
              } else {
                console.log("Producto agregado correctamente");
                res.redirect('/edicion'); // Redirigir a la página de edición
              }
            });
          }
        });
      }
    }
  });
});


app.get('/verificar_codigo_existente', (req, res) => {
  const codigo = req.query.codigo;

  // Consultar la base de datos para verificar la existencia del código
  const consultaExistencia = 'SELECT COUNT(*) AS total FROM productos WHERE CodigoProducto = ?';
  db.query(consultaExistencia, [codigo], (error, resultados) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      const codigoExistente = resultados[0].total > 0;
      res.json({ existe: codigoExistente });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor web en ejecución en http://localhost:${PORT}`);
});

module.exports = db;

