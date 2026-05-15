import { Project } from "../../domain/entities/Project";
import { ProjectCategory } from "../../domain/enums/ProjectCategory";

export interface ProjectResponseDTO {
  id: string;
  name: string;
  description: string;
  languages: string[];
  link: string;
  category: ProjectCategory;
  createdAt: Date;
  updatedAt: Date;
}

export function toProjectResponseDTO(project: Project): ProjectResponseDTO {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    languages: project.languages,
    link: project.link,
    category: project.category,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
