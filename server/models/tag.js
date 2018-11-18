const { PHOTO, TAG, PHOTO_TAG } = require("../data/tables");
module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define(
    TAG,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      pageview: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  tag.associate = function(models) {
    models[TAG].belongsToMany(models[PHOTO], {
      as: "photos",
      through: PHOTO_TAG
    });
  };

  return tag;
};
