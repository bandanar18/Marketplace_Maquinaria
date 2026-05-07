const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log('SAMPLE PRODUCTS:');
  for (const p of products) {
    console.log(`- ID: ${p.id}, Title: ${p.title}`);
    const found = await prisma.product.findUnique({ where: { id: p.id } });
    console.log(`  Verify findUnique: ${found ? 'FOUND' : 'NOT FOUND'}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
