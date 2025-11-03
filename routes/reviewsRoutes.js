const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// Rutas de reseñas
router.post('/', reviewsController.createReview);
router.get('/', reviewsController.getAllReviews);
router.get('/professional/:professionalId', reviewsController.getReviewsByProfessional);
router.get('/stats/:professionalId', reviewsController.getReviewStats);
router.get('/:id', reviewsController.getReviewById);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;