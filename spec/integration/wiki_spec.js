// const request = require("request");
// const server = require("../../src/server");
// const base = "http://localhost:3000/users/";
// const User = require("../../src/db/models").User;
// const sequelize = require("../../src/db/models/index").sequelize;
// const Wiki = require("../../src/db/models").Wiki;
//
// describe("routes : wikis", () => {
//   beforeEach((done) => {
//     this.wiki;
//     sequelize.sync({ force: true }).then(() => {
//       Wiki.create({
//         title: "test wiki",
//         body: "this is a test wiki, deal with it",
//         private: true
//       })
//       .then((res) => {
//         this.wiki = res;
//         done();
//       })
//       .catch((err) => {
//         console.log(err);
//         done();
//       })
//     })
//   });
//
//   describe("GET /wikis", () => {
//       it("should respond with all of the wikis", (done) => {
//         request.get(base, (err, res, body) => {
//           expect(err).toBeNull();
//           expect(title).toContain("test wiki");
//           expect(body).toContain("this is a test wiki, deal with it");
//           expect(private).toBe(true);
//           done();
//         });
//       });
//     });
//
//     describe("GET /wikis/new", () => {
//       it("should render a view with a new wiki form", (done) => {
//         request.get(`${base}new`, (err, res, body) => {
//           expect(err).toBeNull();
//           expect(body).toContain("New Wiki");
//           done();
//         });
//       });
//     });
//
//     describe("POST /wikis/create", () => {
//       const options = {
//         url: `${base}create`,
//         form: {
//           title: "Malazan series",
//           description: "It's a doozy, that's for sure"
//         }
//       };
//
//       it("should create a new wiki and redirect", (done) => {
//         request.post(options,
//           (err, res, body) => {
//             Wiki.findOne({where: {title: "Malazan series"}})
//             .then((wiki) => {
//               expect(wiki.title).toBe("Malazan series");
//               expect(wiki.description).toBe("It's a doozy, that's for sure");
//               done();
//             })
//             .catch((err) => {
//               console.log(err);
//               done();
//             });
//           }
//         );
//       });
//     });
//
//     describe("GET /wikis/:id", () => {
//       it("should render a view with the selected wiki", (done) => {
//         request.get(`${base}${this.wiki.id}`, (err, res, body) => {
//           expect(err).toBeNull();
//           expect(body).toContain("test wiki");
//           done();
//         });
//       });
//     });
//
//     describe("POST /wikis/:id/destroy", () => {
//       it("should delete the wiki with the associated ID", (done) => {
//         Wiki.all()
//         .then((wikis) => {
//           const wikiCountBeforeDelete = wikis.length;
//           expect(wikiCountBeforeDelete).toBe(1);
//           request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
//             Wiki.all()
//             .then((wikis) => {
//               expect(err).toBeNull();
//               expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
//               done();
//             })
//           });
//         })
//       });
//     });
//
//     describe("GET /wikis/:id/edit", () => {
//       it("should render a view with an edit wiki form", (done) => {
//         request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
//           expect(err).toBeNull();
//           expect(body).toContain("Edit Wiki");
//           expect(body).toContain("this is a test wiki, deal with it");
//           done();
//         });
//       });
//     });
//
//     describe("POST /wikis/:id/update", () => {
//       it("should update the wiki with the given values", (done) => {
//         request.post({
//           url: `${base}${this.wiki.id}/update`,
//           form: {
//             title: "test wiki",
//             description: "this is a test wiki, deal with it"
//           }
//         }, (err, res, body) => {
//           expect(err).toBeNull();
//           Wiki.findOne({
//             where: {id:1}
//           })
//           .then((wiki) => {
//             expect(wiki.title).toBe("updated test wiki");
//             done();
//           });
//         });
//       });
//     });
//
// });
