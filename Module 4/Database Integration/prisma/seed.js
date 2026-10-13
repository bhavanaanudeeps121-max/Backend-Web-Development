const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const ada = await prisma.user.upsert({
    where: { email: 'ada@example.com' },
    update: {},
    create: { name: 'Ada', email: 'ada@example.com' },
  });

  const posts = [
    { id: 1, title: 'First post', body: 'The contract survives storage changes.' },
    { id: 2, title: 'Second post', body: 'Migrations record database design.' },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: { ...post, authorId: ada.id },
    });
  }

  // Explicit IDs don't advance the autoincrement sequence, so reset it manually.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Post"', 'id'), (SELECT MAX(id) FROM "Post"))`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());