import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";

import Index from "../../src/index";
import { port } from "../../src/config/constants";

chai.use(chaiHttp);

/** @test {Shows} */
describe("Shows:", () => {

  let page, show;

  before(() => {
    page = 1;
    show = "tt0944947";
  });

  /** @test {Shows#getShows} */
  it("GET /shows", done => {
    chai.request(`http://localhost:${port}`)
      .get("/shows")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Shows#getPage} */
  it("GET /shows/:page", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/shows/${page}`)
      .query({
        sort: "seeds",
        genre: "All",
        order: -1
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Shows#getShow} */
  it("GET /show/:id", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/show/${show}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Shows#getRandomShow} */
  it("GET /random/show", done => {
    chai.request(`http://localhost:${port}`)
      .get("/random/show")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

});
