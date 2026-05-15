import { ProjectMedia } from "../entities/ProjectMedia";
import { MediaType } from "../enums/MediaType";

export interface CreateMediaData {
  projectId: string;
  url: string;
  type: MediaType;
  order: number;
  originalName: string;
}

export interface MediaOrderItem {
  id: string;
  order: number;
}

export interface IProjectMediaRepository {
  create(data: CreateMediaData): Promise<ProjectMedia>;
  findByProjectId(projectId: string): Promise<ProjectMedia[]>;
  findById(id: string): Promise<ProjectMedia | null>;
  updateOrder(projectId: string, items: MediaOrderItem[]): Promise<ProjectMedia[]>;
  delete(id: string): Promise<void>;
  countByProjectId(projectId: string): Promise<number>;
}
