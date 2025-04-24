# Book Review Platform

A full-stack web application for book reviews and ratings, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Featured books display
- Book search and filtering
- Detailed book pages with reviews and ratings
- User profiles
- Review submission and management
- Responsive design

## Tech Stack

### Frontend
- React
- Redux for state management
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Database Seeding

The application comes with a sample dataset of books that can be loaded using the seed script. This includes:
- 10 popular books with cover images
- Sample ratings and reviews
- Various genres and authors

To seed the database:
```bash
cd server
npm run seed
```

To modify the sample data, edit the `server/utils/seedBooks.js` file.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
```

2. Install dependencies for both frontend and backend
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create environment variables
```bash
# In the server directory, create a .env file with:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# In the client directory, create a .env file with:
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development servers
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
npm start
```

The application should now be running on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

The application can be deployed using various platforms:
- Frontend: GitHub Pages, Netlify, or Vercel
- Backend: Heroku, DigitalOcean, or AWS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

