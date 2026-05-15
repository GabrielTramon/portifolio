import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import projectRouter from "./modules/projects/presentation/routes/projectRoutes";
import { errorHandler } from "./shared/errors/errorHandler";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5000",
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Portfolio Backend API" });
});

app.use("/auth", authRouter);
app.use("/projects", projectRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
