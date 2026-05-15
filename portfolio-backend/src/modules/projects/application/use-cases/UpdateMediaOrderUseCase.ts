import { IProjectMediaRepository } from "../../domain/repositories/IProjectMediaRepository";
import { UpdateMediaOrderDTO } from "../dtos/UpdateMediaOrderDTO";
import { ProjectMediaResponseDTO, toProjectMediaResponseDTO } from "../dtos/ProjectMediaResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class UpdateMediaOrderUseCase {
  constructor(private readonly mediaRepository: IProjectMediaRepository) {}

  async execute(dto: UpdateMediaOrderDTO): Promise<ProjectMediaResponseDTO[]> {
    const existing = await this.mediaRepository.findByProjectId(dto.projectId);
    const existingIds = new Set(existing.map((m) => m.id));

    for (const item of dto.order) {
      if (!existingIds.has(item.id)) {
        throw new AppError(`Mídia ${item.id} não pertence a este projeto.`, 400);
      }
    }

    const updated = await this.mediaRepository.updateOrder(dto.projectId, dto.order);
    return updated.map(toProjectMediaResponseDTO);
  }
}
