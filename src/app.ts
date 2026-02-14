import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { sequelize } from "./config/database";
import userRoutes from "./routes/user";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (important if behind Nginx / AWS Load Balancer)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS (restrict in production)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

// Start Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // ⚠️ Never auto-sync in production
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
      console.log("📦 Database synced");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown (important for PM2)
    const shutdown = async () => {
      console.log("🛑 Shutting down gracefully...");
      await sequelize.close();
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Unable to connect to DB:", error);
    process.exit(1);
  }
}

startServer();

export default app;
