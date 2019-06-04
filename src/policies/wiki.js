const appPolicy = require("./application");

module.exports = class WikiPolicy extends AppPolicy {
  delete(){
    return this._isOwner() || this._isAdmin();
  }
};
