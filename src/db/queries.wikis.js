const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");


module.exports = {
  getAllWikis(authorized, callback){
    let options = {};
    if(!authorized) {
      options = {where: {private: false}}
    }
    return Wiki.findAll(options)
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {})
    .then(wiki => {
      console.log("wiki has been got");
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    });
  },

  createWiki(newWiki, callback){
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(id, updatedWiki, callback){
    return Wiki.findById(id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found, sorry.");
      } else {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      }
    })
  },

  deleteWiki(id, callback){
    return Wiki.findById(id)
    .then((wiki) => {
      wiki.destroy()
      .then((res) => {
        callback(null, wiki);
      })
    })
    .catch((err) => {
      callback(err);
    });
  }



}//Last bracket for module.export
