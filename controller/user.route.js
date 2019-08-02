const router = require("express").Router();
const file = require("../file");
const validate = require("../middlewares/validateInput");
const hasAuthority = require("../middlewares/hasAuthority");
const isUser = require("../middlewares/isUser");

let users;

file.read("users.json", (err, success) => {
  if (err) {
    console.log("error while loading users");
  } else if (success) {
    return (users = JSON.parse(success));
  }
});

module.exports = function(express, app) {
  //load inbuilt middleware
  app.use(express.urlencoded({ extended: true }));

  router
    .route("/")
    .get(hasAuthority, (req, res, next) => {
      if (users) {
        res.json(users);
      } else {
        res.json({
          err: "there are no users, please post first!"
        });
      }
    })
    .post(validate, (req, res, next) => {
      if (users) {
        const user = users.find(user => user.username === req.body.username);
        if (user) {
          return res.status(400).json({
            err: "the provided username already exists"
          });
        } else {
          const newUser = {
            id: users.length + 1,
            username: req.body.username,
            password: req.body.password
          };
          users.push(newUser);
          const content = JSON.stringify(users);
          file.write("users.json", content, (err, success) => {
            if (err) {
              return console.log("error writing to the file");
            }
            console.log("success writing file");
          });
          res.json(newUser);
        }
      } else {
        const newUser = {
          id: 1,
          username: req.body.username,
          password: req.body.password
        };
        users = [];
        users.push(newUser);
        const content = JSON.stringify(users);
        file.write("users.json", content, (err, success) => {
          if (err) {
            return console.log("error writing to the file");
          }
          console.log("success writing file");
        });
        res.json(newUser);
      }
    });

  router
    .route("/:id")
    .get(hasAuthority, (req, res, next) => {
      const user = users.find(user => user.id === parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({
          err: "The user cannot be found"
        });
      }
      res.json(user);
    })
    .put(isUser, validate, (req, res, next) => {
      if (users) {
        const user = users.find(user => user.id === parseInt(req.params.id));
        if (!user) {
          return res.status(404).json({
            err: "The user cannot be found"
          });
        }
        user.name = req.body.name;
        user.password = req.body.password;
        const content = JSON.stringify(users);
        file.write("users.json", content, (err, success) => {
          if (err) {
            return console.log("error writing to the file");
          }
          console.log("success writing file");
        });
        res.json(user);
      } else {
        res.json({
          err: "There are no existing users!"
        });
      }
    })
    .delete(hasAuthority, isUser, (req, res, next) => {
      if (users) {
        const user = users.find(user => user.id === parseInt(req.params.id));
        if (!user) {
          return res.status(404).json({
            err: "The user cannot be found"
          });
        }
        const index = users.indexOf(user);
        users.splice(index, 1);
        const content = JSON.stringify(users);
        file.write("users.json", content, (err, success) => {
          if (err) {
            return console.log("error writing to the file");
          }
          console.log("success writing file");
        });
        res.json(users);
      } else {
        res.json({
          err: "There are no existing users!"
        });
      }
    });

  return router;
};
