import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { AppError } from "../../../../shared/errors/AppError";

export class DeleteProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new AppError("Project not found", 404);

    await this.repository.delete(id);
  }
}
