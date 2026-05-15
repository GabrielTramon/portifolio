import { MediaType } from "../enums/MediaType";

export class ProjectMedia {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly url: string,
    public readonly type: MediaType,
    public readonly order: number,
    public readonly originalName: string,
    public readonly createdAt: Date,
  ) {}
}
