// src/controllers/regulationController.js
const { getAnswerFromPython } = require('../services/regulation.service');

const predictAnswer = async (req, res) => {
    try {
        const question = req.body.question;
        const { answer, base } = await getAnswerFromPython(question);
        res.json({ answer, base });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

module.exports = { predictAnswer };
