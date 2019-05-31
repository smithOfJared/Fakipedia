module.exports = {
  validateUsers(req, res, next) {
    console.log("We are validating");
    if(req.method === "POST") {
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    }
    const errors = req.validationErrors();
    if (errors) {
      console.log("an error was hit ", errors);
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }
}
