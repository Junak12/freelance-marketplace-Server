import express from "express";
import { ObjectId } from "mongodb";
import { jobsCollection } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";



const router = express.Router();




router.get("/AllJobs", async (req, res) => {
  const result = await jobsCollection.find().toArray();
  res.send(result);
});


router.get("/AllJobs/:id", async (req, res) => {
  const id = req.params.id;
  const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
  res.send(job);
});


router.post("/addjobs", verifyToken, async (req, res) => {
  const jobs = req.body;
  jobs.userEmail = req.user.email;
  jobs.createAt = new Date();
  jobs.updateAt = new Date();

  const result = await jobsCollection.insertOne(jobs);
  res.send(result);
});

router.put("/AllJobs/:id/accept", verifyToken, async (req, res) => {
  const jobId = req.params.id;
  const { acceptedBy, status } = req.body;

  const filter = { _id: new ObjectId(jobId) };
  const doc = {
    $set: {
      acceptedBy,
      status,
      updateAt: new Date(),
    },
  };

  const result = await jobsCollection.updateOne(filter, doc);
  res.send(result);
});

router.get("/my-add-job/:email", verifyToken, async (req, res) => {

  if (req.user.email !== req.params.email)
    return res.status(403).json({ message: "Forbidden access" });

  const result = await jobsCollection
    .find({ userEmail: req.params.email })
    .sort({ createAt: -1 })
    .toArray();

  res.send(result);
});


router.get("/my-added-jobs/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.userEmail !== req.user.email)
    return res.status(403).json({ message: "Forbidden access" });

  res.send(job);
});


router.put("/my-added-jobs/:id/accept", verifyToken, async (req, res) => {
  const jobId = req.params.id;
  const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.userEmail !== req.user.email)
    return res.status(403).json({ message: "Forbidden access" });

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

router.delete("/my-added-jobs/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.userEmail !== req.user.email)
    return res.status(403).json({ message: "Forbidden access" });

  const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

export default router;