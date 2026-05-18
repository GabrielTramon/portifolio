import { ProjectCategory } from "../enums/ProjectCategory";

export class Project {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly tools: Array<{ id: string; name: string }>,
    public readonly link: string | null,
    public readonly category: ProjectCategory,
    public readonly hasDetailsPage: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
