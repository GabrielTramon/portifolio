import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5000",
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Portfolio Backend API" });
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
