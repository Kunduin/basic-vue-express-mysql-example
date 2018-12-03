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
const fs = require("fs");
const Op = Sequelize.Op;

const AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;

// 设置APPID/AK/SK
const APP_ID = "15014508";
const API_KEY = "RDH7fMRXgMN8AZzUyZbIZ91h";
const SECRET_KEY = "hDGqHtUDdVq2iw6qnS3dCkVdyjswU8Vk";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);

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
    }

    let orderList = [];
    switch (sort) {
      case "LATEST":
        orderList = [["createdAt", "DESC"]];
        break;
      case "POPULAR":
        orderList = [["pageview", "DESC"]];
        break;
      default:
        orderList = [["createdAt", "DESC"]];
        break;
    }

    model[PHOTO].findAll({
      include: [
        {
          model: model[TAG],
          as: "tags",
          where: option,
          required: option.name ? true : false
        },
        {
          model: model[USER_INFO]
        }
      ],
      order: orderList
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

    const promiseQuery = files.map(item => {
      var fileBase64 = fs
        .readFileSync(
          path.resolve(__dirname, "../../static/images/" + item.filename)
        )
        .toString("base64");

      return client.advancedGeneral(fileBase64);
    });

    const nextPhotos = [];
    Promise.all(promiseQuery)
      .then(results => {
        for (let i = 0; i < files.length; i++) {
          nextPhotos.push({
            url: DEVELOPMENT + "/public/images/" + files[i].filename,
            filename: files[i].originalname,
            userId,
            tags: results[i].result.map(item => ({ name: item.keyword }))
          });
        }
      })
      .then(() => {
        const photoQuery = nextPhotos.map(item => {
          return new Promise(resolve => {
            model[PHOTO].create(item, {
              include: [
                {
                  model: model[TAG],
                  as: "tags"
                }
              ]
            }).then(() => resolve());
          });
        });

        Promise.all(photoQuery)
          .then(() => res.send({}))
          .catch(error => console.log(error));
      });
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
