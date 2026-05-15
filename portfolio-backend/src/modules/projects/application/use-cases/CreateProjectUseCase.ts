import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { CreateProjectDTO } from "../dtos/CreateProjectDTO";
import { ProjectResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(dto: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const project = await this.repository.create(dto);
    return toProjectResponseDTO(project);
  }
}
