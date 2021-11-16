require("dotenv").config();
require("express-async-errors");
// const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");

var methodOverride = require("method-override");
const app = express();
const db = require("./config/db");
const route = require("./routers");
const port = 3000;

app.use(morgan("combined"));
app.use(methodOverride("_method"));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

require("./authenticate");
db.connect();
route(app);


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
