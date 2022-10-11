'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PosT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PosT.init({
    postId: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    likekey: DataTypes.STRING,
    description: DataTypes.STRING,
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    timeset: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PosT',
  });
  return PosT;
};