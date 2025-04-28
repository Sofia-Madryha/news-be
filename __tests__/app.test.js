const request = require("supertest");

const endpointsJson = require("../endpoints.json");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(data));

afterAll(() => db.end());

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

describe("bad path", () => {
  test("404: not found", () => {
    return request(app)
      .get("/api/notValidUrl")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid url!");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with array of topic objects, each of which should have the corrects properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});
