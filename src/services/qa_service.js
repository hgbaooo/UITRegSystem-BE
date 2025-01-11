const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      'env',
      ['python3', path.join(__dirname, './qa_service_helper.py'), JSON.stringify({ question })],
      {
        cwd: path.join(__dirname, '..'),
      }
    );

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(resultData));
        } catch (e) {
          reject(new Error(`Python script returned invalid JSON: ${e.message} - raw data: ${resultData} `));
        }
      } else {
        reject(new Error(`Python script exited with code ${code} - details: ${errorData}`));
      }
    });
    pythonProcess.on('error', (err) => {
      reject(new Error(`Error spawning python process: ${err.message}`));
    });
  });
}

module.exports = { askQuestion };
