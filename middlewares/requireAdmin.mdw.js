module.exports = function(req, res, next) {
  if(req.user.type === 0) {
    next();
  } else {
    res.setHeader('Content-type', 'application/json');
    res.status(403).json({ status: "fail", message: "You are not authorized to access this resource" });
  }
}