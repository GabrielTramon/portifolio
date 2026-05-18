import { Router } from "express";
import { PrismaToolRepository } from "../../infra/repositories/PrismaToolRepository";
import { CreateToolUseCase } from "../../application/use-cases/CreateToolUseCase";
import { ListToolsUseCase } from "../../application/use-cases/ListToolsUseCase";
import { GetToolByIdUseCase } from "../../application/use-cases/GetToolByIdUseCase";
import { UpdateToolUseCase } from "../../application/use-cases/UpdateToolUseCase";
import { DeleteToolUseCase } from "../../application/use-cases/DeleteToolUseCase";
import { ToolController } from "../controllers/ToolController";

const router = Router();

const toolRepository = new PrismaToolRepository();

const controller = new ToolController(
  new CreateToolUseCase(toolRepository),
  new ListToolsUseCase(toolRepository),
  new GetToolByIdUseCase(toolRepository),
  new UpdateToolUseCase(toolRepository),
  new DeleteToolUseCase(toolRepository),
);

router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.list(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.put("/:id", (req, res, next) => controller.update(req, res, next));
router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

export default router;
