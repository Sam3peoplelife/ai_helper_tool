const express = require('express');
const userController = require('../controllers/userController');
const modelController = require('../controllers/modelController'); // Import model controller

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/train-model', modelController.trainModel); // Route for model training
router.post('/predict-model', modelController.predict); // Route for making predictions

module.exports = router;
