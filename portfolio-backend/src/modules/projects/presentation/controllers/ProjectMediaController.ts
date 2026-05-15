import { Request, Response, NextFunction } from "express";
import { UploadProjectMediaUseCase } from "../../application/use-cases/UploadProjectMediaUseCase";
import { ListProjectMediaUseCase } from "../../application/use-cases/ListProjectMediaUseCase";
import { RemoveProjectMediaUseCase } from "../../application/use-cases/RemoveProjectMediaUseCase";
import { UpdateMediaOrderUseCase } from "../../application/use-cases/UpdateMediaOrderUseCase";
import { validateUploadFiles, validateUpdateMediaOrder } from "../validators/mediaValidators";

export class ProjectMediaController {
  constructor(
    private readonly uploadProjectMediaUseCase: UploadProjectMediaUseCase,
    private readonly listProjectMediaUseCase: ListProjectMediaUseCase,
    private readonly removeProjectMediaUseCase: RemoveProjectMediaUseCase,
    private readonly updateMediaOrderUseCase: UpdateMediaOrderUseCase,
  ) {}

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const files = req.files as Express.Multer.File[];
      validateUploadFiles(files);

      const media = await this.uploadProjectMediaUseCase.execute({
        projectId: id,
        files,
      });
      res.status(201).json({ data: media });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const media = await this.listProjectMediaUseCase.execute(id);
      res.json({ data: media });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { mediaId } = req.params as { mediaId: string };
      await this.removeProjectMediaUseCase.execute(mediaId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const dto = validateUpdateMediaOrder(id, req.body);
      const media = await this.updateMediaOrderUseCase.execute(dto);
      res.json({ data: media });
    } catch (error) {
      next(error);
    }
  }
}
