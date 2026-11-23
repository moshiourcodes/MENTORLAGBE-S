import "dotenv/config";

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

import { optionalAuth, requireAuth } from "./middleware/auth.js";
import { requireAdmin } from "./middleware/roles.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// A single FRONTEND_URL is supported for local dev; production deployments may
// provide a comma-separated list of exact origins.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser requests (curl, server-to-server) have no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

// MongoDB connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER or DB_PASSWORD is missing from .env");
}

const mongoURI = `mongodb+srv://${encodeURIComponent(
  dbUser
)}:${encodeURIComponent(
  dbPassword
)}@cluster0.vyu58ag.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(mongoURI);

// Database and collections
let database;
let users;
let tuitions;
let applications;
let bookmarks;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();

    console.log("Successfully connected to MongoDB!");

    database = client.db("mentorlagbe");

    // Collections
    users = database.collection("user");
    tuitions = database.collection("tuitions");
    applications = database.collection("applications");
    bookmarks = database.collection("bookmarks");

    // Unique index: one application per student per tuition
    await applications.createIndex(
      {
        tuitionId: 1,
        studentId: 1,
      },
      {
        unique: true,
        name: "unique_student_tuition_application",
      }
    );

    // Unique index: one bookmark per student per tuition
    await bookmarks.createIndex(
      {
        studentId: 1,
        tuitionId: 1,
      },
      {
        unique: true,
        name: "unique_student_tuition_bookmark",
      }
    );

    console.log("Connected to mentorlagbe database.");
    console.log("Users collection is ready.");
    console.log("Tuitions collection is ready.");
    console.log("Applications collection is ready.");
    console.log("Bookmarks collection is ready.");
    console.log("Unique application index created successfully.");
    console.log("Unique bookmark index created successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Connect once per process/container. Vercel imports this module on each cold
// start, so the promise is module-scoped rather than tied to app.listen().
const connectionReady = connectToMongoDB();
connectionReady.catch(() => undefined);

app.use(async (_req, _res, next) => {
  try {
    await connectionReady;
    next();
  } catch (error) {
    next(error);
  }
});

// Root route
app.get("/", (req, res) => {
  res.status(200).send("MentorLagbe Server is Running!");
});


// verified JWT, never from the client.
app.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await users.find({}).toArray();

    res.status(200).json({
      success: true,
      total: result.length,
      users: result,
    });
  } catch (error) {
    console.error("Users API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// Public: approved and active tuition listings. A valid token is optional
// and only attaches req.auth for future personalisation.
app.get("/api/tuitions", optionalAuth, async (req, res) => {
  try {
    const result = await tuitions
      .find({
        approvalStatus: "approved",
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      total: result.length,
      tuitions: result,
    });
  } catch (error) {
    console.error("Tuition API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch approved tuition data",
    });
  }
});

// Start server after database connection
async function startServer() {
  try {
    await connectionReady;

    const server = app.listen(port, () => {
      console.log(`MentorLagbe server running on port ${port}`);
      console.log(`Tuition API: http://localhost:${port}/api/tuitions`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down MentorLagbe server...");

      server.close(async () => {
        try {
          await client.close();
          console.log("MongoDB connection closed.");
          process.exit(0);
        } catch (error) {
          console.error("Error closing MongoDB:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Server startup error:", error);

    await client.close().catch(() => { });
    process.exit(1);
  }
}

// On Vercel the exported app is invoked by the serverless runtime. Do not
// call listen() there — there is no persistent process to bind a port.
const isServerless = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

if (!isServerless) {
  startServer().catch((error) => {
    console.error("Server startup error:", error);
    process.exit(1);
  });
}

export default app;