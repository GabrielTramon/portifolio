import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../../shared/errors/AppError";

const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`Tipo de arquivo não suportado: ${file.mimetype}`, 400));
    }
  },
});

export function uploadFiles(req: Request, res: Response, next: NextFunction): void {
  upload.array("files", 6)(req, res, (err) => {
    if (!err) { next(); return; }

    if (err instanceof multer.MulterError) {
      const messages: Record<string, string> = {
        LIMIT_FILE_COUNT: "Máximo de 6 arquivos por upload.",
        LIMIT_FILE_SIZE: "Arquivo muito grande. Limite: 50MB.",
      };
      next(new AppError(messages[err.code] ?? err.message, 400));
      return;
    }

    next(err instanceof AppError ? err : new AppError((err as Error).message, 400));
  });
}
