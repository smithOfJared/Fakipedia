
const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("../sgMail/sgMail.js");

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
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {...result});
      }
    });
  }
}
