import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vzxrz2j.mongodb.net/?appName=Cluster0`;

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
    await client.connect();
    const myDB = client.db("myDB");
    const jobsCollection = myDB.collection("AllJobs");
    const usersCollection = myDB.collection("Users");
    const reviewsCollections = myDB.collection("reviws");
    const myTaskCollection = myDB.collection("MyCollection");

    app.get("/AllJobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    app.post("/addjobs", async (req, res) => {
      const jobs = req.body;
      const result = await jobsCollection.insertOne(jobs);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollections.insertOne(review);
      res.send(result);
    });

    app.get("/getTopReviews", async (req, res) => {
      const topReviews = await reviewsCollections.find({}).toArray();
      res.send(topReviews);
    });

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const result = await usersCollection.updateOne(
        { email: email },
        { $set: user },
        { upsert: true },
      );

      res.send(result);
    });

    app.post("/my-task-collection", async (req, res) => {
      const taskDetails = req.body;
      const result = await myTaskCollection.insertOne(taskDetails);
      res.send(result);
    });

    app.put("/AllJobs/:id/accept", async (req, res) => {
      const jobId = req.params.id;
      const { acceptedBy, status } = req.body;
      const filter = { _id: new ObjectId(jobId) };
      const job = await jobsCollection.findOne(filter);
      const doc = {
        $set: {
          acceptedBy: acceptedBy,
          status: status,
          updateAt: new Date(),
        },
      };
      const result = await jobsCollection.updateOne(filter, doc);
      res.send(result);
    });

    app.get("/my-task-collection/:email", async (req, res) => {
      const email = req.params.email;
      const result = await myTaskCollection
        .find({
          freelancerEmail: email,
        })
        .toArray();
      res.send(result);
    });

    app.get("/my-add-job/:email", async (req, res) => {
      const email = req.params.email;
      const result = await jobsCollection
        .find({
          userEmail: email,
        })
        .sort({ createAt: -1 })
        .toArray();
      res.send(result);
    });

    app.delete("/my-added-jobs/:id", async (req, res) => {
      const { id } = req.params;
      const result = await jobsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/AllJobs/:id", async (req, res) => {
      const id = req.params.id;

      const job = await jobsCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(job);
    });

    app.get("/my-added-jobs/:id", async (req, res) => {
        const { id } = req.params;
        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
        res.send(job);
      
    });

    app.put("/my-added-jobs/:id/accept", async (req, res) => {
      const jobId = req.params.id;
      const {
        title,
        category,
        budget,
        status,
        summary,
        coverImage,
        currency,
        deadline,
        taskDescription,
      } = req.body;

      const filter = { _id: new ObjectId(jobId) };
      const updateDoc = {
        $set: {
          title,
          category,
          budget: Number(budget),
          status,
          summary,
          coverImage,
          currency,
          deadline: new Date(deadline),
          taskDescription,
          updateAt: new Date(),
        },
      };

      const result = await jobsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne(
        { email: email },
        { projection: { password: 0 } },
      );
      res.send(result);
    });

    app.put("/update-profile/:email", async (req, res) => {
      const email = req.params.email;
      const { name, image } = req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { name, image } },
        { upsert: false },
      );
      const updatedUser = await usersCollection.findOne({ email });
      res.status(200).send(updatedUser);
    });


    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
