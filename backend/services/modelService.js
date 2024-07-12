const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/fileController');

const ModelService = {
  trainModel: async (username, fileName) => {
    try {
      const downloadPath = path.join(__dirname, '..', username, 'training_data', 'filename');
      const modelFilePath = path.join(__dirname, '..', username, 'model', `${username}_model.h5`);

      await fileController.downloadFile({ body: { username, type: 'training_data', filename: fileName } });

      if (!fs.existsSync(downloadPath)) {
        throw new Error(`Downloaded file ${downloadPath} does not exist.`);
      }

      const pythonProcess = spawn('python3', [path.join(__dirname, 'model.py'), downloadPath, modelFilePath]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        const message = data.toString().trim();
        if (!message.startsWith('Epoch') && !message.includes('loss')) {
          stdoutData += message + '\n';
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      return new Promise((resolve, reject) => {
        pythonProcess.on('close', async (code) => {
          fs.unlinkSync(downloadPath);

          if (code === 0) {
            const trainFilePath = stdoutData.split('\n').find(line => line.startsWith('Model saved to')).split(' ').pop().trim();
            //console.log(trainFilePath)
            try {
              await fileController.uploadToS3(trainFilePath, process.env.AWS_BUCKET_NAME, `${username}/model/${username}_model.h5`);
              fs.unlinkSync(trainFilePath);
              resolve(`Model uploaded to S3`);
            } catch (error) {
              reject(`Model upload failed: ${error.message}`);
            }
          } else {
            reject(stderrData.trim() || `Model training failed with code ${code}.`);
          }
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  predictModel: async (username, fileName) => {
    try {
      const downloadPath = path.join(__dirname, '..', username, 'predict_data', 'filename');
      const modelFilePath = path.join(__dirname, '..', username, 'model', `${username}_model.h5`);
      const pychache = path.join(__dirname, '__pycache__')

      await fileController.downloadFile({ body: { username, type: 'predict_data', filename: fileName } });
      await fileController.downloadFile({ body: { username, type: 'model', filename: `${username}_model.h5` } });

      const pythonProcess = spawn('python3', [path.join(__dirname, 'predict.py'), modelFilePath, downloadPath]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      return new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          fs.unlinkSync(downloadPath);
          fs.unlinkSync(modelFilePath);

          if (code === 0) {
            const predictionsFilePath = stdoutData.split('\n').find(line => line.startsWith('Predictions saved to')).split(' ').pop().trim();
            
            fs.readFile(predictionsFilePath, (err, data) => {
              if (err) {
                reject(`Error reading predictions file: ${err.message}`);
              } else {
                const predictions = JSON.parse(data);
                fs.unlinkSync(predictionsFilePath);
                resolve(predictions);
              }
            });
          } else {
            reject(stderrData.trim() || `Prediction failed with code ${code}.`);
          }
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateModel: async (username, fileName) => {
    try {
      const downloadPath = path.join(__dirname, '..', username, 'update_data', 'filename');
      const modelFilePath = path.join(__dirname, '..', username, 'model', `${username}_model.h5`);

      await fileController.downloadFile({ body: { username, type: 'update_data', filename: fileName } });
      await fileController.downloadFile({ body: { username, type: 'model', filename: `${username}_model.h5` } });

      const pythonProcess = spawn('python3', [path.join(__dirname, 'update_model.py'), modelFilePath, downloadPath]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      return new Promise((resolve, reject) => {
        pythonProcess.on('close', async (code) => {
          fs.unlinkSync(downloadPath);
          fs.unlinkSync(modelFilePath);

          if (code === 0) {
            const updatedModelFilePath = stdoutData.split('\n').find(line => line.startsWith('Updated model saved to')).split(' ').pop().trim();

            try {
              await fileController.uploadToS3(updatedModelFilePath, process.env.AWS_BUCKET_NAME, `${username}/model/${username}_model.h5`);
              fs.unlinkSync(updatedModelFilePath);
              resolve(`Updated model uploaded to S3`);
            } catch (error) {
              reject(`Updated model upload failed: ${error.message}`);
            }
          } else {
            reject(stderrData.trim() || `Model update failed with code ${code}.`);
          }
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = ModelService;
