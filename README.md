# News Aggregator API

This project implements a RESTful API for a personalized news aggregator. It provides functionalities for user authentication, managing user preferences, and fetching news articles from an external API based on those preferences.

## Features

- **User Authentication:** Secure user registration and login using bcrypt for password hashing and JWT for token-based authentication.

- **User Preferences:** Allows authenticated users to set and retrieve their news preferences (e.g., categories, languages).

- **External API Integration:** Fetches news articles from the GNews API based on user-defined preferences.

- **Error Handling:** Robust error handling for API requests, authentication failures, and external service issues.

## Technologies Used

- Node.js

- Express.js

- MongoDB (via Mongoose ODM)

- bcryptjs (for password hashing)

- jsonwebtoken (for JWT authentication)

- axios (for external API calls)

- dotenv (for environment variable management)


### API Endpoints

All API endpoints are prefixed with /.
- #### User Authentication
  - **POST /users/signup**: Register a new user.

    - Request Body: `{ "name": "string", "email": "string", "password": "string" }`

    - Response: `{ "message": "User registered successfully!", "user": { "name": "string", "email": "string", "_id": "string", ... } }` (Status 200/201)

   - **POST /users/login**: Log in an existing user.

    - Request Body: `{ "email": "string", "password": "string" }`

    - Response: `{ "token": "string", "user": { "name": "string", "email": "string", ... } }` (Status 200)

- #### User Preferences

    - **GET /users/preferences**: Retrieve the logged-in user's news preferences.

      - Headers: Authorization: `Bearer <JWT_TOKEN>`

      - Response: `{ "preferences": ["string", "string"] }` (Status 200)

    - **PUT /users/preferences**: Update the logged-in user's news preferences.

        - Headers: Authorization: `Bearer <JWT_TOKEN>`

        - Request Body: `{ "preferences": ["string", "string"] }`

        - Response: `{ "message": "Preferences updated successfully!", "preferences": ["string", "string"] }` (Status 200)

- #### News Fetching

    - **GET /news**: Fetch news articles based on the logged-in user's preferences.

        - Headers: Authorization: `Bearer <JWT_TOKEN>`

        - Query Parameters (Optional): `q (search query), country (e.g., us, in), max (number of articles)`.

        - Response: `{ "message": "News articles fetched successfully!", "totalArticles": number, "news": [{ "title": "string", "description": "string", ... }] }` (Status 200)



