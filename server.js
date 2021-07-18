const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

const haversine_distance = require("./utils/haversine_distance.js");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
const runningMessage = "Server is running on port " + port;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

// @desc  Get city by Geocoordinates
// @route GET /city/:latlng
app.get("/city", (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  let cityName;
  const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  axios
    .get(apiURL)
    .then((response) => {
      const addressComponents = response.data.results[0].address_components;
      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_1")) {
          cityName = component.long_name;
        }
      });

      res.render("index", { cityName });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// @desc  Get distance to bigben using Geocoordinates
// @route GET /bigben
app.get("/bigben", (req, res) => {
  const deviceLat = req.query.lat;
  const deviceLng = req.query.lng;
  const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=Big+Ben,London,UK&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  let bigbenLat;
  let bigbenLng;

  axios
    .get(apiURL)
    .then((response) => {
      const { lat, lng } = response.data.results[0].geometry.location;

      bigbenLat = lat;
      bigbenLng = lng;

      const bigbenDistance = haversine_distance(
        { lat: deviceLat, lng: deviceLng },
        { lat: bigbenLat, lng: bigbenLng }
      );

      res.render("index.ejs", { bigbenDistance });
    })
    .catch((error) => {
      console.log(error.message);
    });
});


// @desc Get distance to the core of the earth using Geocoordinates
// @route GET /core
app.get("/core", (req,res) => {
  const deviceLat = req.query.lat;
  const deviceLng = req.query.lng;
  const apiURL = `https://maps.googleapis.com/maps/api/elevation/json?locations=${deviceLat},${deviceLng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  let elevation;

  axios.get(apiURL)
    .then((response) => {
      elevation = response.data.results[0].elevation;

      res.render("index.ejs", {coreDistance: elevation})
    })
    .catch((error) => {
      console.log(error.message)
    })
    

})

const server = app.listen(port, () => {
  console.log(runningMessage);
});

module.exports = server;
