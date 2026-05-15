import { Router } from "express";
import { PrismaProjectRepository } from "../../infra/repositories/PrismaProjectRepository";
import { PrismaProjectMediaRepository } from "../../infra/repositories/PrismaProjectMediaRepository";
import { CreateProjectUseCase } from "../../application/use-cases/CreateProjectUseCase";
import { ListProjectsUseCase } from "../../application/use-cases/ListProjectsUseCase";
import { GetProjectByIdUseCase } from "../../application/use-cases/GetProjectByIdUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../application/use-cases/DeleteProjectUseCase";
import { ListProjectsWithDetailsPageUseCase } from "../../application/use-cases/ListProjectsWithDetailsPageUseCase";
import { ProjectController } from "../controllers/ProjectController";
import mediaRouter from "./projectMediaRoutes";

const router = Router();

const projectRepository = new PrismaProjectRepository();
const mediaRepository = new PrismaProjectMediaRepository();

const controller = new ProjectController(
  new CreateProjectUseCase(projectRepository),
  new ListProjectsUseCase(projectRepository),
  new GetProjectByIdUseCase(projectRepository, mediaRepository),
  new UpdateProjectUseCase(projectRepository),
  new DeleteProjectUseCase(projectRepository),
  new ListProjectsWithDetailsPageUseCase(projectRepository),
);

router.get("/with-details", (req, res, next) => controller.listWithDetailsPage(req, res, next));
router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.list(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.put("/:id", (req, res, next) => controller.update(req, res, next));
router.delete("/:id", (req, res, next) => controller.delete(req, res, next));
router.use("/:id/media", mediaRouter);

export default router;
