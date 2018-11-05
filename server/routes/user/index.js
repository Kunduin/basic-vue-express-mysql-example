const { DEVELOPMENT } = require("../../data/domain");

const generateId = require("../../util/generateId");
const express = require("express");
const router = express.Router();
const { USER_INFO, PHOTO } = require("../../data/tables");
const model = require("../../models");
const path = require("path");
const multer = require("multer");
const verifySession = require("../../util/jwtSecret").verifySession;
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(__dirname, "../../static/images"));
  },
  filename: function(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    return cb(
      null,
      file.originalname.split(".")[0] + "-" + generateId() + "." + ext
    );
  }
});
const upload = multer({
  storage
});

router.route("/auth/:userId").get(verifySession, (req, res) => {
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

router
  .route("/auth/:userId/photo")
  .get(verifySession, (req, res) => {
    const { params = {} } = req;
    const { userId } = params;
    model[USER_INFO].findOne({
      where: { id: userId },
      include: [
        {
          model: model[PHOTO],
          as: "photos"
        }
      ]
    }).then(info => {
      if (info) {
        const { photos = [] } = info;
        res.send(photos);
      } else {
        res.status(418).send({ message: "用户名不存在" });
      }
    });
  })
  .post(verifySession, upload.array("photos"), (req, res) => {
    const { params = {}, files = [] } = req;
    const { userId } = params;
    const nextPhotos = files.map(file => {
      return {
        url: DEVELOPMENT + "/public/images/" + file.filename,
        filename: file.originalname,
        userId
      };
    });
    model[PHOTO].bulkCreate(nextPhotos).then(() => res.send({}));
  });

module.exports = router;
