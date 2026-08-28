module.exports = function timing(req, res, next) {
  const start = Date.now();
  const { method, path } = req;   // capture now, before router strips it

  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
    console.log(`${shortId}${method} ${path} took ${elapsed}ms`);
  });

  next();
};