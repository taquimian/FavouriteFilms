const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token.split(' ')[1], 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;  // Decodifica el token y extrae el userId
    req.userRole = decoded.role; // Extrae el rol del token
    next();  // Llama al siguiente middleware o ruta
  });
}

module.exports = verifyToken;
