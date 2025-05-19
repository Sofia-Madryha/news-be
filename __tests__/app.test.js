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

describe("GET article by id", () => {
  test("200: responds with object corresponding by article_id and with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Bad request when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/notNumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with array of article objects, each of which should have the corrects properties sorted by date in desc", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: responds with array of article objects, each of which should have the corrects properties sorted by title in asc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("title");
      });
  });
  test("200: responds with array of article objects, each of which should have the topic mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: responds with array of paginated article objects", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&limit=10&p=1")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("article_id");
        expect(articles[0].article_id).toBe(1);
        expect(articles[9].article_id).toBe(10);
      });
  });
  test("200: responds with array of paginated article objects, limit 5, page 2", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles).toBeSortedBy("article_id");
        expect(articles[0].article_id).toBe(6);
        expect(articles[4].article_id).toBe(10);
      });
  });
  test("200: responds with empty array of article objects, if there aren't any articles with given topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
   test("400: there is invalid query for limit", () => {
    return request(app)
      .get("/api/articles?limit=limit")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("limit should be a number");
      });
   });
   test("400: there is invalid query for page", () => {
    return request(app)
      .get("/api/articles?p=page")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("page should be a number");
      });
  });
  test("404: there is invalid query sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=name&order=asc")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query for sorting");
      });
  });
  test("404: there is invalid query order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=1")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query for order");
      });
  });
  test("404: topic doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("topic is not found");
      });
  });
});

describe("GET comments by article id", () => {
  test("200: responds with array of comments objects for the given article_id, each of which should have the corrects properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
   test("200: responds with array of paginated comments objects", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&p=1")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
      });
  });
  test("200: responds with array of paginated article objects, limit 5, page 2", () => {
    return request(app)
       .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
      });
  });
  test("200: responds with empty array of comments when articles have no associated comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
   test("400: there is invalid query for limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=limit&p=2")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("limit should be a number");
      });
   });
   test("400: there is invalid query for page", () => {
    return request(app)
      .get("/api/articles/1/comments?p=p")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("page should be a number");
      });
  });
  test("400: Bad request when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/notNumber/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with created comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like it",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: "I like it",
          votes: expect.any(Number),
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });
  test("400: Bad request when isn't passed property", () => {
    const newComment = {
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing key 'body'");
      });
  });
  test("400: Bad request when passed an invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like it",
    };

    return request(app)
      .post("/api/articles/notNumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like it",
    };

    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
  test("404: username does not exist", () => {
    const newComment = {
      username: "notAUser",
      body: "I like it",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user is not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article incrementing votes", () => {
    const changedArticle = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(changedArticle)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: responds with updated article decrementing votes", () => {
    const changedArticle = {
      inc_votes: -100,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(changedArticle)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Bad request when passed an invalid property value", () => {
    const changedArticle = {
      inc_votes: "notANumber",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(changedArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("inc_votes should be a number");
      });
  });
  test("400: Bad request when isn't passed property", () => {
    const changedArticle = {};

    return request(app)
      .patch("/api/articles/1/")
      .send(changedArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing key 'inc_votes'");
      });
  });
  test("400: Bad request when passed an invalid article_id", () => {
    const changedArticle = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/articles/notNumber")
      .send(changedArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: article_id does not exist", () => {
    const changedArticle = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/articles/1000")
      .send(changedArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id is not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with no content", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("400: Bad request when passed an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/notNumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment id is not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with updated comment incrementing votes", () => {
    const changedComment = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(changedComment)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("200: responds with updated commnent decrementing votes", () => {
    const changedComment = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(changedComment)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 15,
          author: "butter_bridge",
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("400: Bad request when passed an invalid property value", () => {
    const changedComment = {
      inc_votes: "notANumber",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(changedComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("inc_votes should be a number");
      });
  });
  test("400: Bad request when isn't passed property", () => {
    const changedComment = {};

    return request(app)
      .patch("/api/comments/1/")
      .send(changedComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing key 'inc_votes'");
      });
  });
  test("400: Bad request when passed an invalid comment_id", () => {
    const changedArticle = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/notNumber")
      .send(changedArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: comment_id does not exist", () => {
    const changedArticle = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/1000")
      .send(changedArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment id is not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with array of user objects, each of which should have the corrects properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET user by username", () => {
  test("200: responds with object corresponding by username and with corect properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("404: user does not exist", () => {
    return request(app)
      .get("/api/users/user")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user is not found");
      });
  });
});

describe("POST /api/articles/", () => {
  test("201: responds with created article", () => {
    const newArticle = {
      title: "B",
      topic: "mitch",
      author: "icellusedkars",
      body: "Delicious",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          title: "B",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("201: responds with created article when article_img_url is not provided", () => {
    const newArticle = {
      title: "B",
      topic: "mitch",
      author: "icellusedkars",
      body: "Delicious",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          title: "B",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious",
          article_img_url: "",
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("400: Bad request when isn't passed property", () => {
    const newArticle = {
      title: "B",
      topic: "mitch",
      author: "icellusedkars",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing key 'body'");
      });
  });
  test("404: topic does not exist", () => {
    const newArticle = {
      title: "B",
      topic: "notTopic",
      author: "icellusedkars",
      body: "Delicious",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("topic is not found");
      });
  });
  test("404: username does not exist", () => {
    const newArticle = {
      title: "B",
      topic: "mitch",
      author: "notUser",
      body: "Delicious",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user is not found");
      });
  });
});
