const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
const runningMessage = "Server is running on port " + port;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

// @desc  Get city by Geocoordinates
// @route GET /city/:latlng
app.get("/city", (req, res) => {
  console.log(req.query);
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
      // console.log(error);
    });
});

const server = app.listen(port, () => {
  console.log(runningMessage);
});

module.exports = server;
