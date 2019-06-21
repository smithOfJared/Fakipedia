const AppPolicy = require("./application");

module.exports = class WikiPolicy extends AppPolicy {
  index(){
    return this._isAdmin() || this._isPremiumUser();
  }
  destroy(){
    return this._isOwner() || this._isAdmin();
  }
  edit(){
    return this.user && this._hasRequiredRole() || this._isCollaborator();
  }
  update(){
    return (this.record.Collaborators ? this._isCollaborator() : true) || this._hasRequiredRole();
    // undefined for some reason ^
  }
  create(){
    return this.user && this._hasRequiredRole();
  }
  new(){
    return !!this.user;
  }
  show(){
    return this._hasRequiredRole() || this._isCollaborator();
  }
  _isPrivate(){
    return this.record.private;
  }
  _hasRequiredRole(){
    return !this._isPrivate() || this._isAdmin() || this._isPremiumUser();// undefined for some reason
  }
  _isCollaborator(){
    return this.record.Collaborators.map(c => c.id).includes(this.user.id);
  }
};
