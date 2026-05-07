const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = 'cmosrciux000fe2b7nzh3h5y8';
  console.log(`SEARCHING FOR ID: [${id}]`);
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    console.log('FOUND:', product.title);
  } else {
    console.log('NOT FOUND');
    // Try finding by slug or any other way to see if ID is different
    const p = await prisma.product.findFirst({ where: { title: { contains: 'Genie' } } });
    if (p) console.log('SUGGESTED ID (for Genie):', p.id);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
