const request = require("supertest");

const endpointsJson = require("../endpoints.json");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(data));

afterEach(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
