const axios = require('axios');
const User = require('../models/userModels');

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

if (!GNEWS_API_KEY) {
    console.error('FATAL ERROR: GNEWS_API_KEY is not defined in .env. News fetching will fail.');
}

const GNEWS_BASE_URL = 'https://gnews.io/api/v4/top-headlines';

const fetchNews = async (userId, queryParams = {}) => {
    try {
        const user = await User.findById(userId).select('preferences');
        if (!user) {
            throw new Error('User not found. Cannot fetch preferences.');
        }
        const userPreferences = user.preferences;
        const params = {
            token: GNEWS_API_KEY,
            topic: userPreferences && userPreferences.length > 0 ? userPreferences[0] : 'general',
            lang: 'en',
            max: 10,
            ...queryParams
        };
        if (queryParams.q) {
            delete params.topic;
        }

        const response = await axios.get(GNEWS_BASE_URL, { params });

        return response.data.articles || [];

    } catch (error) {
        console.error('Error fetching news from GNews API:', error.message);

        if (error.response) {
            console.error('GNews API response error data:', error.response.data);
            console.error('GNews API response status:', error.response.status);
            console.error('GNews API response headers:', error.response.headers);
            throw new Error(`External News API error: ${error.response.status} - ${error.response.data.errors ? error.response.data.errors[0].message : error.response.statusText}`);
        } else if (error.request) {
            console.error('GNews API request error:', error.request);
            throw new Error('No response received from external News API. Check network connection or API endpoint.');
        } else {
            console.error('Error setting up GNews API request:', error.message);
            throw new Error(`Error setting up news API request: ${error.message}`);
        }
    }
};

module.exports = { fetchNews };
