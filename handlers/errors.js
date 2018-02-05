exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.notFound = (req, res, next) => {
  const err = new Error('There is nothing here.');
  err.status = 404;
  next(err);
};

/* eslint-disable no-unused-vars */
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
};
