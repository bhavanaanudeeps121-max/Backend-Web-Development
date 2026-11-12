'use strict';

const rateLimit = require('express-rate-limit');

// For multiple instances behind a load balancer, replace the default in-memory
// store with a shared rate-limit-redis store so every instance uses one counter.
// The in-memory store keeps separate counters per instance, allowing clients to
// exceed the intended limit by being distributed across instances.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    res.setHeader('Retry-After', '900');
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
