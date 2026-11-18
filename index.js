
import "dotenv/config";




import express from 'express';

import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.port || 5000;


//middleware 

app.use(express.json());
app.use(cors());

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vyu58ag.mongodb.net/`);



export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
    const database = connectedClient .db("mentorlagbe");
    const users = database.collection("user");


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get ('/users',async (req,res) => {
  const cursor = users.find ({});
  const result = await cursor . toArray();
  res.send(result)
})



app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});















