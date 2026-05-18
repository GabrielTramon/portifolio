import { Project } from "../../domain/entities/Project";
import { ProjectCategory } from "../../domain/enums/ProjectCategory";
import { ProjectMediaResponseDTO } from "./ProjectMediaResponseDTO";

export interface ProjectResponseDTO {
  id: string;
  name: string;
  description: string;
  tools: Array<{ id: string; name: string }>;
  link: string | null;
  category: ProjectCategory;
  hasDetailsPage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithMediaResponseDTO extends ProjectResponseDTO {
  media: ProjectMediaResponseDTO[];
}

export function toProjectResponseDTO(project: Project): ProjectResponseDTO {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    tools: project.tools,
    link: project.link,
    category: project.category,
    hasDetailsPage: project.hasDetailsPage,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
