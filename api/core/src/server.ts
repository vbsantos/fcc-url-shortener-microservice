import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import { UrlController, UrlControllerI } from "./Controllers/Url.Controller";
import { UrlRepository, UrlRepositoryI } from "./Repositories/Url.Repository";
import { UrlService, UrlServiceI } from "./Services/Url.Service";

const urlRepository: UrlRepositoryI = new UrlRepository();
const urlService: UrlServiceI = new UrlService(urlRepository);
const urlController: UrlControllerI = new UrlController(urlService);

// Express
const app: Express = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.send(JSON.stringify(req.body));
  return res.end();

  const { method, url } = req;
  const { statusCode } = res;
  const log = `${method}: ${url} ${statusCode}`;
  console.log(log);

  console.log(JSON.stringify(req.body));
  console.log(req.body);
  console.log(req.body.url);
  console.log(req.body["`url"]);

  next();
});

// Routes
app.post("/shorturl", urlController.postShortUrl);
app.get("/shorturl/:id", urlController.redirectToUrl);

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Error" });
});

// Error Handler
process.on("unhandledRejection", (reason: Error | any) => {
  console.error(`Unhandled Rejection: ${reason.message || reason}`);
  throw new Error(reason.message || reason);
});

// Server port
if (!module.parent) {
  const port = 3000;
  app.listen(port, () =>
    console.log(`API is ready at http://localhost:${port}/`)
  );
}

export default app;
