module.exports = function logger(req, res, next) {
  const { method, path } = req;   // capture now, before router strips it

  res.on('finish', () => {
    const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
    console.log(`${shortId}${method} ${path} ${res.statusCode}`);
  });

  next();
};