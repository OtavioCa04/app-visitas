const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Todas as rotas precisam de autenticação
router.use(auth);

// Rotas
router.get('/', visitaController.list);
router.post('/', upload.single('foto'), visitaController.create);
router.get('/:id', visitaController.getById);

module.exports = router;