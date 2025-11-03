const { professionalsCollection, admin } = require('../config/firebase');

const professionalsController = {
  // 📌 CREAR un nuevo profesional
  createProfessional: async (req, res) => {
    try {
      const professionalData = {
        ...req.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await professionalsCollection.add(professionalData);
      
      res.status(201).json({
        id: docRef.id,
        message: 'Profesional creado exitosamente',
        data: professionalData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear profesional: ' + error.message });
    }
  },

  // 📌 OBTENER todos los profesionales
  getAllProfessionals: async (req, res) => {
    try {
      const snapshot = await professionalsCollection.get();
      const professionals = [];
      
      snapshot.forEach(doc => {
        professionals.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json(professionals);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener profesionales: ' + error.message });
    }
  },

  // 📌 OBTENER un profesional por ID
  getProfessionalById: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await professionalsCollection.doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: 'Profesional no encontrado' });
      }

      res.json({
        id: doc.id,
        ...doc.data()
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener profesional: ' + error.message });
    }
  },

  // 📌 ACTUALIZAR un profesional por ID
  updateProfessional: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await professionalsCollection.doc(id).update(updateData);
      
      res.json({
        message: 'Profesional actualizado exitosamente',
        id: id,
        data: updateData
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar profesional: ' + error.message });
    }
  },

  // 📌 ELIMINAR un profesional por ID
  deleteProfessional: async (req, res) => {
    try {
      const { id } = req.params;
      await professionalsCollection.doc(id).delete();
      
      res.json({ message: 'Profesional eliminado exitosamente', id: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar profesional: ' + error.message });
    }
  }
};

module.exports = professionalsController;