import express from "express";
import { reviewsCollections } from "../config/db.js";

const router = express.Router();

router.post("/reviews", async (req, res) => {
  const review = req.body;

  const result = await reviewsCollections.insertOne(review);

  res.send(result);
});

router.get("/getTopReviews", async (req, res) => {
  const topReviews = await reviewsCollections.find({}).toArray();

  res.send(topReviews);
});

export default router;