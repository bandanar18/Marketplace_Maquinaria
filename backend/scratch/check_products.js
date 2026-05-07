const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'empresa.demo@maquinaria.local' },
    include: { company: true }
  });

  console.log('USER:', {
    email: user.email,
    companyId: user.companyId,
    companyName: user.company?.name
  });

  if (user.companyId) {
    const products = await prisma.product.findMany({
      where: { companyId: user.companyId }
    });
    console.log(`PRODUCTS COUNT: ${products.length}`);
    products.forEach(p => console.log(`- [${p.status}] ${p.title}`));
  } else {
    console.log('USER HAS NO COMPANY');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
