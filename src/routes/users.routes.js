import express from "express";
import { usersCollection } from "../config/db.js";

const router = express.Router();

router.put("/users/:email", async (req, res) => {
  const email = req.params.email;
  const user = req.body;

  const result = await usersCollection.updateOne(
    { email: email },
    { $set: user },
    { upsert: true }
  );

  res.send(result);
});

router.get("/users/:email", async (req, res) => {
  const email = req.params.email;

  const result = await usersCollection.findOne(
    { email: email },
    { projection: { password: 0 } }
  );

  res.send(result);
});

router.put("/update-profile/:email", async (req, res) => {
  const email = req.params.email;

  const { name, image } = req.body;

  const result = await usersCollection.updateOne(
    { email },
    { $set: { name, image } },
    { upsert: false }
  );

  const updatedUser = await usersCollection.findOne({ email });

  res.status(200).send(updatedUser);
});

export default router;