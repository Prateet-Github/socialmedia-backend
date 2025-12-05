# GeeksGram Backend 🚀

<div align="center">
  <h3>Robust RESTful API for GeeksGram Social Media Platform</h3>
  <p><strong>Secure • Scalable • Real-time</strong></p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [Socket.IO Events](#-socketio-events)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

GeeksGram Backend is a Node.js/Express-based RESTful API that powers the GeeksGram social media platform. It provides comprehensive features for user authentication, post management, real-time messaging, and social interactions.

**Frontend Repository**: [socialmedia-frontend](https://github.com/Prateet-Github/socialmedia-frontend)

**Live Application**: [geeksgram-by-prateet.vercel.app](https://geeksgram-by-prateet.vercel.app)

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based authentication with refresh tokens
- 👤 **User Management** - Registration, login, profile updates
- 📝 **Post Management** - Create, read, update, delete posts
- ❤️ **Social Interactions** - Like, comment, share functionality
- 💬 **Real-time Chat** - Socket.IO powered instant messaging
- 🔔 **Notifications** - Real-time notification system
- 📷 **Media Upload** - Image and file handling
- 🔍 **Search & Discovery** - Find users and content
- 🛡️ **Security** - Password hashing, CORS, rate limiting

### Technical Features
- RESTful API architecture
- Middleware-based request processing
- Error handling and validation
- Database modeling and relationships
- WebSocket integration for real-time features

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Real-time** | Socket.IO |
| **Security** | bcrypt, helmet, cors |
| **Validation** | express-validator |
| **File Upload** | Multer / Cloudinary |
| **Environment** | dotenv |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v4.4 or higher) - Local or Atlas
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Prateet-Github/socialmedia-backend.git
cd socialmedia-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/geeksgram
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/geeksgram

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Start the Server

**Development Mode (with nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRE` | JWT token expiration time | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `CLOUDINARY_*` | Cloudinary credentials for media | Optional |
| `SMTP_*` | Email service credentials | Optional |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| POST | `/auth/refresh` | Refresh access token | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/:id` | Get user profile | ✅ |
| PUT | `/users/:id` | Update user profile | ✅ |
| GET | `/users/search` | Search users | ✅ |
| POST | `/users/:id/follow` | Follow user | ✅ |
| DELETE | `/users/:id/follow` | Unfollow user | ✅ |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all posts (feed) | ✅ |
| GET | `/posts/:id` | Get single post | ✅ |
| POST | `/posts` | Create new post | ✅ |
| PUT | `/posts/:id` | Update post | ✅ |
| DELETE | `/posts/:id` | Delete post | ✅ |
| POST | `/posts/:id/like` | Like/unlike post | ✅ |
| POST | `/posts/:id/comment` | Add comment | ✅ |

### Request Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Create Post
```bash
POST /api/posts
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "content": "Hello GeeksGram! 🚀",
  "image": "image_url_here"
}
```

---

## 📁 Project Structure

```
socialmedia-backend/
├── configs/              # Configuration files
│   ├── database.js      # MongoDB connection setup
│   └── cloudinary.js    # Cloudinary configuration
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   └── commentController.js
├── middlewares/         # Custom middleware
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Error handling
│   └── validator.js    # Request validation
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   └── Notification.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── index.js
├── socket/             # Socket.IO logic
│   ├── socketHandler.js
│   └── events.js
├── .env                # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Dependencies
├── server.js          # Entry point
└── README.md          # Documentation
```

---

## 🗃️ Database Models

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  bio: String,
  avatar: String (URL),
  coverPhoto: String (URL),
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  author: ObjectId (ref: User, required),
  content: String (required),
  images: [String],
  likes: [ObjectId (ref: User)],
  comments: [ObjectId (ref: Comment)],
  shares: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  post: ObjectId (ref: Post, required),
  author: ObjectId (ref: User, required),
  content: String (required),
  likes: [ObjectId (ref: User)],
  createdAt: Date
}
```

---

## 🔌 Socket.IO Events

### Client → Server

| Event | Description | Payload |
|-------|-------------|---------|
| `join` | Join user room | `{ userId }` |
| `sendMessage` | Send chat message | `{ to, message }` |
| `typing` | User typing indicator | `{ to }` |
| `stopTyping` | Stop typing indicator | `{ to }` |

### Server → Client

| Event | Description | Payload |
|-------|-------------|---------|
| `message` | New message received | `{ from, message, timestamp }` |
| `notification` | New notification | `{ type, data }` |
| `userOnline` | User came online | `{ userId }` |
| `userOffline` | User went offline | `{ userId }` |

---

## 🚀 Deployment

### Deploy to Render

1. **Create account** on [Render](https://render.com)
2. **New Web Service** → Connect GitHub repo
3. **Set Environment Variables** in dashboard
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`

### Deploy to Railway

1. **Create account** on [Railway](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Add MongoDB** plugin
4. **Set Environment Variables**
5. Deploy automatically on push

### Deploy to Heroku

```bash
heroku create geeksgram-api
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set JWT_SECRET=<your_secret>
git push heroku main
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Write tests for new features

---

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/Prateet-Github/socialmedia-backend/issues) page to report bugs or request features.

**Bug Report Template:**
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prateet**
- GitHub: [@Prateet-Github](https://github.com/Prateet-Github)
- Frontend: [socialmedia-frontend](https://github.com/Prateet-Github/socialmedia-frontend)
- Backend: [socialmedia-backend](https://github.com/Prateet-Github/socialmedia-backend)

---

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB for the robust database
- Socket.IO for real-time capabilities
- All contributors and supporters

---

## 📞 Support

For support, please open an issue or contact through GitHub.

---

<div align="center">
  <p>⭐ If you like this project, please give it a star on GitHub! ⭐</p>
  <p>Made with ❤️ by Prateet</p>
</div>
