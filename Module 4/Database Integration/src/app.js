const express = require('express');
const postController = require('./controllers/postController');

const app = express();
app.use(express.json());

app.get('/posts', postController.list);
app.get('/posts/:id', postController.get);
app.post('/posts', postController.create);
app.patch('/posts/:id', postController.update);
app.delete('/posts/:id', postController.remove);

app.use((error, req, res, next) => {
  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'A record with these values already exists' });
  }
  if (error.code === 'P2003') {
    return res.status(409).json({ error: 'This change conflicts with related data' });
  }
  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Post not found' });
  }

  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : error.message });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('API listening'));
}

module.exports = app;
