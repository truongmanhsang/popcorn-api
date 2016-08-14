import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";

import Index from "../../src/index";
import { port } from "../../src/config/constants";

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
