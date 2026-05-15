import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { UpdateProjectDTO } from "../dtos/UpdateProjectDTO";
import { ProjectResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDTO): Promise<ProjectResponseDTO> {
    const exists = await this.repository.findById(id);
    if (!exists) throw new AppError("Project not found", 404);

    const project = await this.repository.update(id, dto);
    return toProjectResponseDTO(project);
  }
}
