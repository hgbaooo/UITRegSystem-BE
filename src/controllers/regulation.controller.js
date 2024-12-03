// src/controllers/regulationController.js
const { getAnswerFromPython } = require('../services/regulation.service');

const predictAnswer = async (req, res) => {
  try {
    const { answer, base } = await getAnswerFromPython(req.body.question);
    res.json({ answer, base });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { predictAnswer };
