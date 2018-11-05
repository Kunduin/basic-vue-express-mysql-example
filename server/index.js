const express = require("express");
const bodyParser = require("body-parser");
const models = require("./models");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "homework",
    cookie: { maxAge: 30 * 60 * 1000 }
  })
);

app.use("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

app.use("/public", express.static(__dirname + "/static"));
app.use("/api/v2", require("./routes"));

models.sequelize.sync().then(function() {
  app.listen(port);
});

/* eslint no-console:0 */
console.log("Server is on " + port);
