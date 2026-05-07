const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, title: true, availability: true } });
  console.log('PRODUCTS AVAILABILITY:');
  products.forEach(p => console.log(`- [${p.availability}] ${p.title}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
