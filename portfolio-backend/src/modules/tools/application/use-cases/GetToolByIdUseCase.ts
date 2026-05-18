import { IToolRepository } from "../../domain/repositories/IToolRepository";
import { ToolResponseDTO, toToolResponseDTO } from "../dtos/ToolResponseDTO";
import { AppError } from "../../../../shared/errors/AppError";

export class GetToolByIdUseCase {
  constructor(private readonly repository: IToolRepository) {}

  async execute(id: string): Promise<ToolResponseDTO> {
    const tool = await this.repository.findById(id);
    if (!tool) throw new AppError("Tool not found", 404);
    return toToolResponseDTO(tool);
  }
}
