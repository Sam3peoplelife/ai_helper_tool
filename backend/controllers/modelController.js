const ModelService = require('../services/modelService');

const ModelController = {
  trainModel: async (req, res) => {
    const { fileName } = req.body; // Assuming the file name is sent in the request body

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required.' });
    }

    try {
      const result = await ModelService.trainModel(fileName);
      console.log(result)
      res.status(200).json({ message: 'Model training successful.'});
    } catch (error) {
      console.error('Error while training model:', error);
      res.status(500).json({ message: 'Model training failed.', error: error.toString() });
    }
  }
};

module.exports = ModelController;
