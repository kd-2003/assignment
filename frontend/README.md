# DevConnect Frontend

A modern React frontend for the DevConnect application - a platform where developers can showcase their projects, connect with other developers, and receive valuable feedback.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Project Management**: Create, edit, and showcase projects with rich details
- **User Profiles**: Complete user profiles with bio, location, and social links
- **Search Functionality**: Search for users and projects
- **Comments System**: Leave feedback on projects
- **Like System**: Like and unlike projects
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Icons**: Beautiful icon library
- **React Hot Toast**: Toast notifications
- **Custom CSS**: Tailwind-like utility classes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

The frontend is configured to proxy requests to the backend at `http://localhost:5000`. If your backend is running on a different port, update the `proxy` field in `package.json`.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation component
│   └── PrivateRoute.js # Protected route wrapper
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Profile.js      # User profile page
│   ├── Projects.js     # Projects listing
│   ├── ProjectDetail.js # Individual project view
│   ├── CreateProject.js # Create new project
│   ├── EditProject.js  # Edit existing project
│   ├── UserProfile.js  # View other user profiles
│   └── Search.js       # Search functionality
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (not recommended)

## API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects (with search/filter)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/:id/like` - Like/unlike project

### Comments
- `GET /api/comments/project/:projectId` - Get project comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/like` - Like/unlike comment

## Key Features Implementation

### Authentication Flow
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes
- User context management

### Project Management
- Rich project creation form
- Technology tags
- Image upload support
- GitHub and live demo links

### Search & Discovery
- Real-time search for users and projects
- Filter by project type
- User and project browsing

### Social Features
- Like/unlike projects
- Comment system
- User profiles
- Social media links

## Styling

The application uses custom CSS with utility classes similar to Tailwind CSS:

- **Utility Classes**: Spacing, colors, typography, layout
- **Component Classes**: Buttons, forms, cards, badges
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Loading spinners, toasts, avatars

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Netlify/Vercel

1. Push your code to GitHub
2. Connect your repository to Netlify or Vercel
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy!

### Environment Variables for Production

Set the following environment variables in your hosting platform:

- `REACT_APP_API_URL`: Your backend API URL (if different from proxy)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the DevConnect full-stack application.

## Support

For support, please refer to the main project README or create an issue in the repository. 