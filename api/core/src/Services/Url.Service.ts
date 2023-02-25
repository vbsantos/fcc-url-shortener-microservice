import dns from "dns";
import util from "util";
import url from "url";

// Repository
import { UrlRepository, UrlRepositoryI } from "../Repositories/Url.Repository";
// const urlRepository: UrlRepositoryI = new UrlRepository();

export interface ResponseI {
  original_url: string;
  short_url: string;
}

export interface UrlServiceI {
  createShortUrl(rawUrl: string): Promise<ResponseI | null>;
  getShortUrl(shortUrlId: number): Promise<ResponseI | null>;
}

export class UrlService implements UrlServiceI {
  private urlRepository: UrlRepositoryI;

  constructor() {
    this.urlRepository = new UrlRepository();
    this.validateUrl = this.validateUrl.bind(this);
  }

  private async validateUrl(rawUrl: string): Promise<boolean> {
    try {
      if (!rawUrl) {
        return false;
      }

      const parsedUrl = url.parse(rawUrl);

      if (!parsedUrl.protocol) {
        return false;
      }

      const hostname = parsedUrl.hostname || parsedUrl.pathname || rawUrl;

      const dnsLookupAsync = util.promisify(dns.lookup);
      await dnsLookupAsync(hostname);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async createShortUrl(rawUrl: string): Promise<ResponseI | null> {
    const isUrlValid = await this.validateUrl(rawUrl);

    if (!isUrlValid) {
      return null;
    }

    const dbResponse = await this.urlRepository.addUrl(rawUrl);

    const response: ResponseI = {
      original_url: rawUrl,
      short_url: dbResponse.id,
    };

    return response;
  }

  public async getShortUrl(shortUrlId: number): Promise<ResponseI | null> {
    if (isNaN(shortUrlId)) {
      return null;
    }

    const dbResponse = await this.urlRepository.getUrlById(shortUrlId);

    if (!dbResponse?.id || !dbResponse?.url) {
      return null;
    }

    const response: ResponseI = {
      original_url: dbResponse.url,
      short_url: dbResponse.id,
    };

    return response;
  }
}
