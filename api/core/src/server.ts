import { json } from "body-parser";
// import cors from "cors";
import express, { Express } from "express";

import { UrlController, UrlControllerI } from "./Controllers/Url.Controller";
// import { UrlMiddleware, UrlMiddlewareI } from "./Middlerwares/Url.Middleware";

// Controller
const urlController: UrlControllerI = new UrlController();

// Middleware
// const urlMiddleware: UrlMiddlewareI = new UrlMiddleware();

// Express
const app: Express = express();

// Middlewares
// app.use(cors({ origin: "*" }));
app.use(json());

// Routes
app.post("/shorturl", urlController.postShortUrl);
app.get("/shorturl/:id", urlController.redirectToUrl);

// Error Handler
// app.use(urlMiddleware.errorHandler);

if (!module.parent) {
  const port = 3000;
  app.listen(port, () =>
    console.log(`API is ready at http://localhost:${port}/`)
  );
}

export default app;
