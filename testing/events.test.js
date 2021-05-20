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

test("fetch all events", async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ events{ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.events.length).toEqual(5);
      done();
    });
});

test('queries a single event', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ event(id: \"60a6984ce281da381e146c19\"){ id, name} }",
    })
    .set("Accept", "eventlication/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.event.id).toEqual("60a6984ce281da381e146c19");
      done();
    });
});

test('Finds events by name', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ events(name: \"Kanye West\"){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.events[0].name).toEqual("Kanye West");
      done();
    });
});

test('Finds events between a specified date range', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ events(dates: [\"01/01/1960\", \"01/20/2020\"]){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.events.length).toEqual(5);
      done();
    });
});

test('Finds events for a given event name between a specified date range', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ events(name: \"Kanye West\", dates: [\"01/01/1960\", \"01/20/2020\"]){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.events.length).toEqual(1);
      done();
    });
});

test('Returns an empty array if no events are found in the specified date range', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ events(dates: [\"01/01/1960\", \"01/01/1970\"]){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.events.length).toEqual(0);
      done();
    });
});