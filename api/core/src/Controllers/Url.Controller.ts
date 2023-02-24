import { NextFunction, Request, Response } from "express";
import { UrlRepository,  UrlRepositoryI} from "../Repositories/Url.Repository";
import { UrlService, UrlServiceI } from "../Services/Url.Service";

export interface ApiResponseI {
  short_url: number;
  original_url: string;
}

export interface UrlControllerI {
  redirectToUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  postShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// Repository
const urlRepository: UrlRepositoryI = new UrlRepository();
const urlService: UrlServiceI = new UrlService();

export class UrlController implements UrlControllerI {
  public async postShortUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { url }: { url: string } = req.body;
    const isUrlValid = await urlService.validateUrl(url);

    if (!isUrlValid) {
      // Code 422 - wrong input
      res.json({ error: "invalid url" });
      return next();
    }

    const dbResponse = await urlRepository.addUrl(url);

    const response: ApiResponseI = {
      original_url: url,
      short_url: dbResponse.id,
    };

    // Code 200 - Ok
    res.json(response);
  }

  public async redirectToUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = +req.params.id;
    if (isNaN(id)) {
      // wrong input
      res.sendStatus(422);
      return next();
    }

    const dbResponse = await urlRepository.getUrlById(id);

    if (!dbResponse?.id || !dbResponse?.url) {
      // url not found
      res.sendStatus(404);
      return next();
    }

    // Code 301 - Permanent Redirect
    res.redirect(301, dbResponse.url);
  }
}
