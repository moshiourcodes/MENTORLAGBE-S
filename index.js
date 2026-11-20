
// import "dotenv/config";




// import express from 'express';

// import cors from 'cors';
// import { MongoClient } from 'mongodb';

// const app = express();
// const port = process.env.port || 5000;


// //middleware 

// app.use(express.json());
// app.use(cors());

// const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vyu58ag.mongodb.net/`);



// export async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log("You successfully connected to MongoDB!");
//     return client;
//   } catch (err) {
//     console.dir(err);
//   }
// }

// const connectedClient = await connectToMongoDB();
//     const database = connectedClient .db("mentorlagbe");
//     const users = database.collection("user");


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.get ('/users',async (req,res) => {
//   const cursor = users.find ({});
//   const result = await cursor . toArray();
//   res.send(result)
// })



// app.listen(port, () => {
//   console.log(`Example app running on port ${port}`);
// });















import "dotenv/config";

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const client = new MongoClient(
  `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD)}@cluster0.vyu58ag.mongodb.net/`
);

let database;
let users;
let tuitions;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();

    console.log("Successfully connected to MongoDB!");

    database = client.db("mentorlagbe");

    users = database.collection("user");
    tuitions = database.collection("tuitions");

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Root route
app.get("/", (req, res) => {
  res.send("MentorLagbe Server is Running!");
});

// Get all users
app.get("/users", async (req, res) => {
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

// Get all tuition data - ONE API ROUTE
app.get("/api/tuitions", async (req, res) => {
  try {
    const result = await tuitions
      .find({})
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
      message: "Failed to fetch tuition data",
    });
  }
});

// Start server after database connection
async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`MentorLagbe server running on port ${port}`);
  });
}

startServer();

