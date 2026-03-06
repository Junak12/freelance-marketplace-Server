
import express from "express";
import { ObjectId } from "mongodb";
import { myTaskCollection } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/my-task-collection", verifyToken, async (req, res) => {
  const taskDetails = req.body;
  taskDetails.freelancerEmail = req.user.email;
  taskDetails.createAt = new Date();
  taskDetails.updateAt = new Date();

  try {
    const result = await myTaskCollection.insertOne(taskDetails);
    res.send(result);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/my-task-collection/:email", verifyToken, async (req, res) => {
  const email = req.params.email;


  if (req.user.email !== email) {
    return res.status(403).json({ message: "Forbidden access" });
  }

  try {
    const result = await myTaskCollection
      .find({ freelancerEmail: email })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/my-task/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const task = await myTaskCollection.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.freelancerEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    const result = await myTaskCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;