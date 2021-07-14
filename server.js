const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
const runningMessage = "Server is running on port " + port;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(port, () => {
  console.log(runningMessage);
});

module.exports = server;
