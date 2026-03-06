
import express from "express";
import { usersCollection } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/users/:email", verifyToken, async (req, res) => {
  const email = req.params.email;


  if (req.user.email !== email) {
    return res.status(403).json({ message: "Forbidden access" });
  }

  const user = req.body;

  try {
    const result = await usersCollection.updateOne(
      { email },
      { $set: user },
      { upsert: true }
    );

    res.send(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/:email", verifyToken, async (req, res) => {
  const email = req.params.email;

  if (req.user.email !== email) {
    return res.status(403).json({ message: "Forbidden access" });
  }

  try {
    const result = await usersCollection.findOne(
      { email },
      { projection: { password: 0 } }
    );

    res.send(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/update-profile/:email", verifyToken, async (req, res) => {
  const email = req.params.email;

  if (req.user.email !== email) {
    return res.status(403).json({ message: "Forbidden access" });
  }

  const { name, image } = req.body;

  try {
    await usersCollection.updateOne(
      { email },
      { $set: { name, image } },
      { upsert: false }
    );

    const updatedUser = await usersCollection.findOne(
      { email },
      { projection: { password: 0 } }
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;