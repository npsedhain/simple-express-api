const file = require("../file");
let loggedIn = [];

file.read("loggedUser.json", (err, success) => {
  if (err) {
    console.log("error while loading loggedUser");
  } else if (success) {
    return (loggedIn = JSON.parse(success));
  }
});

module.exports = function(req, res, next) {
  if (loggedIn[0].id === parseInt(req.query.id)) {
    next();
  } else {
    res.status(400).json({
      err: "you are not authorized to perform this action"
    });
  }
};
