const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/usersController");

router.post('/signup', async (req, res) => {
    try {
        const user = req.body;
        const dbUser = await registerUser(user);
        const { password, ...userWithoutPassword } = dbUser.toObject();
        return res.status(200).json({ message: 'User registered successfully!', user: userWithoutPassword });
    } catch (error) {
        if (error.code === 11000) {

            return res.status(200).json({ message: 'User already registered.', user: { email: req.body.email } });
        }
        if (error.message === 'Please enter all fields') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await loginUser(email, password);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'User not found' || error.message === 'Invalid credentials') {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;
