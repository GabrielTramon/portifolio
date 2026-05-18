import { IToolRepository } from "../../domain/repositories/IToolRepository";
import { AppError } from "../../../../shared/errors/AppError";

export class DeleteToolUseCase {
  constructor(private readonly repository: IToolRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError("Tool not found", 404);
    await this.repository.delete(id);
  }
}
