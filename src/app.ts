import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import {sequelize} from "./config/database";
import userRoutes from "./routes/user";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "API running 🚀" });
});

// DB connection
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync(); // Sync models

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

startServer();

export default app;
