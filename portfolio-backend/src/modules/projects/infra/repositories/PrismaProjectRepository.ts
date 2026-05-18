import { prisma } from "../../../../lib/prisma";
import {
  IProjectRepository,
  CreateProjectData,
  UpdateProjectData,
} from "../../domain/repositories/IProjectRepository";
import { Project } from "../../domain/entities/Project";
import { ProjectCategory } from "../../domain/enums/ProjectCategory";
import { ProjectCategory as PrismaProjectCategory } from "../../../../generated/prisma/enums";

const include = { tools: true, media: false } as const;

type PrismaProjectRecord = {
  id: string;
  name: string;
  description: string;
  link: string | null;
  tools: Array<{ id: string; name: string }>;
  category: PrismaProjectCategory;
  hasDetailsPage: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaProjectRepository implements IProjectRepository {
  async create(data: CreateProjectData): Promise<Project> {
    const record = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        link: data.link ?? null,
        category: data.category as PrismaProjectCategory,
        hasDetailsPage: data.hasDetailsPage ?? false,
        tools: { connect: data.toolIds.map((id) => ({ id })) },
      },
      include,
    });
    return this.toDomain(record as PrismaProjectRecord);
  }

  async findAll(): Promise<Project[]> {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include,
    });
    return records.map((r: PrismaProjectRecord) => this.toDomain(r));
  }

  async findById(id: string): Promise<Project | null> {
    const record = await prisma.project.findUnique({ where: { id }, include });
    if (!record) return null;
    return this.toDomain(record as PrismaProjectRecord);
  }

  async findWithDetailsPage(): Promise<Project[]> {
    const records = await prisma.project.findMany({
      where: { hasDetailsPage: true },
      orderBy: { createdAt: "desc" },
      include,
    });
    return records.map((r: PrismaProjectRecord) => this.toDomain(r));
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const record = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.link !== undefined && { link: data.link }),
        ...(data.category !== undefined && { category: data.category as PrismaProjectCategory }),
        ...(data.hasDetailsPage !== undefined && { hasDetailsPage: data.hasDetailsPage }),
        ...(data.toolIds !== undefined && {
          tools: { set: data.toolIds.map((id) => ({ id })) },
        }),
      },
      include,
    });
    return this.toDomain(record as PrismaProjectRecord);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  private toDomain(record: PrismaProjectRecord): Project {
    return new Project(
      record.id,
      record.name,
      record.description,
      record.tools.map((t) => ({ id: t.id, name: t.name })),
      record.link,
      record.category as unknown as ProjectCategory,
      record.hasDetailsPage,
      record.createdAt,
      record.updatedAt,
    );
  }
}
