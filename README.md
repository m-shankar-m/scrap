# Scrap Project

This project is a full-stack application consisting of a Node.js backend (`scrap-backend`) and a React frontend (`scrap-user`). This repository contains the backend service.

## Features

- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
- **Password Encryption**: Passwords are encrypted using `bcryptjs` before being stored.
- **Scrap Price Management**: API endpoints to create, update, and retrieve prices for scrap materials.
- **Protected Routes**: Middleware to protect sensitive endpoints, ensuring only authenticated users can access them.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Environment Variables**: `dotenv`
- **Dependencies**:
  - `cors` for handling Cross-Origin Resource Sharing
  - `bcryptjs` for password hashing

## Setup Instructions

Follow the instructions below to get the backend running locally.

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the backend directory**:
    ```sh
    cd scrap-backend
    ```

3.  **Install dependencies**:
    ```sh
    npm install
    ```

4.  **Create an environment file**:
    Create a `.env` file in the `scrap-backend` directory and add the following variables. Replace the placeholder values with your own.
    ```env
    # Port for the server to run on
    PORT=5000

    # Your MongoDB connection string
    MONGO_URI=mongodb://localhost:27017/scrap_db

    # A secret key for signing JWTs
    JWT_SECRET=your_jwt_secret_key
    ```

5.  **Run the backend server**:
    ```sh
    npm start
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

## API Usage (Endpoints)

The following are the primary API endpoints available:

### Authentication

- **Register a new user**
  - **Route**: `POST /api/users/register`
  - **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - **Access**: Public

- **Login a user**
  - **Route**: `POST /api/users/login`
  - **Body**: `{ "email": "john@example.com", "password": "password123" }`
  - **Access**: Public
  - **Returns**: A JWT token for authenticating subsequent requests.

### Scrap Prices

- **Get all scrap prices**
  - **Route**: `GET /api/prices`
  - **Access**: Public

- **Add or update a scrap price**
  - **Route**: `POST /api/prices`
  - **Access**: Private (Requires authentication token)
  - **Headers**: `{ "Authorization": "Bearer <YOUR_JWT_TOKEN>" }`
  - **Body**: `{ "material": "Copper", "price": "3.50" }`
