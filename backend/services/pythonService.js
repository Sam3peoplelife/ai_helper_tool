const { exec } = require('child_process');

const runPythonScript = () => {
    return new Promise((resolve, reject) => {
        exec('python3 main.py', (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${error.message}`);
            }
            if (stderr) {
                return reject(`Stderr: ${stderr}`);
            }
            resolve(stdout.trim());
        });
    });
};

module.exports = {
    runPythonScript,
};