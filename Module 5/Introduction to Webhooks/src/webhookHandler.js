const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

// In-memory store of event ids we have already processed
const _processedIds = new Set();

function handleWebhook(req, res) {
  // 1. Verify HMAC-SHA256 signature
  const header = req.headers['x-webhook-signature'];
  if (!header || !header.startsWith('sha256=')) {
    return res.status(401).json({ error: 'Missing or malformed signature' });
  }

  const received = Buffer.from(header.slice('sha256='.length), 'hex');
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body) // raw Buffer, not a parsed object
    .digest();

  // timingSafeEqual throws if lengths differ, so check lengths first
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse the body only after verification
  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // 3. Idempotency: skip events we've already seen
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // 4. Mark as processed before handling
  _processedIds.add(event.id);

  // 5. Acknowledge fast, then process after the response is sent
  res.status(200).json({ status: 'received' });
  setImmediate(() => handleEvent(event));
}

module.exports = { handleWebhook, _processedIds };