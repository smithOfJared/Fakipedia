
const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("../sgMail/sgMail.js");
const stripe = require("stripe")("sk_test_eXa4jSxpTm89Pw4EjQ4Jc4dT003p0bGWYr");

module.exports = {
  create(req, res, next){
    console.log("It hit the controller");
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    console.log('$$$$$$ user object: ', newUser);
    userQueries.createUser(newUser, (err, user) => {
      console.log('$$$$$$$: userController ' + newUser);
      if(err){
        console.log('$$$$$$$: error in userController ' + err);
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          sgMail.userEmail(newUser.email);
          res.redirect("/");
        })
      }
    });
  },
  signUp(req, res, next){
    res.render("users/sign_up");
  },
  signInForm(req, res, next){
    res.render("users/sign_in");
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next){
    //show the collaborative wikis
    userQueries.getUser(req.params.id, (err, user) => {
      if(err){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {user});
      }
    });
  },
  upgrade(req, res, next){
    res.render("users/upgrade");
  },
  processUpgrade(req, res, next) {
    stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "premium membership purchase",
      source: req.body.stripeToken
      }, (err, charge) => {
        if(err) {
          res.redirect("/wikis/index")
        } else {
          userQueries.upgradeUser(req.params.id, (err, user) => {
            if(err) {
              console.log(err);
              req.flash("notice", "Unable to upgrade user.");
              res.render("users/upgrade");
            } else {
              res.redirect(`/users/${req.params.id}`);
            }
          });
        }
    });
  },
  downgrade(req, res, next){
    res.render("users/downgrade");
  },
  processDowngrade(req, res, next) {
    userQueries.downgradeUser(req.params.id, (err, user) => {
      if(err) {
        req.flash("notice", "Unable to downgrade user.");
        res.redirect("user/show");
      } else {
        res.redirect(`/users/${req.params.id}`)
      }
    });
  }
}
