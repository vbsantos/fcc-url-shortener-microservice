import { UrlService, UrlServiceI } from "../src/Services/Url.Service";

describe("UrlService", () => {
  let urlService: UrlServiceI;

  beforeEach(() => {
    urlService = new UrlService();
  });

  describe("validateUrl", () => {
    it("should return false when the URL is empty", async () => {
      const result = await urlService.validateUrl("");
      expect(result).toBe(false);
    });

    it("should return false when the URL protocol is missing", async () => {
      const result = await urlService.validateUrl("example.com");
      expect(result).toBe(false);
    });

    it("should return false when the DNS lookup fails", async () => {
      const result = await urlService.validateUrl("http://not-a-real-domain-1234567890.com");
      expect(result).toBe(false);
    });

    it("should return true when the URL is valid and the DNS lookup succeeds", async () => {
      const result = await urlService.validateUrl("https://www.google.com");
      expect(result).toBe(true);
    });
  });
});
