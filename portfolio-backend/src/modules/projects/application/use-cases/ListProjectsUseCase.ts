import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";

export class ListProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(): Promise<ProjectResponseDTO[]> {
    const projects = await this.repository.findAll();
    return projects.map(toProjectResponseDTO);
  }
}
