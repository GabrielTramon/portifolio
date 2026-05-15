import { ProjectMedia } from "../../domain/entities/ProjectMedia";
import { MediaType } from "../../domain/enums/MediaType";

export interface ProjectMediaResponseDTO {
  id: string;
  projectId: string;
  url: string;
  type: MediaType;
  order: number;
  originalName: string;
  createdAt: string;
}

export function toProjectMediaResponseDTO(media: ProjectMedia): ProjectMediaResponseDTO {
  return {
    id: media.id,
    projectId: media.projectId,
    url: media.url,
    type: media.type,
    order: media.order,
    originalName: media.originalName,
    createdAt: media.createdAt.toISOString(),
  };
}
