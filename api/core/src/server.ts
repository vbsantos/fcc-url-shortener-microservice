import express, { Express, json } from "express";

import { UrlController, UrlControllerI } from "./Controllers/Url.Controller";

// Controller
const urlController: UrlControllerI = new UrlController();

// Express
const app: Express = express();

// Middlewares
app.use(json());

// Routes
app.post("/shorturl", urlController.postShortUrl);
app.get("/shorturl/:id", urlController.redirectToUrl);

if (!module.parent) {
  const port = 3000;
  app.listen(port, () =>
    console.log(`API is ready at http://localhost:${port}/`)
  );
}

// Error Handler
process.on('unhandledRejection', (reason: Error | any) => {
  console.error(`Unhandled Rejection: ${reason.message || reason}`);
  throw new Error(reason.message || reason);
});

export default app;
