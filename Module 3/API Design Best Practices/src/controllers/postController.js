const service = require('../services/postService');
const http = require('../utils/http');
const ApiError = require('../utils/ApiError');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 10;

function parsePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);
  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_LIMIT;
  limit = Math.min(limit, MAX_LIMIT);
  return { page, limit };
}

function listPosts(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const { rows, total } = service.listPosts({ page, limit });
    const hasMore = page * limit < total;
    return http.sendData(res, rows, { page, limit, total, hasMore });
  } catch (err) {
    return next(err);
  }
}

function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);
    if (!post) throw new ApiError(404, 'POST_NOT_FOUND', 'Post not found');
    return http.sendData(res, post);
  } catch (err) {
    return next(err);
  }
}

function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);
    return http.sendCreated(res, post);
  } catch (err) {
    return next(err);
  }
}

function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);
    if (!post) throw new ApiError(404, 'POST_NOT_FOUND', 'Post not found');
    return http.sendData(res, post);
  } catch (err) {
    return next(err);
  }
}

function explode(req, res, next) {
  try {
    service.explode();
  } catch (err) {
    return next(err);
  }
}

module.exports = { listPosts, getPost, createPost, likePost, explode };