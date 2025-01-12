const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    let pythonExecutable = 'python';
    if (process.env.NODE_ENV === 'production') {
      const which = spawn('which', ['python3']);
      let whichData = '';

      which.stdout.on('data', (data) => {
        whichData += data.toString();
      });

      which.on('close', (code) => {
        if (code === 0) {
          pythonExecutable = whichData.trim();
        }
        // Construct absolute path for python script
        const pythonScriptPath = path.resolve(__dirname, './qa_service_helper.py');
        const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, JSON.stringify({ question })], {
          cwd: path.join(__dirname, '..'), // Ensure the python process cwd is correct
          env: process.env,
        });
        let resultData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
          resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          errorData += data.toString();
        });

        pythonProcess.on('close', (exitCode) => {
          if (exitCode === 0) {
            try {
              resolve(JSON.parse(resultData));
            } catch (e) {
              reject(new Error(`Python script returned invalid JSON: ${e.message} - raw data: ${resultData} `));
            }
          } else {
            reject(
              new Error(`Python script exited with code ${exitCode} - details: ${errorData || 'No error message received'}`)
            );
          }
        });
        pythonProcess.on('error', (innerErr) => {
          reject(new Error(`Error spawning python process: ${innerErr.message}`));
        });
      });
      which.on('error', () => {
        const pythonScriptPath = path.resolve(__dirname, './qa_service_helper.py');
        const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, JSON.stringify({ question })], {
          cwd: path.join(__dirname, '..'), // Ensure the python process cwd is correct
          env: process.env,
        });
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
          } else if (errorData) {
            reject(new Error(`Python script exited with code ${code} - details: ${errorData}`));
          } else {
            reject(new Error(`Python script exited with code ${code} - details: No error message received`));
          }
        });
        pythonProcess.on('error', (err) => {
          reject(new Error(`Error spawning python process: ${err.message}`));
        });
      });
    } else {
      pythonExecutable = 'python';
      const pythonScriptPath = path.resolve(__dirname, './qa_service_helper.py');
      const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, JSON.stringify({ question })], {
        cwd: path.join(__dirname, '..'),
        env: process.env,
      });
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
        } else if (errorData) {
          reject(new Error(`Python script exited with code ${code} - details: ${errorData}`));
        } else {
          reject(new Error(`Python script exited with code ${code} - details: No error message received`));
        }
      });
      pythonProcess.on('error', (err) => {
        reject(new Error(`Error spawning python process: ${err.message}`));
      });
    }
  });
}

module.exports = { askQuestion };
