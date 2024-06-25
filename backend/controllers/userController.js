const userService = require('../services/userService');

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        await userService.registerUser(email, username, password);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error signing up" });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await userService.loginUser(username, password);
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
};
