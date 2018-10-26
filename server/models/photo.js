const { PHOTO, USER_INFO } = require("../data/tables");
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
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );

  photo.associate = function(models) {
    models[PHOTO].belongsTo(models[USER_INFO]);
  };

  return photo;
};
