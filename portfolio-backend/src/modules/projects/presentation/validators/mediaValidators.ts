import { AppError } from "../../../../shared/errors/AppError";
import { MediaOrderItem } from "../../domain/repositories/IProjectMediaRepository";
import { UpdateMediaOrderDTO } from "../../application/dtos/UpdateMediaOrderDTO";

export function validateUploadFiles(files: Express.Multer.File[]): void {
  if (!files || files.length === 0) {
    throw new AppError("Pelo menos 1 arquivo é obrigatório.");
  }
}

export function validateUpdateMediaOrder(
  projectId: string,
  body: unknown,
): UpdateMediaOrderDTO {
  const data = body as Record<string, unknown>;

  if (!Array.isArray(data.order) || data.order.length === 0) {
    throw new AppError("order deve ser um array não vazio.");
  }

  for (const item of data.order as unknown[]) {
    const entry = item as Record<string, unknown>;
    if (typeof entry.id !== "string" || typeof entry.order !== "number" || entry.order < 0) {
      throw new AppError("Cada item de order deve ter id (string) e order (number >= 0).");
    }
  }

  return {
    projectId,
    order: data.order as MediaOrderItem[],
  };
}
