const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const downloadFromS3 = (bucketName, key, downloadPath) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    const fileStream = fs.createWriteStream(downloadPath);
    s3.getObject(params).createReadStream().pipe(fileStream);

    fileStream.on('close', () => resolve(downloadPath));
    fileStream.on('error', reject);
  });
};

const uploadToS3 = (filePath, bucketName, key) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const ModelService = {
  trainModel: (fileName) => {
    return new Promise((resolve, reject) => {
      const jsonFilePath = path.join(__dirname, '..', 'training_data', fileName);

      // Command to execute Python script
      const pythonProcess = spawn('python3', [path.join(__dirname, 'model.py'), jsonFilePath]);

      let stdoutData = '';
      let stderrData = '';

      // Collecting stdout from Python script
      pythonProcess.stdout.on('data', (data) => {
        const message = data.toString().trim();
        if (message.startsWith('Epoch') || message.includes('loss')) {
          // Ignore intermediate progress messages
          return;
        }
        stdoutData += message + '\n';  // Ensure newline characters are handled correctly
      });

      // Collecting stderr from Python script
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      // Python script execution completed
      pythonProcess.on('close', async (code) => {
        if (code === 0) {
          // Extract file path from stdout
          const modelFilePath = stdoutData.split('\n').find(line => line.startsWith('Model saved to')).split(' ').pop().trim();
          
          try {
            const s3Url = await uploadToS3(modelFilePath, process.env.AWS_BUCKET_NAME, path.basename(modelFilePath));
            fs.unlinkSync(modelFilePath);  // Clean up the local temp file
            resolve(`Model uploaded to S3: ${s3Url}`);
          } catch (error) {
            reject(`Model upload failed: ${error.message}`);
          }
        } else {
          // Model training failed
          const errorMessage = stderrData.trim() || `Model training failed with code ${code}.`;
          reject(errorMessage);
        }
      });
    });
  },

  predictSales: (modelFileName, jsonFileName) => {
    return new Promise(async (resolve, reject) => {
      const modelFilePath = path.join(__dirname, '..', 'tempModels');
      const jsonFilePath = path.join(__dirname, '..', 'input_data', jsonFileName);
      
      try {
        await downloadFromS3(process.env.AWS_BUCKET_NAME, modelFileName, modelFilePath);
      } catch (error) {
        return reject(`Model download failed: ${error.message}`);
      }

      const pythonProcess = spawn('python3', [path.join(__dirname, 'predict.py'), modelFilePath, jsonFilePath]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString().trim();  // Ensure newline characters are handled correctly
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          const resultFilePath = path.join(__dirname, '..', 'predictions', 'predictions.json');

          fs.readFile(resultFilePath, 'utf8', (err, data) => {
            if (err) {
              reject(`Failed to read predictions file: ${err.message}`);
            } else {
              fs.unlinkSync(resultFilePath);  // Clean up the predictions file
              resolve(JSON.parse(data));
            }
          });
        } else {
          const errorMessage = stderrData.trim() || `Prediction failed with code ${code}.`;
          reject(errorMessage);
        }
      });
    });
  }
};

module.exports = ModelService;
