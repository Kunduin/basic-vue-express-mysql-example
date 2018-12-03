const express = require("express");
const router = express.Router();
const { TAG, PHOTO } = require("../../data/tables");
const model = require("../../models");
const verifySession = require("../../util/jwtSecret").verifySession;

router
  .route("")
  .get(verifySession, (req, res) => {
    const { query = {} } = req;
    const { photoId, name } = query;
    let whereOption = { name };
    let throughOption = { id: photoId };
    if (photoId === "-1") delete throughOption.id;
    if (name === "-1") delete whereOption.name;

    model[TAG].findAll({
      where: whereOption,
      include: [
        {
          model: model[PHOTO],
          as: "photos",
          where: throughOption
        }
      ],
      order: [["pageview", "DESC"]]
    }).then(tags => {
      res.send(tags);
    });
  })
  .post(verifySession, (req, res) => {
    const { body = {} } = req;
    const { name, photoId } = body;
    model[TAG].findOne({
      where: {
        name
      }
    }).then(tag => {
      if (!tag) {
        model[TAG].create({ name }).then(nextTag => {
          photoAddTag(nextTag, photoId).then(photo => res.send(photo));
        });
      } else photoAddTag(tag, photoId).then(photo => res.send(photo));
    });
  });

function photoAddTag(tag, photoId) {
  return model[PHOTO].findOne({
    where: { id: photoId },
    include: [
      {
        model: model[TAG],
        as: "tags"
      }
    ]
  }).then(photo => {
    if (photo.tags.findIndex(photoTag => photoTag.id === tag.id) < 0) {
      return photo.addTags([tag]);
    }
    return photo;
  });
}

module.exports = router;
