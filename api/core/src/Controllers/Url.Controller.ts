import dns from "dns";
import util from "util";
import { NextFunction, Request, Response } from "express";
import {
  MysqlUrlRepository,
  UrlRepositoryI,
} from "../Repositories/Url.Repository";

export interface ApiResponseI {
  short_url: number;
  original_url: string;
}

export interface UrlControllerI {
  getShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  postShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// Repository
const urlRepository: UrlRepositoryI = new MysqlUrlRepository();

export class UrlController implements UrlControllerI {
  private static async validateUrl(url: string): Promise<boolean> {
    try {
      if (!url) {
        return false;
      }

      const validateUrl = util.promisify(dns.lookup);
      await validateUrl(url);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async postShortUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { url } = req.body;
    try {
      const isUrlValid = await UrlController.validateUrl(url);

      if (!isUrlValid) {
        // wrong input
        res.status(422).json({ error: "invalid url" });
        return next();
      }

      const dbResponse = await urlRepository.addUrl(url);

      const response: ApiResponseI = {
        short_url: dbResponse.id,
        original_url: url,
      };

      // Code 201 - Created
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Error" });
    }
  }

  public async getShortUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = +req.params.id;
    try {
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

      const response: ApiResponseI = {
        short_url: dbResponse.id,
        original_url: dbResponse.url,
      };

      // Code 200 - Ok
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Error" });
    }
  }
}
