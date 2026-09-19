import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Financial Analytics API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
