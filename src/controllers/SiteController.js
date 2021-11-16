class SiteController {
  index(req, res, next) {
    res.send("Hello world!");
  }
}

module.exports = new SiteController();
