function sendData(res, data, meta) {
  const body = meta ? { data, meta } : { data };
  return res.status(200).json(body);
}

function sendCreated(res, data) {
  return res.status(201).json({ data });
}

module.exports = {
  sendData,
  sendCreated
};