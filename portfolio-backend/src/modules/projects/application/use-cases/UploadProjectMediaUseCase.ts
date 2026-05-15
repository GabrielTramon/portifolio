import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { IProjectMediaRepository } from "../../domain/repositories/IProjectMediaRepository";
import { IStorageService } from "../../domain/services/IStorageService";
import { MediaType } from "../../domain/enums/MediaType";
import { UploadMediaDTO } from "../dtos/UploadMediaDTO";
import { ProjectMediaResponseDTO, toProjectMediaResponseDTO } from "../dtos/ProjectMediaResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

const MAX_MEDIA_PER_PROJECT = 6;

export class UploadProjectMediaUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly mediaRepository: IProjectMediaRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(dto: UploadMediaDTO): Promise<ProjectMediaResponseDTO[]> {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) throw new AppError("Project not found", 404);

    const existingCount = await this.mediaRepository.countByProjectId(dto.projectId);

    if (existingCount + dto.files.length > MAX_MEDIA_PER_PROJECT) {
      throw new AppError(
        `Upload excede o limite. Projeto tem ${existingCount} mídias, máximo é ${MAX_MEDIA_PER_PROJECT}.`,
        400,
      );
    }

    const isFirstUpload = existingCount === 0;
    const batchHasImage = dto.files.some((f) => f.mimetype.startsWith("image/"));

    if (isFirstUpload && !batchHasImage) {
      throw new AppError("O primeiro upload deve conter pelo menos 1 imagem.", 400);
    }

    const uploaded: ProjectMediaResponseDTO[] = [];
    let nextOrder = existingCount;

    for (const file of dto.files) {
      const stored = await this.storageService.upload(
        file,
        `projects/${dto.projectId}`,
      );

      const media = await this.mediaRepository.create({
        projectId: dto.projectId,
        url: stored.url,
        type: file.mimetype.startsWith("video/") ? MediaType.VIDEO : MediaType.IMAGE,
        order: nextOrder,
        originalName: file.originalname,
      });

      uploaded.push(toProjectMediaResponseDTO(media));
      nextOrder++;
    }

    return uploaded;
  }
}
