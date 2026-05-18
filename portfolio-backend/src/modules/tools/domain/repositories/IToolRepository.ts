import { Tool } from "../entities/Tool";

export interface CreateToolData {
  name: string;
}

export interface UpdateToolData {
  name?: string;
}

export interface IToolRepository {
  create(data: CreateToolData): Promise<Tool>;
  findAll(): Promise<Tool[]>;
  findById(id: string): Promise<Tool | null>;
  update(id: string, data: UpdateToolData): Promise<Tool>;
  delete(id: string): Promise<void>;
}
