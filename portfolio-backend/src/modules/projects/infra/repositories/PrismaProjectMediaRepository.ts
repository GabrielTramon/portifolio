import { prisma } from "../../../../lib/prisma";
import {
  IProjectMediaRepository,
  CreateMediaData,
  MediaOrderItem,
} from "../../domain/repositories/IProjectMediaRepository";
import { ProjectMedia } from "../../domain/entities/ProjectMedia";
import { MediaType } from "../../domain/enums/MediaType";
import { MediaType as PrismaMediaType } from "../../../../generated/prisma/enums";

type PrismaMediaRecord = {
  id: string;
  projectId: string;
  url: string;
  type: PrismaMediaType;
  order: number;
  originalName: string;
  createdAt: Date;
};

export class PrismaProjectMediaRepository implements IProjectMediaRepository {
  async create(data: CreateMediaData): Promise<ProjectMedia> {
    const record = await prisma.projectMedia.create({
      data: {
        projectId: data.projectId,
        url: data.url,
        type: data.type as PrismaMediaType,
        order: data.order,
        originalName: data.originalName,
      },
    });
    return this.toDomain(record);
  }

  async findByProjectId(projectId: string): Promise<ProjectMedia[]> {
    const records = await prisma.projectMedia.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<ProjectMedia | null> {
    const record = await prisma.projectMedia.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async updateOrder(projectId: string, items: MediaOrderItem[]): Promise<ProjectMedia[]> {
    await prisma.$transaction(
      items.map(({ id, order }) =>
        prisma.projectMedia.update({ where: { id }, data: { order } }),
      ),
    );
    return this.findByProjectId(projectId);
  }

  async delete(id: string): Promise<void> {
    await prisma.projectMedia.delete({ where: { id } });
  }

  async countByProjectId(projectId: string): Promise<number> {
    return prisma.projectMedia.count({ where: { projectId } });
  }

  private toDomain(record: PrismaMediaRecord): ProjectMedia {
    return new ProjectMedia(
      record.id,
      record.projectId,
      record.url,
      record.type as unknown as MediaType,
      record.order,
      record.originalName,
      record.createdAt,
    );
  }
}
