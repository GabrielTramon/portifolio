import { Project } from "../entities/Project";
import { ProjectCategory } from "../enums/ProjectCategory";

export interface CreateProjectData {
  name: string;
  description: string;
  languages: string[];
  link: string;
  category: ProjectCategory;
  hasDetailsPage?: boolean;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  languages?: string[];
  link?: string;
  category?: ProjectCategory;
  hasDetailsPage?: boolean;
}

export interface IProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findWithDetailsPage(): Promise<Project[]>;
  update(id: string, data: UpdateProjectData): Promise<Project>;
  delete(id: string): Promise<void>;
}
