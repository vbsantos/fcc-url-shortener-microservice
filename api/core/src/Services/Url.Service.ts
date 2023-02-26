import dns from "dns";
import util from "util";
import url from "url";

// Repository
import { UrlEntityI, UrlRepositoryI } from "../Repositories/Url.Repository";

export interface ResponseI {
  original_url: string;
  short_url: string;
}

export interface UrlServiceI {
  validateUrl(rawUrl: string): Promise<boolean>;
  createShortUrl(rawUrl: string): Promise<ResponseI | null>;
  getShortUrl(shortUrlId: number): Promise<ResponseI | null>;
}

export class UrlService implements UrlServiceI {
  private urlRepository: UrlRepositoryI;

  constructor(urlRepository: UrlRepositoryI) {
    this.urlRepository = urlRepository;
    this.validateUrl = this.validateUrl.bind(this);
    this.createShortUrl = this.createShortUrl.bind(this);
    this.getShortUrl = this.getShortUrl.bind(this);
  }

  async validateUrl(rawUrl: string): Promise<boolean> {
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

    let dbResponse: UrlEntityI | null;
    dbResponse = await this.urlRepository.findByUrl(rawUrl);
    if (!dbResponse) {
      dbResponse = await this.urlRepository.createShortUrl(rawUrl);
    }

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

    const dbResponse = await this.urlRepository.findById(shortUrlId);

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
