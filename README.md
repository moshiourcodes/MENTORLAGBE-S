# MentorLagbe – Backend Server

**MentorLagbe Backend API** is the server-side application powering MentorLagbe, a tuition marketplace platform that connects students with qualified tutors. It provides RESTful APIs, MongoDB database integration, and secure authentication support for managing tuition-related data.

## 🚀 Project Overview

The backend handles communication between the MentorLagbe frontend and MongoDB. It provides API endpoints for retrieving tuition listings and user information, with support for authentication and role-based access control.

## 🛠️ Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **MongoDB** – NoSQL database
- **MongoDB Node.js Driver** – Database connectivity
- **JWT** – Token-based API authentication
- **Better Auth** – Authentication and identity management
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management

## ✨ Key Features

- RESTful API architecture
- MongoDB database integration
- Student, Tutor, and Admin role support
- JWT-based API authentication
- Protected API access
- Tuition listing retrieval
- User data management
- Application and bookmark data storage
- CORS configuration for frontend communication
- Environment-based configuration
- Secure backend configuration practices

## 📁 Database Collections

The backend uses the `mentorlagbe` MongoDB database.

| Collection | Purpose |
|---|---|
| `user` | Stores user information |
| `tuitions` | Stores tuition listings |
| `applications` | Stores tuition application records |
| `bookmarks` | Stores saved tuition records |

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd MentorLagbe-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

FRONTEND_URL=http://localhost:3000

JWT_ISSUER=http://localhost:3000
JWT_AUDIENCE=mentorlagbe-express
```

Replace the placeholder database credentials with your actual MongoDB credentials.

### 5. Start the Backend Server

```bash
node index.js
```

The backend API runs locally on:

```text
http://localhost:5000
```

## 🔗 Available API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check server status |
| GET | `/users` | Retrieve user records |
| GET | `/api/tuitions` | Retrieve approved and active tuition listings |

### Example API Request

```http
GET http://localhost:5000/api/tuitions
```

## 🔐 Authentication and Security

MentorLagbe uses Better Auth for user authentication and JWT for secure communication with the separate Express backend.

Security features include:

- JWT signature verification
- Token expiration validation
- Issuer and audience validation
- Role-based authorization
- Protected backend endpoints
- Environment-based secret management

Never expose database credentials, authentication secrets, or private API keys in frontend code or public repositories.

## 🔗 Frontend Integration

The backend is designed to communicate with the MentorLagbe frontend application.

**Frontend API URL:**

```text
http://localhost:5000
```

Configure the frontend API base URL using:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🧪 Development

To run the backend locally:

```bash
node index.js
```

Make sure MongoDB is accessible and the required environment variables are configured.

## 👨‍💻 Project

**MentorLagbe – Tuition Marketplace Platform**

Backend developed as part of the MentorLagbe project.

---

*Connecting students with the right tutors through technology.*
