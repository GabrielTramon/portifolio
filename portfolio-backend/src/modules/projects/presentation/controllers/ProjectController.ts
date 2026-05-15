import { Request, Response, NextFunction } from "express";
import { CreateProjectUseCase } from "../../application/use-cases/CreateProjectUseCase";
import { ListProjectsUseCase } from "../../application/use-cases/ListProjectsUseCase";
import { GetProjectByIdUseCase } from "../../application/use-cases/GetProjectByIdUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../application/use-cases/DeleteProjectUseCase";
import { ListProjectsWithDetailsPageUseCase } from "../../application/use-cases/ListProjectsWithDetailsPageUseCase";
import { validateCreateProject, validateUpdateProject } from "../validators/projectValidators";

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly listProjectsWithDetailsPageUseCase: ListProjectsWithDetailsPageUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = validateCreateProject(req.body);
      const project = await this.createProjectUseCase.execute(dto);
      res.status(201).json({ data: project });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await this.listProjectsUseCase.execute();
      res.json({ data: projects });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const project = await this.getProjectByIdUseCase.execute(id);
      res.json({ data: project });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const dto = validateUpdateProject(req.body);
      const project = await this.updateProjectUseCase.execute(id, dto);
      res.json({ data: project });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      await this.deleteProjectUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listWithDetailsPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await this.listProjectsWithDetailsPageUseCase.execute();
      res.json({ data: projects });
    } catch (error) {
      next(error);
    }
  }
}
