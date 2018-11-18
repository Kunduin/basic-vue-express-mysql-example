const express = require("express");
const router = express.Router();
const { USER_INFO } = require("../../data/tables");
const model = require("../../models");
const verifySession = require("../../util/jwtSecret").verifySession;

router.route("/:userId").get(verifySession, (req, res) => {
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
