
import express from "express";
import { reviewsCollections } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

router.post("/reviews", verifyToken, async (req, res) => {
  const review = req.body;
  review.userEmail = req.user.email; 
  review.createAt = new Date();      

  try {
    const result = await reviewsCollections.insertOne(review);
    res.send(result);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/getTopReviews", async (req, res) => {
  try {
    const topReviews = await reviewsCollections.find({}).toArray();
    res.send(topReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;