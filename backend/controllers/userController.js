const userService = require('../services/userService');
const modelService = require('../services/modelService');

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        await userService.registerUser(email, username, password);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Error signing up" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await userService.loginUser(username, password);
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(401).json({ error: error.message });
    }
};

const trainModel = async (req, res) => {
    try {
        const { username } = req.user;
        const { fileName } = req.body;
        const message = await modelService.trainModel(username, fileName);
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error in trainModel:", error);
        res.status(500).json({ error: error.message });
    }
};

const predictModel = async (req, res) => {
    try {
        const { username } = req.user;
        const { fileName } = req.body;
        const predictions = await modelService.predictModel(username, fileName);
        res.status(200).json({ predictions });
    } catch (error) {
        console.error("Error in predictModel:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateModel = async (req, res) => {
    try {
        const { username } = req.user;
        const { fileName } = req.body;
        const message = await modelService.updateModel(username, fileName);
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error in updateModel:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    trainModel,
    predictModel,
    updateModel
};
