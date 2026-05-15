import fs from "fs/promises";
import path from "path";
import { IStorageService, UploadableFile, StorageResult } from "../../domain/services/IStorageService";

export class LocalStorageService implements IStorageService {
  private readonly baseDir = path.resolve(process.cwd(), "uploads");
  private readonly baseUrl = "/uploads";

  async upload(file: UploadableFile, folder: string): Promise<StorageResult> {
    const dir = path.join(this.baseDir, folder);
    await fs.mkdir(dir, { recursive: true });

    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(dir, uniqueName);

    await fs.writeFile(filepath, file.buffer);

    return {
      url: `${this.baseUrl}/${folder}/${uniqueName}`,
      originalName: file.originalname,
    };
  }

  async delete(url: string): Promise<void> {
    const relativePath = url.replace(/^\/uploads\//, "");
    const filepath = path.join(this.baseDir, relativePath);
    try {
      await fs.unlink(filepath);
    } catch {
      // arquivo pode não existir
    }
  }
}
