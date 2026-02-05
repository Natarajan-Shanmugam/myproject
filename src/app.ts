import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "API running 🚀" });
});

export default app;
