const { PHOTO, USER_INFO, TAG, PHOTO_TAG } = require("../data/tables");
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define(
    PHOTO,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING
      },
      filename: {
        type: DataTypes.STRING
      },
      pageview: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return dayjs(this.getDataValue("createdAt"))
            .add(8, "hour")
            .valueOf();
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return dayjs(this.getDataValue("updatedAt"))
            .add(8, "hour")
            .valueOf();
        }
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  photo.associate = function(models) {
    models[PHOTO].belongsTo(models[USER_INFO]);
    models[PHOTO].belongsToMany(models[TAG], {
      as: "tags",
      through: PHOTO_TAG
    });
  };

  return photo;
};
