const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const modelController = require('../controllers/modelController')

const multer = require('multer');
const fileController = require('../controllers/fileController');

const upload = multer({ dest: 'uploads/' });


router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/train', modelController.trainModel);
router.post('/predict', modelController.predictModel);
router.post('/update', modelController.updateModel);

router.post('/uploadFile', upload.single('file'), fileController.uploadFile);
router.post('/listUserFiles', fileController.listUserFiles);
router.post('/downloadFile', fileController.downloadFile);


module.exports = router;

