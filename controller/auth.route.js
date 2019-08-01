const router = require("express").Router();
const file = require("../file");
const isLoggedIn = require("../middlewares/isLoggedIn");
let loggedIn = [];

file.read("loggedUser.json", (err, success) => {
  if (err) {
    console.log("error while loading loggedUser");
  } else if (success) {
    return (loggedIn = JSON.parse(success));
  }
});

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

  router.route("/login").post((req, res, next) => {
    // console.log("users logged: ", loggedIn);
    if (!loggedIn.length) {
      if (users.length) {
        const user = users.find(user => user.username === req.body.username);
        if (user) {
          if (user.username !== loggedIn.username) {
            if (req.body.password === user.password) {
              loggedIn.pop();
              loggedIn.push(user);
              const content = JSON.stringify(loggedIn);
              file.write("loggedUser.json", content, (err, success) => {
                if (err) {
                  return res.status(400).json({
                    err: "couldn't log in"
                  });
                }
                res.status(200).json({
                  success: "user logged in successfully"
                });
              });
            } else {
              res.json({
                err: "password is incorrect"
              });
            }
          } else {
            res.json({
              err:
                "user is already logged in, logout to log into another account"
            });
          }
        } else {
          res.json({
            err: "username or password is incorrect"
          });
        }
      } else {
        res.json({
          err: "you must be registered first"
        });
      }
    } else {
      res.status(400).json({
        err: "another account is logged in, logout from that and try again!"
      });
    }
  });

  router.route("/logout").get(isLoggedIn, (req, res, next) => {
    if (loggedIn.length) {
      loggedIn.pop();
      const content = JSON.stringify(loggedIn);
      file.write("loggedUser.json", content, (err, success) => {
        if (err) {
          return res.status(400).json({
            err: "couldn't log out!"
          });
        }
        res.status(200).json({
          success: "user logged out successfully"
        });
      });
    } else {
      res.json({
        err: "no accounts are logged in"
      });
    }
  });
  return router;
};
