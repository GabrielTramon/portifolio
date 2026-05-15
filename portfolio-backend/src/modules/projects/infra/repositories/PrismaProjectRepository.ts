import { prisma } from "../../../../lib/prisma";
import {
  IProjectRepository,
  CreateProjectData,
  UpdateProjectData,
} from "../../domain/repositories/IProjectRepository";
import { Project } from "../../domain/entities/Project";
import { ProjectCategory } from "../../domain/enums/ProjectCategory";
import { ProjectCategory as PrismaProjectCategory } from "../../../../generated/prisma/enums";

type PrismaProjectRecord = {
  id: string;
  name: string;
  description: string;
  languages: string[];
  link: string;
  category: PrismaProjectCategory;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaProjectRepository implements IProjectRepository {
  async create(data: CreateProjectData): Promise<Project> {
    const record = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        languages: data.languages,
        link: data.link,
        category: data.category as PrismaProjectCategory,
      },
    });
    return this.toDomain(record);
  }

  async findAll(): Promise<Project[]> {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Project | null> {
    const record = await prisma.project.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const record = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.languages !== undefined && { languages: data.languages }),
        ...(data.link !== undefined && { link: data.link }),
        ...(data.category !== undefined && {
          category: data.category as PrismaProjectCategory,
        }),
      },
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  private toDomain(record: PrismaProjectRecord): Project {
    return new Project(
      record.id,
      record.name,
      record.description,
      record.languages,
      record.link,
      record.category as unknown as ProjectCategory,
      record.createdAt,
      record.updatedAt,
    );
  }
}
