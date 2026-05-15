import { ProjectCategory } from "../../domain/enums/ProjectCategory";

export interface CreateProjectDTO {
  name: string;
  description: string;
  languages: string[];
  link: string;
  category: ProjectCategory;
  hasDetailsPage?: boolean;
}
