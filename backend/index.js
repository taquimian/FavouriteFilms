const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('./authMiddleware');
const tmdbService = require('./tmdbService');


const app = express();

// Configuración de multer para almacenar las imágenes en el servidor
const storage = multer.memoryStorage(); // Opciones de almacenamiento en memoria
const upload = multer({ storage: storage });

// Configuración de CORS para permitir solicitudes desde tu aplicación Angular
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
tmdbService.setupTmdbRoutes(app); 

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'taquimian',
  password: 'Arkantos96@',
  database: 'filmsLibraryBD'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta para obtener todas las películas
app.get('/api/peliculas/listar', (req, res) => {
  const query = 'SELECT id, titulo, descripcion, anio, imagen, nombreImagen FROM peliculas'; 
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener películas:', error);
      res.status(500).json({ error: 'Error al obtener películas' });
      return;
    }

    const peliculasConImagenesBase64 = results.map((pelicula) => {
      if (pelicula.imagen && Buffer.isBuffer(pelicula.imagen) && pelicula.nombreImagen) {
        const base64Image = Buffer.from(pelicula.imagen).toString('base64');
        const extension = obtenerExtension(pelicula.nombreImagen);
        pelicula.imagen = `data:image/${extension};base64,${base64Image}`;
      }
      return pelicula;
    });

    res.json(peliculasConImagenesBase64);
  });
});

// Ruta para obtener una película por su ID
app.get('/api/peliculas/obtener/:id', (req, res) => {
  const idPelicula = req.params.id; // ID de la película a buscar en la base de datos

  const query = 'SELECT id, titulo, descripcion, anio, imagen, nombreImagen FROM peliculas WHERE id = ?';
  connection.query(query, [idPelicula], (error, results) => {
    if (error) {
      console.error('Error al obtener la película por ID:', error);
      res.status(500).json({ error: 'Error al obtener la película por ID' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Película no encontrada' });
      return;
    }

    const pelicula = results[0];
    if (pelicula.imagen && Buffer.isBuffer(pelicula.imagen) && pelicula.nombreImagen) {
      const base64Image = Buffer.from(pelicula.imagen).toString('base64');
      const extension = obtenerExtension(pelicula.nombreImagen);
      pelicula.imagen = `data:image/${extension};base64,${base64Image}`;
    }

    res.json(pelicula);
  });
});


app.post('/api/peliculas/agregar', upload.single('imagen'), (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const nuevaPelicula = req.body;
  const imagen = req.file; // La imagen se encuentra en req.file

  // Validación de datos
  if (!nuevaPelicula.titulo || !nuevaPelicula.descripcion || !nuevaPelicula.anio || !imagen) {
    return res.status(400).json({ error: 'Faltan datos obligatorios o la imagen' });
  }

  // Insertar la nueva película en la base de datos junto con la imagen y el nombre de la imagen
  const query = 'INSERT INTO peliculas (titulo, descripcion, anio, imagen, nombreImagen) VALUES (?, ?, ?, ?, ?)';
  const values = [
    nuevaPelicula.titulo,
    nuevaPelicula.descripcion,
    nuevaPelicula.anio,
    imagen.buffer, // Verifica si la referencia correcta es 'imagen.buffer' o 'imagen' para la inserción del blob
    nuevaPelicula.nombreImagen
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al insertar la película:', error);
      return res.status(500).json({ error: 'Error al insertar la película en la base de datos' });
    }

    // Si la inserción es exitosa, envía una respuesta de éxito al cliente
    res.status(200).json({ message: 'Película agregada correctamente' });
  });
});


app.post('/api/peliculas/modificar/:id', upload.single('imagen'), (req, res) => {
  const idPelicula = req.params.id; // ID de la película a modificar
  const datosActualizados = req.body;
  const nuevaImagen = req.file; // Nueva imagen, si se proporciona

  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  // Construir la consulta de actualización (UPDATE) según los campos que se desean modificar
  let query = 'UPDATE peliculas SET ';
  const values = [];
  
  // Comprobar y agregar los campos que se desean actualizar
  if (datosActualizados.titulo) {
    query += 'titulo = ?, ';
    values.push(datosActualizados.titulo);
  }
  if (datosActualizados.descripcion) {
    query += 'descripcion = ?, ';
    values.push(datosActualizados.descripcion);
  }
  if (datosActualizados.anio) {
    query += 'anio = ?, ';
    values.push(datosActualizados.anio);
  }
  if (nuevaImagen) {
    query += 'imagen = ?, nombreImagen = ?, ';
    values.push(nuevaImagen.buffer); // Verifica si la referencia correcta es 'nuevaImagen.buffer' o 'nuevaImagen' para la actualización del blob
    values.push(datosActualizados.nombreImagen);
  }
  

  
  // Eliminar la coma final y agregar la condición WHERE con el ID de la película
  query = query.slice(0, -2); // Eliminar la última coma y espacio
  query += ' WHERE id = ?';
  values.push(idPelicula);

  connection.query(query, values, (error, results) => {
    // Manejo de errores y respuesta al cliente
  });
});

app.post('/api/peliculas/modificar/:id', upload.single('imagen'), (req, res) => {
  const idPelicula = req.params.id; // ID de la película a modificar
  const datosActualizados = req.body;
  const nuevaImagen = req.file; // Nueva imagen, si se proporciona

  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  // Construir la consulta de actualización (UPDATE) según los campos que se desean modificar
  let query = 'UPDATE peliculas SET ';
  const values = [];
  
  // Comprobar y agregar los campos que se desean actualizar
  if (datosActualizados.titulo) {
    query += 'titulo = ?, ';
    values.push(datosActualizados.titulo);
  }
  if (datosActualizados.descripcion) {
    query += 'descripcion = ?, ';
    values.push(datosActualizados.descripcion);
  }
  if (datosActualizados.anio) {
    query += 'anio = ?, ';
    values.push(datosActualizados.anio);
  }

  
  // Eliminar la coma final y agregar la condición WHERE con el ID de la película
  query = query.slice(0, -2); // Eliminar la última coma y espacio
  query += ' WHERE id = ?';
  values.push(idPelicula);

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al actualizar la película:', error);
      return res.status(500).json({ error: 'Error al actualizar la película en la base de datos' });
    }

    // Si la actualización es exitosa, envía una respuesta de éxito al cliente
    res.status(200).json({ message: 'Película actualizada correctamente' });
  });
});


app.post('/api/usuarios/registro', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)';
  connection.query(query, [username, hashedPassword, role], (error, results) => {
    if (error) {
      console.error('Error al registrar el usuario:', error);
      return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE username = ?';
  connection.query(query, [username], async (error, results) => {
    if (error || results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Endpoint para obtener películas de TMDb
app.get('/api/peliculas/tmdb', async (req, res) => {
  try {
    const movies = await tmdbService.getMovies();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

function obtenerExtension(nombreArchivo) {
  const splitArray = nombreArchivo.split('.');
  return splitArray[splitArray.length - 1];
}

// Otros endpoints para realizar operaciones CRUD

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en el puerto ${PORT}`);
});
