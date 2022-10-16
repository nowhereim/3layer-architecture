'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Likes.init(
    {
      likeId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postId: {
        required: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        required: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Likes',
    }
  );
  Likes.associate = function (models) {
    models.Likes.hasMany(models.Users, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  Likes.associate = function (models) {
    models.Likes.hasMany(models.Posts, {
      foreignKey: 'postId',
      onDelete: 'cascade',
    });
  };
  return Likes;
};
