import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class GetProjectByIdUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectResponseDTO> {
    const project = await this.repository.findById(id);
    if (!project) throw new AppError("Project not found", 404);
    return toProjectResponseDTO(project);
  }
}
