const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const userQueries = require("../../src/db/queries.users.js");

describe("userQueries", () => {
  beforeEach((done) => {
      sequelize.sync({force: true})
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  describe("#upgradeUser()", () => {
    it("should upgrade user role from standard to premium role.", (done) => {
      User.create({
        email: "upgradeuser@gmail.com",
        password: "thisIsAPassword",
        role: 0
      })
      .then((user) => {
        userQueries.upgradeUser(user, (err, user) => {
          expect(err).toBe(null);
          expect(user.role).toBe(2);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#downgradeUser()", () => {
    it("should downdgrade user role from premium to standard role.", (done) => {
      User.create({
        email: "upgradeuser@gmail.com",
        password: "thisIsAPassword",
        role: 2
      })
      .then((user) => {
        userQueries.downgradeUser(user, (err, user) => {
          expect(err).toBe(null);
          expect(user.role).toBe(0);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});
