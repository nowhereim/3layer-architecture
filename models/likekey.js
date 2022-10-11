'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likekey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  likekey.init({
    postId: DataTypes.INTEGER,
    likekey: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'likekey',
  });
  return likekey;
};