import express from "express";
import { ObjectId } from "mongodb";
import { jobsCollection } from "../config/db.js";

const router = express.Router();

router.get("/AllJobs", async (req, res) => {
  const result = await jobsCollection.find().toArray();
  res.send(result);
});

router.post("/addjobs", async (req, res) => {
  const jobs = req.body;
  const result = await jobsCollection.insertOne(jobs);
  res.send(result);
});

router.put("/AllJobs/:id/accept", async (req, res) => {
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

router.get("/AllJobs/:id", async (req, res) => {
  const id = req.params.id;

  const job = await jobsCollection.findOne({
    _id: new ObjectId(id),
  });

  res.send(job);
});

router.get("/my-add-job/:email", async (req, res) => {
  const email = req.params.email;

  const result = await jobsCollection
    .find({ userEmail: email })
    .sort({ createAt: -1 })
    .toArray();

  res.send(result);
});

router.delete("/my-added-jobs/:id", async (req, res) => {
  const { id } = req.params;

  const result = await jobsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

router.get("/my-added-jobs/:id", async (req, res) => {
  const { id } = req.params;

  const job = await jobsCollection.findOne({
    _id: new ObjectId(id),
  });

  res.send(job);
});

router.put("/my-added-jobs/:id/accept", async (req, res) => {
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

export default router;