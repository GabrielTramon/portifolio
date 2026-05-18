import { IToolRepository } from "../../domain/repositories/IToolRepository";
import { ToolResponseDTO, toToolResponseDTO } from "../dtos/ToolResponseDTO";

export class CreateToolUseCase {
  constructor(private readonly repository: IToolRepository) {}

  async execute(name: string): Promise<ToolResponseDTO> {
    const tool = await this.repository.create({ name });
    return toToolResponseDTO(tool);
  }
}
