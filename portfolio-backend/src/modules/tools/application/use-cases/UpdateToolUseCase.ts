import { IToolRepository } from "../../domain/repositories/IToolRepository";
import { ToolResponseDTO, toToolResponseDTO } from "../dtos/ToolResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class UpdateToolUseCase {
  constructor(private readonly repository: IToolRepository) {}

  async execute(id: string, name: string): Promise<ToolResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError("Tool not found", 404);
    const tool = await this.repository.update(id, { name });
    return toToolResponseDTO(tool);
  }
}
