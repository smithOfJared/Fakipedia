const User = require("./models").User;
const bcrypt = require("bcryptjs");
const key = require("../config/stripe-key");
const stripe = require("stripe");
const CollaboratedWikis = require("./models").WikiCollaborator;
const Wiki = require("./models").Wiki;

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    console.log('$$$$$$$: userQueries ' + newUser);
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback){
    return User.findById(id, {
      include: [{
        model: Wiki,
        as: "CollaboratedWikis"
      },
      {
        model: Wiki,
        as: "wikis"
      }]
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgradeUser(userId, callback){
    User.findById(userId)
    .then((user) => {
      user.update({role: User.roles.premium})
      .then(() => {
        callback(null, user);
      })
    })
    .catch((err) => {
      callback(err);
    });
  },
  downgradeUser(userId, callback){
    User.findById(userId)
    .then((user) => {
      user.update({role: User.roles.standard})
      .then(() => {
        callback(null, user);
      })
    })
    .catch((err) => {
      callback(err);
    });
  },
}
