const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authToken');
const User = require('../models/userModels');

router.get('/preferences', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('preferences -_id');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ preferences: user.preferences || [] });
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        res.status(500).json({ message: 'Server error while fetching preferences.' });
    }
});
router.put('/preferences', authenticateToken, async (req, res) => {
    const { preferences } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(preferences)) {
        return res.status(400).json({ message: 'Invalid request body. Expected { preferences: ["item1", "item2"] }' });
    }


    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.preferences = preferences;

        await user.save();

        res.status(200).json({
            message: 'Preferences updated successfully!',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Server error while updating preferences.' });
    }
});

module.exports = router;
