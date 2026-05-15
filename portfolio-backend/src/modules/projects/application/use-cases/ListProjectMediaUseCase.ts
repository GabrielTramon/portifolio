import { IProjectMediaRepository } from "../../domain/repositories/IProjectMediaRepository";
import { ProjectMediaResponseDTO, toProjectMediaResponseDTO } from "../dtos/ProjectMediaResponseDTO";

export class ListProjectMediaUseCase {
  constructor(private readonly mediaRepository: IProjectMediaRepository) {}

  async execute(projectId: string): Promise<ProjectMediaResponseDTO[]> {
    const media = await this.mediaRepository.findByProjectId(projectId);
    return media.map(toProjectMediaResponseDTO);
  }
}
