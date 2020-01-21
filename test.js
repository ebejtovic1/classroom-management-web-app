const supertest = require("supertest");
const assert = require('assert');
const app = require("./index");

describe("GET/osoblje", function() {
  it("Provjera status koda koji mora biti 200", function(done) {
    supertest(app)
      .get("/osoblje")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  it("Provjera da li je vraceno svo osoblje", function(done) {
    supertest(app)
      .get("/osoblje")
      .expect([
        {"id":1,"ime":"Neko","prezime":"Nekic","uloga":"profesor"},
        {"id":2,"ime":"Drugi","prezime":"Neko","uloga":"asistent"},
        {"id":3,"ime":"Test","prezime":"Test","uloga":"asistent"}])
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});

describe("GET/sveSale", function() {
  it("Provjera status koda koji mora biti 200", function(done) {
    supertest(app)
      .get("/sveSale")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  it("Provjera da li su vracene sve sale", function(done) {
    supertest(app)
      .get("/sveSale")
      .expect([{"naziv":"1-11"},{"naziv":"1-15"}])
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});


describe("GET/zauzeca", function() {
  it("Provjera status koda koji mora biti 200", function(done) {
    supertest(app)
      .get("/zauzeca")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  it("Provjera da li su vracena sva zauzeca", function(done) {
    supertest(app)
      .get("/zauzeca")
      .expect({
      "periodicna":[{"dan":0,"semestar":"zimski","pocetak":"13:00","kraj":"14:00","naziv":"1-11","predavac":"Test Test"}],
      "vanredna":[{"datum":"01.01.2020","pocetak":"12:00","kraj":"13:00","naziv":"1-11","predavac":"Neko Nekic"}]})
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});

describe("POST/zauzeca", function() {
  it("Dodavanje vanredne rezervacije u bazu", function(done) {
    supertest(app)
      .post("/zauzeca")
      .send({datum: '19.09.2020', sala: '1-15', pocetak: '12:00', kraj: '14:00', predavac: 'Drugi Neko'})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

});


describe("POST/zauzeca1", function() {
  it("Dodavanje periodicne rezervacije u bazu", function(done) {
    supertest(app)
      .post("/zauzeca1")
      .send({dan: 4, semestar: 'ljetni', sala: '1-11', pocetak: '18:00', kraj: '19:00', predavac: 'Test Test'})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});

describe("Provjera da li su se dodala zauzeca u bazu", function() {
    it("Provjera da li je dodana rezervacija u bazu", function(done) {
    supertest(app)
      .get("/zauzeca")
      .expect({
        "periodicna":
        [{"dan":0,"semestar":"zimski","pocetak":"13:00","kraj":"14:00","naziv":"1-11","predavac":"Test Test"},
        {"dan":4,"semestar":"ljetni","pocetak":"18:00","kraj":"19:00","naziv":"1-11","predavac":"Test Test"}],
        "vanredna":[{"datum":"01.01.2020","pocetak":"12:00","kraj":"13:00","naziv":"1-11","predavac":"Neko Nekic"},
        {"datum":"19.09.2020","pocetak":"12:00","kraj":"14:00","naziv":"1-15","predavac":"Drugi Neko"}]})
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});



describe("Dodavanje periodicnog kad vec ima vanredno u tom danu", function() {
	it("Ne bi se smjelo dodati", function(done) {
    supertest(app)
      .post("/zauzeca1")
      .send({dan: 2, semestar: 'zimski', sala: '1-11', pocetak: '12:00', kraj: '13:00', predavac: 'Test Test'})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});

describe("Ne treba se dodati zadnje zauzece tj. stanje mora biti kao maloprije", function() {
  it("Status kod mora biti 200", function(done) {
    supertest(app)
      .get("/zauzeca")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  it("Provjera da li je dodano zauzece u bazu", function(done) {
    supertest(app)
      .get("/zauzeca")
      .expect({
        "periodicna":
        [{"dan":0,"semestar":"zimski","pocetak":"13:00","kraj":"14:00","naziv":"1-11","predavac":"Test Test"},
        {"dan":4,"semestar":"ljetni","pocetak":"18:00","kraj":"19:00","naziv":"1-11","predavac":"Test Test"}],
        "vanredna":[{"datum":"01.01.2020","pocetak":"12:00","kraj":"13:00","naziv":"1-11","predavac":"Neko Nekic"},
        {"datum":"19.09.2020","pocetak":"12:00","kraj":"14:00","naziv":"1-15","predavac":"Drugi Neko"}]})
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});