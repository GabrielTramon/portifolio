import { IToolRepository } from "../../domain/repositories/IToolRepository";
import { ToolResponseDTO, toToolResponseDTO } from "../dtos/ToolResponseDTO";

export class ListToolsUseCase {
  constructor(private readonly repository: IToolRepository) {}

  async execute(): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findAll();
    return tools.map(toToolResponseDTO);
  }
}
