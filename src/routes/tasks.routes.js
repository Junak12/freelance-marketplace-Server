import express from "express";
import { ObjectId } from "mongodb";
import { myTaskCollection } from "../config/db.js";

const router = express.Router();

router.post("/my-task-collection", async (req, res) => {
  const taskDetails = req.body;

  const result = await myTaskCollection.insertOne(taskDetails);

  res.send(result);
});

router.get("/my-task-collection/:email", async (req, res) => {
  const email = req.params.email;

  const result = await myTaskCollection
    .find({
      freelancerEmail: email,
    })
    .toArray();

  res.send(result);
});

router.delete("/my-task/:id", async (req, res) => {
  const id = req.params.id;

  const result = await myTaskCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

export default router;