const express = require('express');
const userController = require('../controllers/userController');
const { getPythonMessage } = require('../controllers/pythonController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/python-message', getPythonMessage);

module.exports = router;
