export interface UploadableFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export interface StorageResult {
  url: string;
  originalName: string;
}

export interface IStorageService {
  upload(file: UploadableFile, folder: string): Promise<StorageResult>;
  delete(url: string): Promise<void>;
}
