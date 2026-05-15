export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type ProjectCategory = "PROFESSIONAL" | "FREELANCE" | "PERSONAL";

export interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];
  link: string;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
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
