import { MediaOrderItem } from "../../domain/repositories/IProjectMediaRepository";

export interface UpdateMediaOrderDTO {
  projectId: string;
  order: MediaOrderItem[];
}
