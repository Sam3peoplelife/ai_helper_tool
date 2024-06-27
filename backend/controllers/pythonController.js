const { runPythonScript } = require('../services/pythonService');

const getPythonMessage = async (req, res) => {
    try {
        const message = await runPythonScript();
        res.status(200).send({ message });
    } catch (error) {
        res.status(500).send({ error });
    }
};

module.exports = {
    getPythonMessage,
};