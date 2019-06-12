const appPolicy = require("./application");

module.exports = class WikiPolicy extends appPolicy {
  index(){
    return this._isAdmin() || this._isPremiumUser();
  }
  destroy(){
    return this._isOwner() || this._isAdmin();
  }
  edit(){
    return this.user && this._hasRequiredRole();
  }
  update(){
    return this.user && this._hasRequiredRole();
  }
  create(){
    return this.user && this._hasRequiredRole();
  }
  new(){
    return !!this.user;
  }
  show() {
    return this._hasRequiredRole();
  }
  _isPrivate() {
    return this.record.private;
  }
  _hasRequiredRole() {
    return !this._isPrivate() || this._isAdmin() || this._isPremiumUser();
  }
};
