const express = require('express');
const userController = require('../controllers/userController');
const modelController = require('../controllers/modelController'); // Import model controller

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/train-model', modelController.trainModel); // Route for model training
router.post('/predict-model', modelController.predictModel); // Route for making predictions
router.post('/update-model', modelController.updateModel); //Route for updating model

module.exports = router;
