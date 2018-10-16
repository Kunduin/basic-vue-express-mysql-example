const express = require("express");
const router = express.Router();
const { USER_INFO } = require("../../data/tables");
const model = require("../../models");
const expressJwt = require("express-jwt");
const { SECRET_KEY } = require("../../util/jwtSecret");

router
  .route("/auth/:userId")
  .get(expressJwt({ secret: SECRET_KEY }), (req, res) => {
    const { params = {} } = req;
    const { userId } = params;
    model[USER_INFO].findOne({
      where: { id: userId }
    }).then(info => {
      if (info) {
        const { id, username, nickname, avatar } = info;
        res.send({
          id,
          username,
          nickname,
          avatar
        });
      } else {
        res.status(418).send({ message: "用户名不存在" });
      }
    });
  });

module.exports = router;
