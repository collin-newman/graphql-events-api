const supertest = require('supertest');
const app = require("../server/server");
let request;
let server;

beforeEach((done) => {
  server = app.listen(5000, done);
  request = supertest(app);
});

afterEach((done) => {
  server.close(done);
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
      expect(res.body.data.apps.length).toEqual(1);
      done();
    });
});

test('queries a single app', async (done) => {
  request
    .post("/graphql")
      .send({
        query: "{ app(id: \"b810bf6d-d81d-4104-bc1a-3b21d5154076\"){ id, name} }",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.app.id).toEqual("b810bf6d-d81d-4104-bc1a-3b21d5154076");
        done();
      });
});

test('It lists all events in an app', async (done) => {

});