// Storage boundary.
// Today: an in-memory Map with seed data.
// When replaced with Prisma, only the internals below change:
//   findAll -> prisma.post.findMany
//   findById -> prisma.post.findUnique
//   create -> prisma.post.create (the database generates the id)
//   update -> prisma.post.update, returning null if not found
//   remove -> prisma.post.delete, returning false if not found
// The five exported functions and their return values stay the same.
// Services never touch the storage or the id counter directly.

const store = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function findAll() {
  return Array.from(store.values(), p => ({ ...p }));
}

function findById(id) {
  const found = store.get(id);
  return found ? { ...found } : null;
}

function create(fields) {
  const record = { id: nextId++, ...fields };
  store.set(record.id, record);
  return { ...record };
}

function update(id, patch) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  store.set(id, updated);
  return { ...updated };
}

function remove(id) {
  return store.delete(id);
}

module.exports = { findAll, findById, create, update, remove };