import { ProjectCategory } from "../../domain/enums/ProjectCategory";

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  toolIds?: string[];
  link?: string | null;
  category?: ProjectCategory;
  hasDetailsPage?: boolean;
}
