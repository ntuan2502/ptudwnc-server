const siteRouter = require("./site");
const authRouter = require("./auth");
const coursesRouter = require("./courses");

function route(app) {
  app.use("/courses", coursesRouter);
  app.use("/auth", authRouter);
  app.use("/", siteRouter);
}

module.exports = route;
