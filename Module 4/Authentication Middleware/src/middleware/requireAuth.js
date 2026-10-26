const jwt = require('jsonwebtoken');

const AUTH_REQUIRED_BODY = {
  error: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
  },
};

const BEARER_REGEX = /^Bearer ([^\s]+)$/i;

function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';

  const match = header.match(BEARER_REGEX);
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).json(AUTH_REQUIRED_BODY);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json(AUTH_REQUIRED_BODY);
  }
}

module.exports = requireAuth;