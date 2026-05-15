import { IProjectMediaRepository } from "../../domain/repositories/IProjectMediaRepository";
import { IStorageService } from "../../domain/services/IStorageService";
import { AppError } from "../../../../shared/errors/AppError";

export class RemoveProjectMediaUseCase {
  constructor(
    private readonly mediaRepository: IProjectMediaRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(mediaId: string): Promise<void> {
    const media = await this.mediaRepository.findById(mediaId);
    if (!media) throw new AppError("Media not found", 404);

    await this.storageService.delete(media.url);
    await this.mediaRepository.delete(mediaId);
  }
}
