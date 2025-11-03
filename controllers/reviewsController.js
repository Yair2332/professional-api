const { reviewsCollection, professionalsCollection, admin } = require('../config/firebase');

const reviewsController = {
  // 📌 CREAR una nueva reseña
  createReview: async (req, res) => {
    try {
      const { professionalId, message, stars, userName } = req.body;

      // Validar que el profesional existe
      const professionalDoc = await professionalsCollection.doc(professionalId).get();
      if (!professionalDoc.exists) {
        return res.status(404).json({ error: 'Profesional no encontrado' });
      }

      // Validar estrellas (1-5)
      if (stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Las estrellas deben ser entre 1 y 5' });
      }

      const reviewData = {
        professionalId,
        message,
        stars: parseInt(stars),
        userName,
        userImageUrl: "https://labsaenzrenauld.com/wp-content/uploads/2020/10/Perfil-hombre-ba%CC%81sico_738242395.jpg",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await reviewsCollection.add(reviewData);
      
      res.status(201).json({
        id: docRef.id,
        message: 'Reseña creada exitosamente',
        data: reviewData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear reseña: ' + error.message });
    }
  },

  // 📌 OBTENER todas las reseñas de un profesional
  getReviewsByProfessional: async (req, res) => {
    try {
      const { professionalId } = req.params;
      const snapshot = await reviewsCollection
        .where('professionalId', '==', professionalId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const reviews = [];
      snapshot.forEach(doc => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reseñas: ' + error.message });
    }
  },

  // 📌 OBTENER todas las reseñas
  getAllReviews: async (req, res) => {
    try {
      const snapshot = await reviewsCollection.orderBy('createdAt', 'desc').get();
      const reviews = [];
      
      snapshot.forEach(doc => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reseñas: ' + error.message });
    }
  },

  // 📌 OBTENER una reseña por ID
  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await reviewsCollection.doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: 'Reseña no encontrada' });
      }

      res.json({
        id: doc.id,
        ...doc.data()
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reseña: ' + error.message });
    }
  },

  // 📌 ACTUALIZAR una reseña por ID
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { message, stars } = req.body;

      // Validar estrellas si se están actualizando
      if (stars && (stars < 1 || stars > 5)) {
        return res.status(400).json({ error: 'Las estrellas deben ser entre 1 y 5' });
      }

      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (stars) {
        updateData.stars = parseInt(stars);
      }

      await reviewsCollection.doc(id).update(updateData);
      
      res.json({
        message: 'Reseña actualizada exitosamente',
        id: id,
        data: updateData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar reseña: ' + error.message });
    }
  },

  // 📌 ELIMINAR una reseña por ID
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      await reviewsCollection.doc(id).delete();
      
      res.json({ message: 'Reseña eliminada exitosamente', id: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar reseña: ' + error.message });
    }
  },

  // 📌 OBTENER estadísticas de reseñas de un profesional
  getReviewStats: async (req, res) => {
    try {
      const { professionalId } = req.params;
      const snapshot = await reviewsCollection
        .where('professionalId', '==', professionalId)
        .get();
      
      let totalStars = 0;
      let reviewCount = 0;
      const starCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

      snapshot.forEach(doc => {
        const review = doc.data();
        totalStars += review.stars;
        reviewCount++;
        starCount[review.stars]++;
      });

      const averageRating = reviewCount > 0 ? (totalStars / reviewCount).toFixed(1) : 0;

      res.json({
        professionalId,
        averageRating: parseFloat(averageRating),
        totalReviews: reviewCount,
        starDistribution: starCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas: ' + error.message });
    }
  }
};

module.exports = reviewsController;