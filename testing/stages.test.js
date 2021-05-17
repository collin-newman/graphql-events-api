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
      query: "{ stage(id: \"a4087686-ee6c-49d8-a4f0-d67f5931df3a\"){ id, name} }",
    })
    .set("Accept", "stagelication/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stage.id).toEqual("a4087686-ee6c-49d8-a4f0-d67f5931df3a");
      done();
    });
});

test('Finds stages by name', async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ stages(name: \"Tizzle Stage\"){ id, name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.stages[0].name).toEqual("Tizzle Stage");
      done();
    });
});