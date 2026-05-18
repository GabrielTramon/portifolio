import { Tool } from "../../domain/entities/Tool";

export interface ToolResponseDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toToolResponseDTO(tool: Tool): ToolResponseDTO {
  return {
    id: tool.id,
    name: tool.name,
    createdAt: tool.createdAt,
    updatedAt: tool.updatedAt,
  };
}
