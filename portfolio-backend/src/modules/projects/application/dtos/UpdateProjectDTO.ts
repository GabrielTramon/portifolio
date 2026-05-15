import { ProjectCategory } from "../../domain/enums/ProjectCategory";

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  languages?: string[];
  link?: string;
  category?: ProjectCategory;
  hasDetailsPage?: boolean;
}
