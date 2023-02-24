import dns from "dns";
import util from "util";
import url from "url";

export interface UrlI {
  protocol: string | null;
  hostname: string;
}

export interface UrlServiceI {
  parseUrl(url: string): UrlI;
  addProtocol(url: string, protocol: string): string;
  validateUrl(url: string): Promise<boolean>;
}

export class UrlService implements UrlServiceI {
  public parseUrl(rawUrl: string): UrlI {
    const parsedUrl = url.parse(rawUrl);

    return {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname || parsedUrl.pathname || rawUrl,
    };
  }

  public addProtocol(rawUrl: string, protocol: string): string {
    let urlWithProtocol = rawUrl;
    const parsedUrl = url.parse(rawUrl);

    if (!parsedUrl.protocol) {
      urlWithProtocol = `${protocol}://${urlWithProtocol}`;
    }

    return urlWithProtocol;
  }

  public async validateUrl(url: string): Promise<boolean> {
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
}
