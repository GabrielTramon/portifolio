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
    !Array.isArray(data.languages) ||
    data.languages.length === 0 ||
    !data.languages.every((l) => typeof l === "string")
  ) {
    throw new AppError("languages must be a non-empty array of strings");
  }
  if (!data.link || typeof data.link !== "string" || !data.link.trim()) {
    throw new AppError("link is required");
  }
  if (!isValidCategory(data.category)) {
    throw new AppError(`category must be one of: ${validCategories.join(", ")}`);
  }

  return {
    name: data.name.trim(),
    description: data.description.trim(),
    languages: data.languages as string[],
    link: data.link.trim(),
    category: data.category,
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

  if (data.languages !== undefined) {
    if (
      !Array.isArray(data.languages) ||
      data.languages.length === 0 ||
      !data.languages.every((l) => typeof l === "string")
    ) {
      throw new AppError("languages must be a non-empty array of strings");
    }
    dto.languages = data.languages as string[];
  }

  if (data.link !== undefined) {
    if (typeof data.link !== "string" || !data.link.trim()) {
      throw new AppError("link must be a non-empty string");
    }
    dto.link = data.link.trim();
  }

  if (data.category !== undefined) {
    if (!isValidCategory(data.category)) {
      throw new AppError(`category must be one of: ${validCategories.join(", ")}`);
    }
    dto.category = data.category;
  }

  return dto;
}
