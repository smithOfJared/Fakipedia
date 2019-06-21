const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");
const Op = require("sequelize").Op;



module.exports = {
  getAllWikis(options, callback){
    const sqlOptions = {
      where: {
        [Op.or]: {
          private: (options.authorized ? [false, true, null] : false),
          '$Collaborators.id$': options.userId || 0
        }
      },
      include: [{
        model: User,
        association: 'Collaborators'
      }]
    }
    return Wiki.findAll(sqlOptions)
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
      include: [{
        model: User,
        as: "Collaborators"
      }]
    })
    .then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    })
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
          fields: Object.keys(updatedWiki).filter(k => k != 'collaborators')
        })
        .then(() => {
          console.log("THE UPDATED WIKI", updatedWiki);
          if('collaborators' in updatedWiki) {
            const collaboratorIds = updatedWiki.collaborators;
            User.findAll({where: {id: collaboratorIds}})
            .then((collaborators) => {
              wiki.setCollaborators(collaborators)
              .then(() => {
                callback(null, wiki);
              });
            });
          } else {
            callback(null, wiki);
          }
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
  },

}//Last bracket for module.export
