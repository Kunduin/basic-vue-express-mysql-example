const express = require("express");
const bodyParser = require("body-parser");
const models = require("./models");

const morgan = require("morgan");
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));

app.use("/api/v1", require("./routes"));

models.sequelize.sync().then(function() {
  app.listen(port);
});

/* eslint no-console:0 */
console.log("Server is on " + port);
