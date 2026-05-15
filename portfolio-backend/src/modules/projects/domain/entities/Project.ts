import { ProjectCategory } from "../enums/ProjectCategory";

export class Project {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly languages: string[],
    public readonly link: string,
    public readonly category: ProjectCategory,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
