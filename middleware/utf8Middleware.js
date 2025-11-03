const utf8Middleware = (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
};

module.exports = utf8Middleware;