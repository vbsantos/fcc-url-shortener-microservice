import { NextFunction, Request, Response } from "express";

import { UrlServiceI } from "../Services/Url.Service";

export interface UrlControllerI {
  redirectToUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  postShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UrlController implements UrlControllerI {
  private urlService: UrlServiceI;

  constructor(urlService: UrlServiceI) {
    this.urlService = urlService;
    this.postShortUrl = this.postShortUrl.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
  }

  public async postShortUrl(req: Request, res: Response): Promise<void> {
    const { url }: { url: string } = req.body;

    const response = await this.urlService.createShortUrl(url);

    if (!response) {
      // Code 422 - wrong input
      res.status(422).json({ error: "invalid url" });
    } else {
      // Code 200 - Ok
      res.status(200).json(response);
    }
  }

  public async redirectToUrl(req: Request, res: Response): Promise<void> {
    const id = +req.params.id;

    const response = await this.urlService.getShortUrl(id);

    if (!response) {
      // wrong input
      res.sendStatus(400);
    } else {
      // Code 302 - Temporary Redirect
      res.redirect(302, response.original_url);
    }
  }
}
