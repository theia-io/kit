import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Request...; endpoint: ${req.method}, ${req.url}, ${req.originalUrl}`
  );
  next();
}
