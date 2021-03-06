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

describe("Users can enter the coordinates of their location to show their city", function () {
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
      let latInput;
      let latLabel;
      request(server)
        .get("/")
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          latInput = null;
        });
      it("should have an input element with id='lat'", function (done) {
        latInput = htmlDOM.window.document.querySelector("input#lat");
        expect(latInput).to.not.be.a("null");
        done();
      });

      it("should have an input element with name='lat'", function (done) {
        expect(latInput).to.have.property("name", "lat");
        done();
      });

      it("should have an input element with type='text'", function (done) {
        expect(latInput).to.have.property("type", "text");
        done();
      });

      it("should have an input element with id='lat' that is required", function (done) {
        expect(latInput).to.have.property("required", true);
        done();
      });

      it("should have a label element with id='latLabel'", function (done) {
        latLabel = htmlDOM.window.document.querySelector("#latLabel");
        expect(latLabel).to.not.be.a("null");
        expect(latLabel).to.have.id("latLabel");
        done();
      });

      it("should have a label element with text='Latitude'", function (done) {
        expect(latLabel).to.contain.text("Latitude");
        done();
      });
    });
    describe("Users can enter their longitude", function () {
      let htmlDOM;
      let lngInput;
      let lngLabel;
      request(server)
        .get("/")
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          lngInput = null;
        });
      it("should have an input element with id='lng'", function (done) {
        lngInput = htmlDOM.window.document.querySelector("input#lng");
        expect(lngInput).to.not.be.a("null");
        done();
      });

      it("should have an input element with id='lng' with name='lng'", function (done) {
        expect(lngInput).to.have.property("name", "lng");
        done();
      });

      it("should have an input element with id='lng' with type='text'", function (done) {
        expect(lngInput).to.have.property("type", "text");
        done();
      });

      it("should have an input element with id='lng' that is required", function (done) {
        expect(lngInput).to.have.property("required", true);
        done();
      });

      it("should have a label element with id='latLabel'", function (done) {
        lngLabel = htmlDOM.window.document.querySelector("label#lngLabel");
        expect(lngLabel).to.not.be.a("null");
        expect(lngLabel).to.have.id("lngLabel");
        done();
      });

      it("should have a label element with text='Longitude'", function (done) {
        expect(lngLabel).to.contain.text("Longitude");
        done();
      });
    });
  });

  describe("Users can submit their coordinates", function () {
    let htmlDOM;
    let cityButton;
    let cityForm;
    request(server)
      .get("/")
      .expect(200)
      .end((error, response) => {
        htmlDOM = new jsdom.JSDOM(response.text);
        cityButton = null;
      });

    describe("There should be a submit button for submitting the lat/lng inputs", function () {
      it("should have a button with id='cityButton'", function (done) {
        cityButton = htmlDOM.window.document.querySelector("button#cityButton");
        expect(cityButton).to.not.be.a("null");
        expect(cityButton).to.have.property("id", "cityButton");
        done();
      });

      it("should have abutton with id='cityButton' that is of type submit", function (done) {
        expect(cityButton).to.have.property("type", "submit");
        done();
      });
    });

    describe("There should be a form that submits the lat/lng pair to GET /city", function () {
      it("should have a form element with id='cityForm'", function (done) {
        cityForm = htmlDOM.window.document.querySelector("form#cityForm");
        expect(cityForm).to.not.be.a("null");
        expect(cityForm).to.have.property("id", "cityForm");
        done();
      });

      it("should have a form element with id ='cityForm' with attribute method='GET'", function (done) {
        expect(cityForm).to.have.property("method", "get");
        done();
      });

      it("should have a form element with id ='cityForm' with attribute action='http://localhost:5000/city'", function (done) {
        expect(cityForm).to.have.property("action", "./city");
        done();
      });
    });
  });

  describe("The application can retrieve city name using coordinates from Google Map Geocoding API", function () {
    it("should have a valid API key for Google Map API", function (done) {
      const lat = "39.973100146423526";
      const lng = "32.77836554968787";
      requestGoogleAPI
        .get(
          `/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        )
        .expect(200)
        .end((error, response) => {
          expect(response.status).to.be.equal(200);
          done();
        });
    });

    it("should retrieve the correct city name for a lat-lng pair", function (done) {
      const lat = "39.973100146423526";
      const lng = "32.77836554968787";
      requestGoogleAPI
        .get(
          `/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        )
        .expect(200)
        .end((error, response) => {
          const jsonResponse = JSON.parse(response.text);
          const addressComponents = jsonResponse.results[0].address_components;
          let cityName;

          addressComponents.forEach((component) => {
            if (component.types.includes("administrative_area_level_1")) {
              cityName = component.long_name;
            }
          });
          expect(cityName).to.be.equal("Ankara");
          done();
        });
    });
  });

  describe("The application should display the retrieved city name", function () {
    let htmlDOM;
    let cityDisplay = null;
    const lat = "39.973100146423526";
    const lng = "32.77836554968787";

    it("Should have an HTML element with id='cityName'", function (done) {
      request(server)
        .get("/city")
        .query({ lat, lng })
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          cityDisplay = htmlDOM.window.document.querySelector("#cityName");
          expect(cityDisplay).to.not.be.a("null");
          expect(cityDisplay).to.have.id("cityName");
          done();
        });
    });

    it("Should display a correctly extracted city name in HTML element with id='cityName'", function (done) {
      request(server)
        .get("/city")
        .query({ lat, lng })
        .expect(200)
        .end((error, response) => {
          htmlDOM = new jsdom.JSDOM(response.text);
          cityDisplay = htmlDOM.window.document.querySelector("#cityName");
          expect(cityDisplay).to.contain.trimmed.text("Ankara");
          done();
        });
    });
  });
});
