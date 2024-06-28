const { spawn } = require('child_process');
const path = require('path');

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
        stdoutData += message + '\n';
      });

      // Collecting stderr from Python script
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      // Python script execution completed
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          // Model training succeeded
          resolve(stdoutData.trim() || 'Model training completed successfully.');
        } else {
          // Model training failed
          const errorMessage = stderrData.trim() || `Model training failed with code ${code}.`;
          reject(errorMessage);
        }
      });
    });
  }
};

module.exports = ModelService;

