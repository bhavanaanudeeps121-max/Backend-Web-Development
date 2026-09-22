function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: 'This route does not exist' }
  });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err); // full details (stack, message) stay server-side only

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status === 500
    ? 'Something went wrong. Please try again later.'
    : err.message;

  res.status(status).json({ error: { code, message } });
}

module.exports = { notFoundHandler, errorHandler };