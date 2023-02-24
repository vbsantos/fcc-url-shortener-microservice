import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export interface UrlMiddlewareI {
  errorHandler(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void;
}

export class UrlMiddleware implements UrlMiddlewareI {
  public errorHandler(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void {
    next();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
