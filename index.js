import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { MongoClient, ServerApiVersion } from'mongodb'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vzxrz2j.mongodb.net/?appName=Cluster0`


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const myDB = client.db('myDB');
    const jobsCollection = myDB.collection("AllJobs");
    const usersCollection = myDB.collection("Users");


    app.get('/AllJobs', async(req, res) => {
        const result = await jobsCollection.find().toArray();
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(PORT, () => {
    console.log(`Server is on ${PORT}`);
    
})


