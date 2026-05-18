import { ProjectCategory } from "../../domain/enums/ProjectCategory";

export interface CreateProjectDTO {
  name: string;
  description: string;
  toolIds: string[];
  link?: string | null;
  category: ProjectCategory;
  hasDetailsPage?: boolean;
}
