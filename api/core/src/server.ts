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
app.get("/shorturl/:id", urlController.getShortUrl);

if (!module.parent) {
  app.listen(3000, () => console.log("http://localhost:3000/"));
}

export default app;
