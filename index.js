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

    // --- User ---
    // User dashboard: Fetch user-specific bookings
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      try {
        const bookings = await bookingsCollection
          .find({ userEmail: email })
          .toArray();
        res.send(bookings);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error fetching dashboard data", error });
      }
    });

    // Book a room
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      try {
        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error booking room", error });
      }
    });

    // --- Delete own booking ---
    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const { email } = req.query;

      try {
        const result = await bookingsCollection.deleteOne({
          _id: new ObjectId(id),
          userEmail: email,
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error deleting booking", error });
      }
    });

    // Manage bookings: Fetch all bookings (Admin view)
    // app.get("/admin/bookings", async (req, res) => {
    //   try {
    //     const bookings = await bookingsCollection.find().toArray();
    //     res.send(bookings);
    //   } catch (error) {
    //     res.status(500).send({ message: "Error fetching bookings", error });
    //   }
    // });
    // admin view with pagination
    app.get("/admin/bookings", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalBookings = await bookingsCollection.countDocuments();
        const bookings = await bookingsCollection
          .find()
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({
          bookings,
          totalPages: Math.ceil(totalBookings / limit),
          currentPage: page,
        });
      } catch (error) {
        res.status(500).send({ message: "Error fetching bookings", error });
      }
    });

    // admin
    // update booking status
    app.patch("/admin/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedStatus = {
        $set: req.body,
      };
      const result = await bookingsCollection.updateOne(filter, updatedStatus);
      res.send(result);
    });

    // admin
    // Delete any booking
    // app.delete("/admin/bookings/:id", async (req, res) => {
    //   const bookingId = req.params.id;
    //   try {
    //     const result = await bookingsCollection.deleteOne({
    //       _id: new ObjectId(bookingId),
    //     });
    //     res.send(result);
    //   } catch (error) {
    //     res.status(500).send({ message: "Error deleting booking", error });
    //   }
    // });

    // --- Admin ---
    // Manage rooms: Add a new room
    app.post("/admin/rooms", async (req, res) => {
      const room = req.body;
      try {
        const result = await roomsCollection.insertOne(room);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error adding room", error });
      }
    });

    // Update a room
    app.put("/admin/rooms/:roomId", async (req, res) => {
      const roomId = req.params.roomId;
      const updatedRoom = req.body;
      try {
        const result = await roomsCollection.updateOne(
          { _id: new ObjectId(roomId) },
          { $set: updatedRoom }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating room", error });
      }
    });

    // Delete a room
    app.delete("/admin/rooms/:roomId", async (req, res) => {
      const roomId = req.params.roomId;
      try {
        const result = await roomsCollection.deleteOne({
          _id: new ObjectId(roomId),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error deleting room", error });
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
