const supertest = require('supertest');
const app = require("../server/server");
const db = require('../db/index');
let request;
let server;

beforeEach((done) => {
  server = app.listen(5000, done);
  request = supertest(app);
});

afterEach((done) => {
  server.close(done);
});

afterAll(() => {
  console.log('Closing db connection');
  db.close();
});

test("fetch all apps", async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ apps{ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.apps.length > 0).toEqual(true);
      done();
    });
});

test('queries a single app', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ app(id: \"60a55ec512dd1a2d206dac5b\"){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.app.id).toEqual("60a55ec512dd1a2d206dac5b");
      done();
    });
});

test('Lists all events for a given App', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ app(id: \"60a55ec512dd1a2d206dac5b\"){ id, name, events { id, name }} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.app.id).toEqual("60a55ec512dd1a2d206dac5b");
      expect(res.body.data.app.events.length).toEqual(5);
      done();
    });
});

test('Lists all stages for a given App', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ app(id: \"60a55ec512dd1a2d206dac5b\"){ id, name, stages { id, name }} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.app.id).toEqual("60a55ec512dd1a2d206dac5b");
      expect(res.body.data.app.stages.length).toEqual(3);
      done();
    });
});
