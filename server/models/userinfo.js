const { USER_INFO, PHOTO } = require("../data/tables");
module.exports = (sequelize, DataTypes) => {
  const userInfo = sequelize.define(
    USER_INFO,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      nickname: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.STRING
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  userInfo.associate = function(models) {
    models[USER_INFO].hasMany(models[PHOTO], { as: "photos" });
  };

  return userInfo;
};
