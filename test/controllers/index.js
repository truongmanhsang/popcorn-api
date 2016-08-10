const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

const Index = require("../../build/index");
const { port } = require("../../build/config/constants");

chai.use(chaiHttp);

/** @test {Index} */
describe("Index:", ()=> {

  /** @test {Index#getIndex} */
  it("GET /", done => {
    chai.request(`http://localhost:${port}`)
      .get("/")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Index#getErrorLog} */
  it("GET /logs/error", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/logs/error`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

});
