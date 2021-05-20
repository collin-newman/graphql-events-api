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

test("fetch all stages", async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ stages{ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stages.length).toEqual(3);
      done();
    });
});

test('queries a single stage', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ stage(id: \"60a5422723e4eb297fe2568c\"){ id, name} }",
    })
    .set("Accept", "stagelication/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stage.id).toEqual("60a5422723e4eb297fe2568c");
      done();
    });
});

test('Finds stage by name', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ stage(name: \"Tizzle Stage\"){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stage.name).toEqual("Tizzle Stage");
      done();
    });
});

test('Lists all events at a given stage', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ stage(id: \"60a5422723e4eb297fe2568c\"){ id, name, events{ id, name }} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stage.id).toEqual("60a5422723e4eb297fe2568c");
      expect(res.body.data.stage.events.length).toEqual(2);
      done();
    });
});