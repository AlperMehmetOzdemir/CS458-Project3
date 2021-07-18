const request = require("supertest");
const requestGoogleAPI = require("supertest")(
  "https://maps.googleapis.com/maps/api"
);
const dotenv = require("dotenv");
const jsdom = require("jsdom");
const chai = require("chai");
chai.use(require("chai-dom"));
const expect = chai.expect;
const server = require("../server");

dotenv.config();



//------------------------------------------------------------------------------------------------------------
describe("Users find their distance from Big Ben, GPS is found automatically", function () {
  // Make sure server is closed before tests (so port is available)
  before(function(){
    server.close();
  })

  // Close server after testing is done
  after(function () {
    server.close();
  });

  describe("Users can enter their coordinates", function () {
    describe("Users can enter their latitude", function () {
      let htmlDOM;
      let bigbenLatInput;
      let bigbenLatLabel;
      request(server)
        .get("/")
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          bigbenLatInput = null;
        });
      it("should have an input element with id='bigbenLatLabel'", function (done) {
        bigbenLatInput = htmlDOM.window.document.querySelector("input#bigbenLat");
        expect(bigbenLatInput).to.not.be.a("null");
        done();
      });
     
      
      it("should have an input element with name='lat'", function (done) {
        expect(bigbenLatInput).to.have.property("name", "lat");
        done();
      });

      it("should have an input element with type='text'", function (done) {
        expect(bigbenLatInput).to.have.property("type", "text");
        done();
      });

      it("should have an input element with id='bigbenLat' that is required", function (done) {
        expect(bigbenLatInput).to.have.property("required", true);
        done();
      });

      it("should have a label element with id='bigbenLatLabel'", function (done) {
        bigbenLatLabel = htmlDOM.window.document.querySelector("#bigbenLatLabel");
        expect(bigbenLatLabel).to.not.be.a("null");
        expect(bigbenLatLabel).to.have.id("bigbenLatLabel");
        done();
      });

      it("should have a label element with text='Latitude'", function (done) {
        expect(bigbenLatLabel).to.contain.text("Latitude");
        done();
      });
    });

    describe("Users can enter their longitude", function () {
      let htmlDOM;
      let bigbenLngInput;
      let bigbenLngLabel;
      request(server)
        .get("/")
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          bigbenLngInput = null;
        });
      it("should have an input element with id='bigbenLng'", function (done) {
        bigbenLngInput = htmlDOM.window.document.querySelector("input#bigbenLng");
        expect(bigbenLngInput).to.not.be.a("null");
        done();
      });

      it("should have an input element with id='bigbenlng' with name='lng'", function (done) {
        expect(bigbenLngInput).to.have.property("name", "lng");
        done();
      });

      it("should have an input element with id='bigbenlng' with type='text'", function (done) {
        expect(bigbenLngInput).to.have.property("type", "text");
        done();
      });

      it("should have an input element with id='bigbenLng' that is required", function (done) {
        expect(bigbenLngInput).to.have.property("required", true);
        done();
      });

      it("should have a label element with id='bigbenLngLabel'", function (done) {
        bigbenLngLabel = htmlDOM.window.document.querySelector("label#bigbenLngLabel");
        expect(bigbenLngLabel).to.not.be.a("null");
        expect(bigbenLngLabel).to.have.id("bigbenLngLabel");
        done();
      });

      it("should have a label element with text='Longitude'", function (done) {
        expect(bigbenLngLabel).to.contain.text("Longitude");
        done();
      });
    });

    describe("Users can submit their coordinates", function () {
      let htmlDOM;
      let bigbenCityButton;
      let bigbenCityForm;
      request(server)
        .get("/")
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          bigbenCityButton = null;
        });
  
      describe("There should be a submit button for submitting the lat/lng inputs", function () {
        it("should have a button with id='bigbenButton'", function (done) {
          bigbenCityButton = htmlDOM.window.document.querySelector("button#bigbenButton");
          expect(bigbenCityButton).to.not.be.a("null");
          expect(bigbenCityButton).to.have.property("id", "bigbenButton");
          done();
        });
  
        it("should have a button with id='bigbenButton' that is of type submit", function (done) {
          expect(bigbenCityButton).to.have.property("type", "submit");
          done();
        });
      });
  
      describe("There should be a form that submits the lat/lng pair to GET /city", function () {
        it("should have a form element with id='bigbenForm'", function (done) {
          bigbenCityForm = htmlDOM.window.document.querySelector("form#bigbenForm");
          expect(bigbenCityForm).to.not.be.a("null");
          expect(bigbenCityForm).to.have.property("id", "bigbenForm");
          done();
        });
  
        it("should have a form element with id ='bigbenForm' with attribute method='GET'", function (done) {
          expect(bigbenCityForm).to.have.property("method", "get");
          done();
        });
  
        it("should have a form element with id ='bigbenForm' with attribute action='http://localhost:5000/bigben'", function (done) {
          expect(bigbenCityForm).to.have.property("action", "./bigben");
          done();
        });
      });
    });

    
    

    
    
  });

  
});



