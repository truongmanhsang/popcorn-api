const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

const Index = require("../../build/index");
const { port } = require("../../build/config/constants");

chai.use(chaiHttp);

/** @test {Shows} */
describe("Shows:", ()=> {

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

//"test": "mocha --timeout 15000 --recursive --compilers js:babel-register",

  /** @test {Shows#getPage} */
  it("GET /shows/:page", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/shows/${page}`)
      // .query()
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
