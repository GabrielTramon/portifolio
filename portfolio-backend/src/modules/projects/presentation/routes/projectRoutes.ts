import { Router } from "express";
import { PrismaProjectRepository } from "../../infra/repositories/PrismaProjectRepository";
import { CreateProjectUseCase } from "../../application/use-cases/CreateProjectUseCase";
import { ListProjectsUseCase } from "../../application/use-cases/ListProjectsUseCase";
import { GetProjectByIdUseCase } from "../../application/use-cases/GetProjectByIdUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../application/use-cases/DeleteProjectUseCase";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();

const repository = new PrismaProjectRepository();

const controller = new ProjectController(
  new CreateProjectUseCase(repository),
  new ListProjectsUseCase(repository),
  new GetProjectByIdUseCase(repository),
  new UpdateProjectUseCase(repository),
  new DeleteProjectUseCase(repository),
);

router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.list(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.put("/:id", (req, res, next) => controller.update(req, res, next));
router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

export default router;
