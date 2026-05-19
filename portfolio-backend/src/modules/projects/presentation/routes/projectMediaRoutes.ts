import { Router } from "express";
import { PrismaProjectRepository } from "../../infra/repositories/PrismaProjectRepository";
import { PrismaProjectMediaRepository } from "../../infra/repositories/PrismaProjectMediaRepository";
import { CloudinaryStorageService } from "../../infra/services/CloudinaryStorageService";
import { UploadProjectMediaUseCase } from "../../application/use-cases/UploadProjectMediaUseCase";
import { ListProjectMediaUseCase } from "../../application/use-cases/ListProjectMediaUseCase";
import { RemoveProjectMediaUseCase } from "../../application/use-cases/RemoveProjectMediaUseCase";
import { UpdateMediaOrderUseCase } from "../../application/use-cases/UpdateMediaOrderUseCase";
import { ProjectMediaController } from "../controllers/ProjectMediaController";
import { uploadFiles } from "../middlewares/uploadMiddleware";

const router = Router({ mergeParams: true });

const projectRepository = new PrismaProjectRepository();
const mediaRepository = new PrismaProjectMediaRepository();
const storageService = new CloudinaryStorageService();

const controller = new ProjectMediaController(
  new UploadProjectMediaUseCase(projectRepository, mediaRepository, storageService),
  new ListProjectMediaUseCase(mediaRepository),
  new RemoveProjectMediaUseCase(mediaRepository, storageService),
  new UpdateMediaOrderUseCase(mediaRepository),
);

router.post("/", uploadFiles, (req, res, next) => controller.upload(req, res, next));
router.get("/", (req, res, next) => controller.list(req, res, next));
router.patch("/order", (req, res, next) => controller.updateOrder(req, res, next));
router.delete("/:mediaId", (req, res, next) => controller.remove(req, res, next));

export default router;
