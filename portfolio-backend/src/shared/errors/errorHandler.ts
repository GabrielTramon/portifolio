import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "./AppError";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_COUNT: "Máximo de 6 arquivos por upload.",
      LIMIT_FILE_SIZE: "Arquivo muito grande. Limite: 50MB.",
    };
    res.status(400).json({ error: messages[error.code] ?? error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}
