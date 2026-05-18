import { ProjectCategory } from "../../domain/enums/ProjectCategory";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateProjectDTO } from "../../application/dtos/CreateProjectDTO";
import { UpdateProjectDTO } from "../../application/dtos/UpdateProjectDTO";

const validCategories = Object.values(ProjectCategory);

function isValidCategory(value: unknown): value is ProjectCategory {
  return validCategories.includes(value as ProjectCategory);
}

export function validateCreateProject(body: unknown): CreateProjectDTO {
  const data = body as Record<string, unknown>;

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    throw new AppError("name is required");
  }
  if (!data.description || typeof data.description !== "string" || !data.description.trim()) {
    throw new AppError("description is required");
  }
  if (
    !Array.isArray(data.toolIds) ||
    !data.toolIds.every((id) => typeof id === "string")
  ) {
    throw new AppError("toolIds must be an array of strings");
  }
  if (!isValidCategory(data.category)) {
    throw new AppError(`category must be one of: ${validCategories.join(", ")}`);
  }
  if (data.link !== undefined && data.link !== null && typeof data.link !== "string") {
    throw new AppError("link must be a string or null");
  }
  if (data.hasDetailsPage !== undefined && typeof data.hasDetailsPage !== "boolean") {
    throw new AppError("hasDetailsPage must be boolean");
  }

  return {
    name: data.name.trim(),
    description: data.description.trim(),
    toolIds: data.toolIds as string[],
    link: data.link ? String(data.link).trim() || null : null,
    category: data.category,
    hasDetailsPage: typeof data.hasDetailsPage === "boolean" ? data.hasDetailsPage : false,
  };
}

export function validateUpdateProject(body: unknown): UpdateProjectDTO {
  const data = body as Record<string, unknown>;
  const dto: UpdateProjectDTO = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      throw new AppError("name must be a non-empty string");
    }
    dto.name = data.name.trim();
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string" || !data.description.trim()) {
      throw new AppError("description must be a non-empty string");
    }
    dto.description = data.description.trim();
  }

  if (data.toolIds !== undefined) {
    if (
      !Array.isArray(data.toolIds) ||
      !data.toolIds.every((id) => typeof id === "string")
    ) {
      throw new AppError("toolIds must be an array of strings");
    }
    dto.toolIds = data.toolIds as string[];
  }

  if (data.link !== undefined) {
    dto.link = data.link ? String(data.link).trim() || null : null;
  }

  if (data.category !== undefined) {
    if (!isValidCategory(data.category)) {
      throw new AppError(`category must be one of: ${validCategories.join(", ")}`);
    }
    dto.category = data.category;
  }

  if (data.hasDetailsPage !== undefined) {
    if (typeof data.hasDetailsPage !== "boolean") {
      throw new AppError("hasDetailsPage must be boolean");
    }
    dto.hasDetailsPage = data.hasDetailsPage;
  }

  return dto;
}
