import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { sequelize } from "./config/database";

import auth_router from "./routes/auth.routes";
import user_router from "./routes/user.routes";
import properties_router from "./routes/properties.routes";

const app = express();
const PORT = process.env.TRUSTYPLOTS_PORT || 5000;

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
app.use("/auth", auth_router);
app.use("/users", user_router);
app.use("/properties", properties_router);

app.get("/health-check", (_, res) => {
  console.log('health-check: Trustyplots API working fine!');
  res.status(200).json({ status: "Trustyplots API working fine!" });
});

// Start Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // ⚠️ Never auto-sync in production
    // if (process.env.NODE_ENV !== "production") {
    //   await sequelize.sync();
    //   console.log("📦 Database synced");
    // }

    app.listen(PORT, () => {
      console.log(`🚀 Trustyplots API Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to connect to DB:", error);
    process.exit(1);
  }
}

startServer();

export default app;
