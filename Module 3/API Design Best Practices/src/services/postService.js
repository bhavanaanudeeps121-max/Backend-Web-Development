const store = require('../data/postStore');

function listPosts({ page = 1, limit = 2 } = {}) {
  const all = store.getAllPosts();
  const total = all.length;
  const start = (page - 1) * limit;
  const rows = all.slice(start, start + limit);
  return { rows, total };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  // no more fake "DB row missing" 500 — a missing post is just a 404,
  // decided by the controller
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.status = 500;
  err.code = 'INTERNAL_ERROR';
  throw err;
}

module.exports = { listPosts, getPost, createPost, likePost, explode };