require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4nvaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // starting from here
    const roomsCollection = client
      .db("meeting-room-booking")
      .collection("rooms");
    const bookingsCollection = client
      .db("meeting-room-booking")
      .collection("bookings");
    const usersCollection = client
      .db("meeting-room-booking")
      .collection("users");

    // Get all rooms
    app.get("/rooms", async (req, res) => {
      try {
        const rooms = await roomsCollection.find().toArray();
        res.send(rooms);
      } catch (error) {
        res.status(500).send({ message: "Error fetching rooms", error });
      }
    });

    // Get room details
    app.get("/rooms/:id", async (req, res) => {
      const roomId = req.params.id;
      try {
        const query = {
          _id: new ObjectId(roomId),
        };
        const result = await roomsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching room details", error });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from meeting room booking server");
});

app.listen(port, () => {
  console.log(`meeting room booking server is running at port: ${port}`);
});
