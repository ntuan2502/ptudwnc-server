const siteRouter = require("./site");
const authRouter = require("./auth");
const coursesRouter = require("./courses");
const usersRouter = require("./users");

function route(app) {
  app.use("/users", usersRouter);
  app.use("/courses", coursesRouter);
  app.use("/auth", authRouter);
  app.use("/", siteRouter);
}

module.exports = route;
