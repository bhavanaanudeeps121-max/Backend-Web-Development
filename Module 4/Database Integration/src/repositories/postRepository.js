const { prisma } = require('../db/prisma');

// Only these fields leave the repository, so response shapes match the starter.
const POST_FIELDS = { id: true, title: true, body: true, authorId: true };

// Non-numeric or invalid IDs should behave like "not found", not a Prisma error.
function parseId(id) {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

async function findAll() {
  return prisma.post.findMany({ select: POST_FIELDS, orderBy: { id: 'asc' } });
}

async function findById(id) {
  const postId = parseId(id);
  if (postId === null) return null;
  return prisma.post.findUnique({ where: { id: postId }, select: POST_FIELDS });
}

async function create(fields) {
  return prisma.post.create({
    data: { title: fields.title, body: fields.body || '', authorId: fields.authorId },
    select: POST_FIELDS,
  });
}

async function update(id, patch) {
  const postId = parseId(id);
  if (postId === null) return null;

  const data = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  try {
    return await prisma.post.update({ where: { id: postId }, data, select: POST_FIELDS });
  } catch (error) {
    if (error.code === 'P2025') return null; // record not found
    throw error;
  }
}

async function remove(id) {
  const postId = parseId(id);
  if (postId === null) return false;

  try {
    await prisma.post.delete({ where: { id: postId } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false; // record not found
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };