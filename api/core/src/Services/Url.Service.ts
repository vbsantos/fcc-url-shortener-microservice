import dns from "dns";
import util from "util";
import url from "url";

export interface UrlServiceI {
  validateUrl(rawUrl: string): Promise<boolean>;
}

export class UrlService implements UrlServiceI {
  public async validateUrl(rawUrl: string): Promise<boolean> {
    try {
      if (!rawUrl) {
        return false;
      }

      const parsedUrl = url.parse(rawUrl);

      if (!parsedUrl.protocol) {
        return false;
      }

      const dnsLookup = util.promisify(dns.lookup);
      const hostname = parsedUrl.hostname || parsedUrl.pathname || rawUrl;
      await dnsLookup(hostname);

      return true;
    } catch (error) {
      return false;
    }
  }
}
