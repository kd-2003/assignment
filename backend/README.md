# DevConnect Backend API

A Node.js/Express backend for the DevConnect platform.

## Features

- User authentication (JWT)
- User profile management
- Project CRUD operations
- Comments and feedback system
- Search functionality
- Like/Unlike projects and comments

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (with optional search)
- `GET /api/users/:id` - Get user by ID with projects
- `PUT /api/users/profile` - Update user profile (protected)

### Projects
- `GET /api/projects` - Get all projects (with optional search/user filter)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `PUT /api/projects/:id/like` - Like/Unlike project (protected)

### Comments
- `GET /api/comments/project/:projectId` - Get comments for a project
- `POST /api/comments` - Add comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)
- `PUT /api/comments/:id/like` - Like/Unlike comment (protected)

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 5000) 