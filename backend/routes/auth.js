const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

//rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

//rotas protegidas
router.get('/me', auth, authController.me);
router.put('/me', auth, authController.updateMe);

module.exports = router;