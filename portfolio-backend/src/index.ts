import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import projectRouter from "./modules/projects/presentation/routes/projectRoutes";
import toolRouter from "./modules/tools/presentation/routes/toolRoutes";
import { errorHandler } from "./shared/errors/errorHandler";

const app = express();
const PORT = process.env.PORT || 3003;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5000")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "Portfolio Backend API" });
});

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/tools", toolRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
