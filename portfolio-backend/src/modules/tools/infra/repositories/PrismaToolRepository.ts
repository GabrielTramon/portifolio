import { prisma } from "../../../../lib/prisma";
import { IToolRepository, CreateToolData, UpdateToolData } from "../../domain/repositories/IToolRepository";
import { Tool } from "../../domain/entities/Tool";

type PrismaToolRecord = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaToolRepository implements IToolRepository {
  async create(data: CreateToolData): Promise<Tool> {
    const record = await prisma.tool.create({ data: { name: data.name } });
    return this.toDomain(record);
  }

  async findAll(): Promise<Tool[]> {
    const records = await prisma.tool.findMany({ orderBy: { createdAt: "asc" } });
    return records.map((r: PrismaToolRecord) => this.toDomain(r));
  }

  async findById(id: string): Promise<Tool | null> {
    const record = await prisma.tool.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async update(id: string, data: UpdateToolData): Promise<Tool> {
    const record = await prisma.tool.update({
      where: { id },
      data: { ...(data.name !== undefined && { name: data.name }) },
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.tool.delete({ where: { id } });
  }

  private toDomain(record: PrismaToolRecord): Tool {
    return new Tool(record.id, record.name, record.createdAt, record.updatedAt);
  }
}
