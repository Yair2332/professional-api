const { newsCollection, professionalsCollection, admin } = require('../config/firebase');

const newsController = {
  // 📌 CREAR una nueva noticia
  createNews: async (req, res) => {
    try {
      const newsData = {
        ...req.body,
        imgUrl: req.body.imgUrl || "https://biblus.accasoftware.com/es/wp-content/uploads/sites/3/2023/02/intervencion-de-reparacion.jpg",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isLiked: req.body.isLiked || false,
        likes: req.body.likes || 0
      };

      const docRef = await newsCollection.add(newsData);
      
      res.status(201).json({
        id: docRef.id,
        message: 'Noticia creada exitosamente',
        data: newsData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear noticia: ' + error.message });
    }
  },

  // 📌 OBTENER todas las noticias
  getAllNews: async (req, res) => {
    try {
      const snapshot = await newsCollection.orderBy('createdAt', 'desc').get();
      const news = [];
      
      snapshot.forEach(doc => {
        news.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener noticias: ' + error.message });
    }
  },

  // 📌 OBTENER noticias por userId
  getNewsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const snapshot = await newsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const userNews = [];
      snapshot.forEach(doc => {
        userNews.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json(userNews);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener noticias del usuario: ' + error.message });
    }
  },

  // 📌 OBTENER una noticia por ID
  getNewsById: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await newsCollection.doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: 'Noticia no encontrada' });
      }

      res.json({
        id: doc.id,
        ...doc.data()
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener noticia: ' + error.message });
    }
  },

  // 📌 ACTUALIZAR una noticia por ID
  updateNews: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await newsCollection.doc(id).update(updateData);
      
      res.json({
        message: 'Noticia actualizada exitosamente',
        id: id,
        data: updateData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar noticia: ' + error.message });
    }
  },

  // 📌 DAR LIKE a una noticia
  likeNews: async (req, res) => {
    try {
      const { id } = req.params;
      
      await newsCollection.doc(id).update({
        isLiked: true,
        likes: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ message: 'Like agregado exitosamente', id: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al dar like: ' + error.message });
    }
  },

  // 📌 QUITAR LIKE a una noticia
  unlikeNews: async (req, res) => {
    try {
      const { id } = req.params;
      
      await newsCollection.doc(id).update({
        isLiked: false,
        likes: admin.firestore.FieldValue.increment(-1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ message: 'Like removido exitosamente', id: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al quitar like: ' + error.message });
    }
  },

  // 📌 ELIMINAR una noticia por ID
  deleteNews: async (req, res) => {
    try {
      const { id } = req.params;
      await newsCollection.doc(id).delete();
      
      res.json({ message: 'Noticia eliminada exitosamente', id: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar noticia: ' + error.message });
    }
  }
};

module.exports = newsController;