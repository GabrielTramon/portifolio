import { AppError } from "../../../../shared/errors/AppError";

export function validateToolName(body: unknown): string {
  const data = body as Record<string, unknown>;
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    throw new AppError("name is required");
  }
  return data.name.trim();
}

export function validateUpdateTool(body: unknown): string {
  const data = body as Record<string, unknown>;
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      throw new AppError("name must be a non-empty string");
    }
    return data.name.trim();
  }
  throw new AppError("name is required");
}
