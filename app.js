const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = require("./config");

//load routers
const userRouter = require("./controller/user.route")(express, app);
const authRouter = require("./controller/auth.route")(express, app);

//third party middleware
app.use(morgan("dev"));

//router level middleware
app.use("/users", userRouter);
app.use("/auth", authRouter);

//application level 404 error middleware
app.use((req, res, next) => {
  res.status(404).json({
    err: "Page not found!"
  });
});

// initializing the server
app.listen(PORT, (err, success) => {
  if (err) {
    return console.log("error occurred while starting server");
  }
  console.log(`Server listening at port ${PORT}...`);
});

//has one bug : deleted user can be logged in as well
