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
      res.status(200).json({ message: 'Model training successful.', s3Url: result });
    } catch (error) {
      console.error('Error while training model:', error);
      res.status(500).json({ message: 'Model training failed.', error: error.toString() });
    }
  },

  predictSales: async (req, res) => {
    const { modelFileName, jsonFileName } = req.body; // Assuming the file names are sent in the request body

    if (!modelFileName || !jsonFileName) {
      return res.status(400).json({ message: 'Model file name and JSON file name are required.' });
    }

    try {
      const result = await ModelService.predictSales(modelFileName, jsonFileName);
      res.status(200).json({ message: 'Prediction successful.', predictions: result });
    } catch (error) {
      console.error('Error while making predictions:', error);
      res.status(500).json({ message: 'Prediction failed.', error: error.toString() });
    }
  }
};

module.exports = ModelController;
