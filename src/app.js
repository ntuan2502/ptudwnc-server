require("dotenv").config();
require("express-async-errors");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");

const app = express();
const db = require("./config/db");
const route = require("./routers");
const port = 3000;

db.connect();
route(app);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const corswithOption = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


require("./authenticate");

app.use(cors(corswithOption));
app.use(passport.initialize());

app.use(morgan("dev"));
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
