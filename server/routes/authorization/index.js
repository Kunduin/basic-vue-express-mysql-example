const express = require("express");
const router = express.Router();
const { USER_INFO } = require("../../data/tables");
const model = require("../../models");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../util/jwtSecret");
const md5 = require("blueimp-md5");

router.route("/login").post((req, res) => {
  const { body = {} } = req;
  const { username, password } = body;
  model[USER_INFO].findOne({
    where: { username }
  }).then(info => {
    if (info && md5(password) === info.password) {
      const token = jwt.sign({ id: info.id }, SECRET_KEY);
      req.session.token = token;
      res.send({ token, user: info });
    } else {
      res.status(418).send({ message: "用户名不存在" });
    }
  });
});

router.route("/register").post((req, res) => {
  const { body = {} } = req;
  const { username, password } = body;
  model[USER_INFO].findOne({
    where: { username }
  }).then(info => {
    if (info) {
      res.status(418).send({ message: "用户名已注册" });
    } else {
      model[USER_INFO].create({ username, password: md5(password) }).then(() =>
        res.send({})
      );
    }
  });
});

module.exports = router;
