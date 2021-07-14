const request = require("supertest");
const jsdom = require("jsdom");
const expect = require("chai").expect;

const server = require("../server");

describe("Users can enter the coordinates of their location to show their city", function () {
  after(function () {
    server.close();
  });

  describe("Users can enter their coordinates", function () {
    describe("Users can enter their latitude", function () {
      describe("Should have an input field with id='lat', name='lat, type='text' and is required", (done) => {
        let htmlDOM;
        let latInput;
        request(server)
          .get("/")
          .expect(200)
          .end((error, response) => {
            htmlDOM = new jsdom.JSDOM(response.text);
            latInput = null;
          });
        it("should have an input element with id='lat'", function (done) {
          latInput = htmlDOM.window.document.querySelector("input#lat");
          console.log("lat input: ", latInput);
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

        it("should have a label element with id='latLabel'", function(done){
          const latLabel = htmlDOM.window.document.querySelector("label#latLabel");
          expect(latLabel).to.not.be.a("null");
          expect(latLabel).to.have.property("id", "latLabel");
          done();
        })
      });
      // it("Should have a label for the input field with id='lat'", function(done) {
      //   done();
      // });
    });

    // describe("Users can enter their longitude", function() {
    //   it("Should have an input field with id='lng', name='lng, type='text' and is required", function()  {});
    //   it("Should have a label for the input field with id='lng'", function()  {});
    // });
  });

  // describe("Users can submit their coordinates", function() {
  //   it("Should have a button with id='cityButton' and text content of 'Find my city'", function() {});
  // });

  // describe("The application can retrive city name using coordinates from Google Map API", function() {
  //   it("Should have a valid API key for Google Map API", function() {});

  //   it("Should retrieve location data using coordinates from Google Map API", function() {});

  //   it("Should extract city name from location data", function() {});
  // });

  // describe("The application should display the retrieved city name", function() {
  //   it("Should hava an HTML element with id='cityName'", function() {});

  //   it("Should display an extrected city name in HTML element with id='cityName'", function() {});
  // });
});
