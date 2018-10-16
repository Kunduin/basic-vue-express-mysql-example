const { USER_INFO } = require("../data/tables");
module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(USER_INFO, {
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
  });
  return UserInfo;
};
