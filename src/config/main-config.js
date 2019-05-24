require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const flash = require("express-flash");
//const passportConfig = require("./passport-config");
// const logger = require("morgan");


module.exports = {
  init(app, express){
    app.use(bodyParser.urlencoded({ extend: true}));
    app.use(expressValidator());
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(session( {
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 }
    }));
    app.use(flash());
  //  passport.config.init(app);
    app.use((req, res, next) => {
      res.locals.notice = req.flash("notice");
      next();
    });
    // app.use(logger("dev"));
  }
};
