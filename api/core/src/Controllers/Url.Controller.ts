import { NextFunction, Request, Response } from "express";

import { UrlService, UrlServiceI } from "../Services/Url.Service";

export interface UrlControllerI {
  redirectToUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  postShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// Service
const urlService: UrlServiceI = new UrlService();

export class UrlController implements UrlControllerI {
  public async postShortUrl(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { url }: { url: string } = req.body;

    const response = await urlService.createShortUrl(url);

    if (!response) {
      // Code 422 - wrong input
      res.status(422).json({ error: "invalid url" });
    } else {
      // Code 200 - Ok
      res.json(response);
    }
  }

  public async redirectToUrl(
    req: Request,
    res: Response,
  ): Promise<void> {
    const id = +req.params.id;

    const response = await urlService.getShortUrl(id);

    if (!response) {
      // wrong input
      res.sendStatus(400);
    } else {
      // Code 302 - Temporary Redirect
      res.redirect(response.original_url);
    }
  }
}
