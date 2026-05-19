import { v2 as cloudinary } from "cloudinary";
import { IStorageService, UploadableFile, StorageResult } from "../../domain/services/IStorageService";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorageService implements IStorageService {
  async upload(file: UploadableFile, folder: string): Promise<StorageResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload falhou"));
          resolve({
            url: result.secure_url,
            originalName: file.originalname,
          });
        },
      );
      stream.end(file.buffer);
    });
  }

  async delete(url: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(url);
      const resourceType = url.includes("/video/") ? "video" : "image";
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch {
      // ignora se o arquivo não existir
    }
  }

  private extractPublicId(url: string): string {
    // https://res.cloudinary.com/{cloud}/image/upload/v123/{folder}/{file}.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : url;
  }
}
