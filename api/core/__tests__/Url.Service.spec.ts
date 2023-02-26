import { UrlRepositoryI } from "../src/Repositories/Url.Repository";
import { ResponseI, UrlService, UrlServiceI } from "../src/Services/Url.Service";

describe("UrlService", () => {
  let urlService: UrlServiceI;
  let urlRepositoryMock: jest.Mocked<UrlRepositoryI>;

  beforeEach(() => {
    urlRepositoryMock = {
      createShortUrl: jest.fn(),
      findById: jest.fn(),
      findByUrl: jest.fn(),
    };

    urlService = new UrlService(urlRepositoryMock);
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
      const result = await urlService.validateUrl(
        "http://not-a-real-domain-1234567890.com"
      );
      expect(result).toBe(false);
    });

    it("should return true when the URL is valid and the DNS lookup succeeds", async () => {
      const result = await urlService.validateUrl("https://www.google.com");
      expect(result).toBe(true);
    });
  });

  describe("createShortUrl", () => {
    it("should return null if the URL is invalid", async () => {
      // Arrange
      const rawUrl = "not a valid url";

      urlService.validateUrl = jest.fn().mockResolvedValue(false);

      // Act
      const result = await urlService.createShortUrl(rawUrl);

      // Assert
      expect(result).toBeNull();
      expect(urlService.validateUrl).toHaveBeenCalledWith(rawUrl);
      expect(urlRepositoryMock.createShortUrl).not.toHaveBeenCalled();
    });

    it("should create a short URL if the URL is valid and is not already created", async () => {
      // Arrange
      const rawUrl = "https://www.example.com";
      const dbResponse = { id: "123", url: rawUrl };
      const expectedResponse: ResponseI = {
        original_url: rawUrl,
        short_url: dbResponse.id,
      };

      urlService.validateUrl = jest.fn().mockResolvedValue(true);
      urlRepositoryMock.findByUrl.mockResolvedValue(null);
      urlRepositoryMock.createShortUrl.mockResolvedValue(dbResponse);

      // Act
      const result = await urlService.createShortUrl(rawUrl);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(urlService.validateUrl).toHaveBeenCalledWith(rawUrl);
      expect(urlRepositoryMock.createShortUrl).toHaveBeenCalledWith(rawUrl);
    });

    it("should not create a short URL if it is already created", async () => {
      // Arrange
      const rawUrl = "https://www.example.com";
      const dbResponse = { id: "123", url: rawUrl };
      const expectedResponse: ResponseI = {
        original_url: rawUrl,
        short_url: dbResponse.id,
      };

      urlService.validateUrl = jest.fn().mockResolvedValue(true);
      urlRepositoryMock.findByUrl.mockResolvedValue(dbResponse);

      // Act
      const result = await urlService.createShortUrl(rawUrl);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(urlService.validateUrl).toHaveBeenCalledWith(rawUrl);
      expect(urlRepositoryMock.findByUrl).toHaveBeenCalledWith(rawUrl);
      expect(urlRepositoryMock.createShortUrl).toHaveBeenCalledTimes(0);
    });
  });

  describe("getShortUrl", () => {
    it("should return null if the short URL ID is not a number", async () => {
      // Arrange
      const shortUrlId = NaN;

      // Act
      const result = await urlService.getShortUrl(shortUrlId);

      // Assert
      expect(result).toBeNull();
      expect(urlRepositoryMock.findById).not.toHaveBeenCalled();
    });

    it("should return null if the short URL ID does not exist in the database", async () => {
      // Arrange
      const shortUrlId = 123;

      urlRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = await urlService.getShortUrl(shortUrlId);

      // Assert
      expect(result).toBeNull();
      expect(urlRepositoryMock.findById).toHaveBeenCalledWith(shortUrlId);
    });

    it("should return the original URL if the short URL ID exists in the database", async () => {
      // Arrange
      const shortUrlId = 123;
      const rawUrl = "https://www.example.com";
      const dbResponse = { id: `${shortUrlId}`, url: rawUrl };
      const expectedResponse: ResponseI = {
        original_url: dbResponse.url,
        short_url: dbResponse.id,
      };

      urlRepositoryMock.findById.mockResolvedValue(dbResponse);

      // Act
      const result = await urlService.getShortUrl(shortUrlId);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(urlRepositoryMock.findById).toHaveBeenCalledWith(shortUrlId);
    });
  });
});
