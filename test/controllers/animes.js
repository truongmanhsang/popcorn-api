const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

const Index = require("../../build/index");
const { port } = require("../../build/config/constants");

chai.use(chaiHttp);

/** @test {Animes} */
describe("Animes:", ()=> {

  let page, anime;

  before(() => {
    page = 1;
    anime = "5646";
  });

  /** @test {Animes#getAnimes} */
  it("GET /animes", done => {
    chai.request(`http://localhost:${port}`)
      .get("/animes")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Animes#getPage} */
  it("GET /animes/:page", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/animes/${page}`)
      // .query()
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Animes#getAnime} */
  it("GET /anime/:id", done => {
    chai.request(`http://localhost:${port}`)
      .get(`/anime/${anime}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

  /** @test {Animes#getRandomAnime} */
  it("GET /random/anime", done => {
    chai.request(`http://localhost:${port}`)
      .get("/random/anime")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      }).catch(err => done(err));
  });

});
