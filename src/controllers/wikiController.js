const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models").Wiki;
const User = require("../db/models").User;
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;
const Op = require("sequelize").Op;

module.exports = {
  index(req, res, next){
    const authorized = new Authorizer(req.user).index();
    const userId = req.user ? req.user.id : null;
    wikiQueries.getAllWikis({authorized, userId}, (err, wikis) => {
      if(err){
        res.redirect(500, "static/index");
      } else{
        res.render("wikis/index", {wikis});
      }
    });
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if(authorized){
      res.render("wikis/new");
    } else {
      req.flash("notice, Please log in or sign up to proceed")
      res.redirect("/wikis/index");
    }
  },

  create(req, res, next){
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: false,
      userId: req.user ? req.user.id : null
    };
    const authorized = new Authorizer(req.user, newWiki).create();
    if(authorized){
      wikiQueries.createWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else{
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice, You are not authorized to do that");
      res.redirect("/wikis/index");
    }
  },

  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        console.log(err);
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).show();
        if(authorized) {
          wiki.body = markdown.toHTML(wiki.body);
          res.render("wikis/show", {wiki});
        }
        else {
          res.redirect("/wikis");
        }
      }
    });
  },

  destroy(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized){
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
          if(err){
            res.redirect(500, `/wikis/${req.params.id}`)
          } else {
            res.redirect(303, "/wikis")
          }
        });
      } else {
        req.flash("notice, You are not authorized to delete");
        res.redirect("/wikis/index");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      const authorized = new Authorizer(req.user, wiki).edit();
      if(authorized){
        wiki.getCollaborators()
        .then((collaborators) => {
          User.findAll()
          .then((users) => {
            if(err || wiki == null){
              res.redirect("/wikis/index");
            } else {
              collaborators = collaborators.map(c => c.id)
              res.render("wikis/edit", {wiki, users, collaborators});
            }
          });
        });
      } else {
        req.flash("notice, You need to be logged in to do that");
        res.redirect("/wikis/index");
      }
    });
  },

  update(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || !wiki){
        console.log(err);
      } else {
        const authorized = new Authorizer(req.user, wiki).update();
        if(authorized){
          if(req.body.private && wiki.userId == req.user.id && req.user.role == User.roles.standard) {
            req.body.private = false;
          }
          wikiQueries.updateWiki(wiki.id, req.body, (err, wiki) => {
            if(err || !wiki){
              res.redirect(401, `/wikis/${req.params.id}/edit`);
            } else {
              res.redirect(`/wikis/${req.params.id}`);
            }
          });
        } else {
          req.flash("notice, You are not authorized to do that");
          res.redirect("/wikis");
        }
      }
    });
  }
};
