# FreeCodeCamp - Back End Development and APIs Course

> ⚠️ For some unknown reason (CORS error) I had to host this project in other place to pass the FreeCodeCamp Tests.

## Certification Project - URL Shortener Microservice

- [x] Waiting:You should provide your own project, not the example URL.
- [x] Waiting:You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties. Here's an example: `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`
- [x] Waiting:When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.
- [x] Waiting:If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`

---

Build a full stack JavaScript app that is functionally similar to this: [https://url-shortener-microservice.freecodecamp.rocks](https://url-shortener-microservice.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

- Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-urlshortener/) and complete your project locally.
- Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-urlshortener) to complete your project.
- Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

- Start by importing the project on Replit.
- Next, you will see a `.replit` window.
- Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

---

**HINT:** Do not forget to use a body parsing middleware to handle the POST requests. Also, you can use the function `dns.lookup(host, cb)` from the `dns` core module to verify a submitted URL.

## Unit Tests

```text
PASS  tests/Url.Service.spec.ts
  UrlService
    validateUrl
      ✓ should return false when the URL is empty (2 ms)
      ✓ should return false when the URL protocol is missing (1 ms)
      ✓ should return false when the DNS lookup fails (216 ms)
      ✓ should return true when the URL is valid and the DNS lookup succeeds (24 ms)
    createShortUrl
      ✓ should return null if the URL is invalid (7 ms)
      ✓ should create a short URL if the URL is valid and is not already created (12 ms)
      ✓ should not create a short URL if it is already created (3 ms)
    getShortUrl
      ✓ should return null if the short URL ID is not a number (1 ms)
      ✓ should return null if the short URL ID does not exist in the database (1 ms)
      ✓ should return the original URL if the short URL ID exists in the database (2 ms)
```
