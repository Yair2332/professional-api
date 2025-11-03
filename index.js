const express = require('express');
const cors = require('cors');
const { testFirebaseConnection } = require('./config/firebase');
const professionalsRoutes = require('./routes/professionalsRoutes');
const newsRoutes = require('./routes/newsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const utf8Middleware = require('./middleware/utf8Middleware');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));
app.use(utf8Middleware);

// Rutas
app.use('/professionals', professionalsRoutes);
app.use('/news', newsRoutes);
app.use('/reviews', reviewsRoutes); 

// Ruta de prueba actualizada
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Profesionales, Noticias y Reseñas funcionando',
    endpoints: {
      'Professionals': {
        'GET /professionals': 'Obtener todos los profesionales',
        'GET /professionals/:id': 'Obtener un profesional por ID',
        'POST /professionals': 'Crear un nuevo profesional',
        'PUT /professionals/:id': 'Actualizar un profesional',
        'DELETE /professionals/:id': 'Eliminar un profesional'
      },
      'News': {
        'GET /news': 'Obtener todas las noticias',
        'GET /news/user/:userId': 'Obtener noticias por usuario',
        'GET /news/:id': 'Obtener una noticia por ID',
        'POST /news': 'Crear una nueva noticia',
        'PUT /news/:id': 'Actualizar una noticia',
        'PUT /news/:id/like': 'Dar like a noticia',
        'PUT /news/:id/unlike': 'Quitar like de noticia',
        'DELETE /news/:id': 'Eliminar una noticia'
      },
      'Reviews': { 
        'GET /reviews': 'Obtener todas las reseñas',
        'GET /reviews/professional/:professionalId': 'Obtener reseñas por profesional',
        'GET /reviews/stats/:professionalId': 'Obtener estadísticas de reseñas',
        'GET /reviews/:id': 'Obtener una reseña por ID',
        'POST /reviews': 'Crear una nueva reseña',
        'PUT /reviews/:id': 'Actualizar una reseña',
        'DELETE /reviews/:id': 'Eliminar una reseña'
      }
    }
  });
});

// Inicializar servidor
app.listen(port, async () => {
  console.log(`🚀 API de Profesionales, Noticias y Reseñas corriendo en http://localhost:${port}`);
  await testFirebaseConnection();
});