module.exports = function(req, res, next) {
  if (!req.body.username) {
    return res.status(404).json({
      err: "username is not provided"
    });
  } else if (!req.body.password) {
    return res.status(404).json({
      err: "password is not provided"
    });
  } else if (req.body.username.length < 3) {
    return res.status(400).json({
      err: "length of the username provided should be more than 3"
    });
  }
  next();
};
