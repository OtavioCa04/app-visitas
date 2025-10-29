const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

//todas as rotas precisam de autenticação
router.use(auth);

//rotas de emails
router.get('/emails', userController.listEmails);
router.post('/emails', userController.addEmail);
router.delete('/emails/:email', userController.removeEmail);

module.exports = router;