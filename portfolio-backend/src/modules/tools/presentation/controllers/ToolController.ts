import { Request, Response, NextFunction } from "express";
import { CreateToolUseCase } from "../../application/use-cases/CreateToolUseCase";
import { ListToolsUseCase } from "../../application/use-cases/ListToolsUseCase";
import { GetToolByIdUseCase } from "../../application/use-cases/GetToolByIdUseCase";
import { UpdateToolUseCase } from "../../application/use-cases/UpdateToolUseCase";
import { DeleteToolUseCase } from "../../application/use-cases/DeleteToolUseCase";
import { validateToolName, validateUpdateTool } from "../validators/toolValidators";

export class ToolController {
  constructor(
    private readonly createToolUseCase: CreateToolUseCase,
    private readonly listToolsUseCase: ListToolsUseCase,
    private readonly getToolByIdUseCase: GetToolByIdUseCase,
    private readonly updateToolUseCase: UpdateToolUseCase,
    private readonly deleteToolUseCase: DeleteToolUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = validateToolName(req.body);
      const tool = await this.createToolUseCase.execute(name);
      res.status(201).json({ data: tool });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tools = await this.listToolsUseCase.execute();
      res.json({ data: tools });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const tool = await this.getToolByIdUseCase.execute(id);
      res.json({ data: tool });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const name = validateUpdateTool(req.body);
      const tool = await this.updateToolUseCase.execute(id, name);
      res.json({ data: tool });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      await this.deleteToolUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
