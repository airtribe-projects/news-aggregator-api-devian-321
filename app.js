require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { logger } = require('./src/middlewares/consoleLogger');

// Import route modules
const authRouter = require('./src/routes/authRoutes');
const preferencesRouter = require('./src/routes/preferencesRoutes');
const newsRouter = require('./src/routes/newsRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);


app.use("/users", authRouter);

app.use("/users", preferencesRouter);

app.use("/news", newsRouter);

app.get('/', (req, res) => {
    res.send('Heyoo to my news app! API is running.');
});

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_DB_URL;

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        app.listen(port, (err) => {
            if (err) {
                console.error('Something bad happened when starting the server:', err);
                return;
            }
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

module.exports = app;
