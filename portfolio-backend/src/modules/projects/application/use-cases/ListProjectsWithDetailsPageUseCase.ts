import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";

export class ListProjectsWithDetailsPageUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(): Promise<ProjectResponseDTO[]> {
    const projects = await this.repository.findWithDetailsPage();
    return projects.map(toProjectResponseDTO);
  }
}
