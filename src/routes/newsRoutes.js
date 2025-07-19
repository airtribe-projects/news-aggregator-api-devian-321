const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authToken');
const { fetchNews } = require('../controllers/newsController');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const queryParams = {};

        const articles = await fetchNews(userId, queryParams);

        res.status(200).json({
            message: 'News articles fetched successfully!',
            totalArticles: articles.length,
            news: articles
        });
    } catch (error) {
        console.error('Error in /news route:', error.message);
        if (error.message.includes('User not found') || error.message.includes('preferences')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: `Failed to fetch news: ${error.message}` });
    }
});

module.exports = router;
