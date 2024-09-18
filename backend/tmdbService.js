const axios = require('axios');
const apiKey = '8fca14cfaf1a6e9cb1d615f23654e608';
const baseUrl = 'https://api.themoviedb.org/3';

const getMovies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/discover/movie`, {
      params: {
        api_key: apiKey,
        language: 'es-ES',
        sort_by: 'popularity.desc',
        page: 1,
      },
    });
    const movies = response.data.results.map(movie => ({
      titulo: movie.title,
      descripcion: movie.overview,
      anio: new Date(movie.release_date).getFullYear(),
      urlImagen: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      tmdbId: movie.id,
    }));

    return movies;
  } catch (error) {
    console.error('Error al recuperar películas de TMDb:', error);
    return [];
  }
};

const setupTmdbRoutes = (app) => {
  // Endpoint para obtener el detalle de una película de TMDb por ID
  app.get('/api/peliculas/tmdb/:tmdbId', async (req, res) => {
    const tmdbId = req.params.tmdbId;
    try {
      const response = await axios.get(`${baseUrl}/movie/${tmdbId}`, {
        params: {
          api_key: apiKey,
          language: 'es-ES',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error al obtener detalles de la película de TMDb:', error);
      res.status(500).json({ message: 'Error al obtener detalles de la película' });
    }
  });
};

module.exports = {
  getMovies,
  setupTmdbRoutes,
};
