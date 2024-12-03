const { spawn } = require('child_process');

const getAnswerFromPython = (question) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      'D:\\Documents\\UniversityDocuments\\HocKi5\\DA1\\BE\\TrainingModel\\venv\\Scripts\\python.exe',
      ['src/models/predict.py', question]
    );

    pythonProcess.stdout.on('data', (data) => {
      try {
        const output = JSON.parse(data.toString().trim());
        resolve(output);
      } catch (error) {
        reject(new Error('Error parsing JSON from Python output.'));
      }
    });

    pythonProcess.stderr.on('data', () => {
      reject(new Error('Error occurred while processing the prediction.'));
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });

    pythonProcess.on('error', () => {
      reject(new Error('Failed to start Python process.'));
    });
  });
};

module.exports = { getAnswerFromPython };
