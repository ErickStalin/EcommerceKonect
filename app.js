const exphbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const app = express();
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const PDFDocument = require('pdfkit');


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
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 30000,
  authPlugin: 'caching_sha2_password',
  insecureAuth: true, 
  typeCast: true,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DB_PASSWORD, 'ascii'),
  },
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

  const doc = new PDFDocument();

  // Añadir logo al encabezado
  const logoPath = path.join(__dirname, './public/logo.png');
  doc.image(logoPath, 450, 45, { width: 150 });

  // Encabezado personalizado (alineado a la izquierda)
  doc.fontSize(20).text('Konect Soluciones', 50, 57); // Ajusta la coordenada x según tu preferencia

  // Información del cliente (alineada a la izquierda)
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Factura para: ${nombre}`, { align: 'left' });
  doc.text(`Dirección: ${direccion}`, { align: 'left' });

  // Detalles de la compra (alineados a la izquierda)
  doc.moveDown(1);
  doc.fontSize(12).text('Detalles de la compra:', { align: 'left' });

  // Encabezado de la tabla
  doc.moveDown(0.5);
  doc.fontSize(10);
  const detallesCompraY = doc.y; // Guarda la posición actual Y para los detalles de la compra
  doc.lineJoin('miter').rect(50, detallesCompraY, 500, 20).stroke(); // Línea superior de la tabla
  doc.text('Producto', 60, detallesCompraY + 3);
  doc.text('Precio', 300, detallesCompraY + 3, { width: 100, align: 'right' });
  doc.text('Cantidad', 450, detallesCompraY + 3, { width: 50, align: 'right' });
  doc.moveDown(0.5);

  const productosImprimir = productosEnCarrito.slice(0, 10);

  productosImprimir.forEach((producto, index) => {
    const { nombre, precio, cantidad } = producto;
  
    // Calcular la posición Y en función del índice
    const yPosition = detallesCompraY + 20 + index * 20;
  
    console.log(`Producto: ${nombre}, Precio: ${precio}, Cantidad: ${cantidad}`); // Agregado para depuración
  
    // Columna de Nombre (ajustar el ancho y truncar si es necesario)
    const maxNombreLength = 25; // Establece la longitud máxima permitida para el nombre
    const truncatedNombre = nombre.length > maxNombreLength ? nombre.substring(0, maxNombreLength) + '...' : nombre;
  
    // Convertir precio a número antes de formatearlo
    const precioNumerico = parseFloat(precio);
  
    // Verificar si el precio es un número válido
    if (!isNaN(precioNumerico)) {
      // Fila de datos
      doc.text(`${truncatedNombre}`, 60, yPosition)
        .text(`$${precioNumerico.toFixed(2)}`, 300, yPosition, { width: 100, align: 'right' })
        .text(`${cantidad.toString()}`, 450, yPosition, { width: 50, align: 'right' });
    } else {
      // Si el precio no es un número, imprímelo para depuración
      console.log(`Precio inválido en el producto: ${nombre}, Tipo: ${typeof precio}`);
    }
  });

  // Total a pagar
  doc.moveDown(1.5);
  doc.text(`Total a Pagar: $${totalAPagar.toFixed(2)}`, { align: 'right' });


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

  // Configuración del servicio de correo
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Envío del correo con la factura adjunta
  transporter.sendMail({
    from: `Konect Soluciones: ${process.env.EMAIL}`,
    to: correo,
    subject: 'Factura de compra',
    text: `Hola ${nombre}, adjuntamos la factura de tu compra. Gracias por tu compra.`,
    attachments: [{
      filename: 'factura.pdf',
      content: pdfBuffer,
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

