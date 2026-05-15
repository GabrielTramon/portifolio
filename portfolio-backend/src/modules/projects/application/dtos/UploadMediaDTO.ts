import { UploadableFile } from "../../domain/services/IStorageService";

export interface UploadMediaDTO {
  projectId: string;
  files: UploadableFile[];
}
