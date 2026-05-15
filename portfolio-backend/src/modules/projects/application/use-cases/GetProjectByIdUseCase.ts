import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { IProjectMediaRepository } from "../../domain/repositories/IProjectMediaRepository";
import { ProjectWithMediaResponseDTO, toProjectResponseDTO } from "../dtos/ProjectResponseDTO";
import { toProjectMediaResponseDTO } from "../dtos/ProjectMediaResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class GetProjectByIdUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly mediaRepository: IProjectMediaRepository,
  ) {}

  async execute(id: string): Promise<ProjectWithMediaResponseDTO> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new AppError("Project not found", 404);

    const media = await this.mediaRepository.findByProjectId(id);

    return {
      ...toProjectResponseDTO(project),
      media: media.map(toProjectMediaResponseDTO),
    };
  }
}
