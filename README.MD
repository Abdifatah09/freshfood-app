# Full-Stack FreshFood Application

This is a full-stack application for a fictional FreshFood marketplace that allows users to register, log in, create posts, and manage their accounts. It uses a React-based frontend and a Node.js backend with a PostgreSQL database.

## Features

- **User Authentication**: Sign up, login, and secure JWT token-based authentication.
- **Post Management**: Users can create, update, and delete posts.
- **Role-Based Access**: Different user roles (Buyer, Seller).
- **Responsive Design**: The app is fully responsive and works well on mobile and desktop devices.

## Technologies Used

### Frontend:
- React.js
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router for routing

### Backend:
- Node.js
- Express.js for API routes
- Sequelize ORM for database interaction
- PostgreSQL for database
- JWT for authentication

### Tools:
- Git for version control
- Postman for API testing

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdifatah09/freshfood-app.git
   cd freshfood-app

2. Navigate to the backend directory
   ```bash
   cd backend

3. Install backend dependencies
   ```bash
   npm install

4. Create a .env file in the backend directory with the following information
   ```bash
   DB_USER=
   DB_HOST=
   DB_DATABASE=
   DB_PASSWORD=
   DB_PORT=
   PORT=
   SECRET_KEY=

5. Run the server
   ```bash
   npm start

### Frontend Setup

1. Navigate to the frontend directory (make sure to open another terminal)
  ```bash
   cd frontend

2. Install frontend dependencies
   ```bash
   npm install

3. Run the frontend
   ```bash
   npm start

The frontend should now be running on http://localhost:3000.

## API Endpoints

### Authentication:
- `POST /api/register`: Register a new user.
- `POST /api/login`: Log in and get a JWT token.

### Posts:
- `POST /api/add-post`: Add a new post (requires authentication).
- `GET /api/view-post`: View posts by a user (requires authentication).
- `PATCH /api/edit-post/:id`: Edit a post (requires authentication).
- `DELETE /api/delete-post/:id`: Delete a post (requires authentication).

### Users:
- `GET /api/users`: Get a list of all users (requires authentication).
- `DELETE /api/delete/:id`: Delete a user (requires authentication).

---

## Contributing

1. Fork this repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name




