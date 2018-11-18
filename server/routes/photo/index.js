const express = require("express");
const router = express.Router();
const { USER_INFO, PHOTO, TAG } = require("../../data/tables");
const model = require("../../models");
const verifySession = require("../../util/jwtSecret").verifySession;
const { DEVELOPMENT } = require("../../data/domain");
const generateId = require("../../util/generateId");
const path = require("path");
const multer = require("multer");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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

router
  .route("")
  .get(verifySession, (req, res) => {
    const { query = {} } = req;
    const { tag, sort } = query;

    let option = { name: tag };
    if (tag === "-1") {
      delete option.name;
    } else {
      // model[TAG].findOne({
      //   where: {
      //     name: photoId
      //   },
      //   include: [
      //     {
      //       model: model[TAG],
      //       as: "tags"
      //     },
      //     {
      //       model: model[USER_INFO]
      //     }
      //   ]
      // }).then(photo => {
      //   photo
      //     .update({
      //       pageview: photo.pageview + 1
      //     })
      //     .then(photo => {
      //       res.send(photo);
      //     });
      // });
    }

    model[PHOTO].findAll({
      include: [
        {
          model: model[TAG],
          as: "tags",
          through: {
            where: option
          }
        },
        {
          model: model[USER_INFO]
        }
      ]
    }).then(info => {
      if (info) {
        res.send(info);
      } else {
        res.status(418).send({});
      }
    });
  })
  .post(verifySession, upload.array("photos"), (req, res) => {
    const { query = {}, files = [] } = req;
    const { userId } = query;
    const nextPhotos = files.map(file => {
      return {
        url: DEVELOPMENT + "/public/images/" + file.filename,
        filename: file.originalname,
        userId
      };
    });
    model[PHOTO].bulkCreate(nextPhotos).then(() => res.send({}));
  });

router
  .route("/:photoId/pageview")
  .get(verifySession, (req, res) => {
    const { params = {} } = req;
    const { photoId } = params;
    model[PHOTO].findOne({
      where: {
        id: photoId
      },
      include: [
        {
          model: model[TAG],
          as: "tags"
        },
        {
          model: model[USER_INFO]
        }
      ]
    }).then(photo => {
      res.sent(photo);
    });
  })
  .post(verifySession, (req, res) => {
    const { params = {} } = req;
    const { photoId } = params;
    model[PHOTO].findOne({
      where: {
        id: photoId
      },
      include: [
        {
          model: model[TAG],
          as: "tags"
        },
        {
          model: model[USER_INFO]
        }
      ]
    }).then(photo => {
      model[TAG].increment("pageview", {
        where: {
          id: {
            [Op.or]: photo.tags.map(tag => tag.id)
          }
        }
      });
      photo.increment("pageview", { by: 1 }).then(photo => {
        res.send(photo);
      });
    });
  });

module.exports = router;
