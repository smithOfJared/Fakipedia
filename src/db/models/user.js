'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 0,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wiki"
    });
    User.belongsToMany(models.Wiki, {
      as: 'CollaboratedWikis',
      through: 'WikiCollaborator',
      foreignKey: 'userId'
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === User.roles.admin;
  };

  User.prototype.isPremium = function() {
    return this.role === User.roles.premium;
  };
  User.roles = {standard: 0, admin: 1, premium: 2};
  return User;
};
