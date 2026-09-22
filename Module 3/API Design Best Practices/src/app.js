const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/posts', postRoutes);
  app.get('/internal-error', controller.explode);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;
  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = { createApp, resetData };