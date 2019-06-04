module.exports = class AppPolicy {
  constructor(User, record) {
    this.user = user;
    this.record = record;
  }

  _isStandardUser() {
    return this.user && this.user.role === 0;
  }

  _isAdmin() {
    return this.user && this.user.role === 1;
  }

  _isPremiumUser() {
    return this.user && this.user.role === 2;
  }

  _isOwner() {
    return this.record && this.record.userId == this.user.id;
  }
};
