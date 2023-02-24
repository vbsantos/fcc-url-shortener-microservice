import express, { Express } from "express";
import bodyParser from "body-parser";
import { UrlController, UrlControllerI } from "./Controllers/Url.Controller";
import { UrlMiddleware, UrlMiddlewareI } from "./Middlerwares/Url.Middleware";

// Controller
const urlController: UrlControllerI = new UrlController();

// Middleware
const urlMiddleware: UrlMiddlewareI = new UrlMiddleware();

// Express
const app: Express = express();

// Middlewares
app.use(bodyParser.json());
app.use(urlMiddleware.errorHandler);

// Routes
app.post("/shorturl", urlController.postShortUrl);
app.get("/shorturl/:id", urlController.redirectToUrl);

if (!module.parent) {
  const port = 3000;
  app.listen(port, () => console.log(`API is ready at port ${port}/`));
}

export default app;
