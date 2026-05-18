export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type ProjectCategory = "PROFESSIONAL" | "FREELANCE" | "PERSONAL";
export type MediaType = "IMAGE" | "VIDEO";

export interface Tool {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMedia {
  id: string;
  projectId: string;
  url: string;
  type: MediaType;
  order: number;
  originalName: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tools: Array<{ id: string; name: string }>;
  link: string | null;
  category: ProjectCategory;
  hasDetailsPage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithMedia extends Project {
  media: ProjectMedia[];
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  PROFESSIONAL: "Profissional",
  FREELANCE: "Freelance",
  PERSONAL: "Pessoal",
};

export const CATEGORY_ORDER: ProjectCategory[] = [
  "PROFESSIONAL",
  "FREELANCE",
  "PERSONAL",
];

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
