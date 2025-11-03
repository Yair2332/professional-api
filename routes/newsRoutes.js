const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Rutas de noticias
router.post('/', newsController.createNews);
router.get('/', newsController.getAllNews);
router.get('/user/:userId', newsController.getNewsByUserId);
router.get('/:id', newsController.getNewsById);
router.put('/:id', newsController.updateNews);
router.put('/:id/like', newsController.likeNews);
router.put('/:id/unlike', newsController.unlikeNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;