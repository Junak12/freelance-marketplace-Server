import express from "express";
import cors from "cors";

import jobsRoutes from "./routes/jobs.routes.js";
import usersRoutes from "./routes/users.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", jobsRoutes);
app.use("/", usersRoutes);
app.use("/", reviewsRoutes);
app.use("/", tasksRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;