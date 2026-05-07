const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.findFirst({ where: { name: { contains: 'Andina' } } });
  console.log('COMPANY:', company.id, company.name);
  
  const products = await prisma.product.findMany({ 
    where: { companyId: company.id } 
  });
  
  console.log(`PRODUCTS (${products.length}):`);
  products.forEach(p => console.log(`- ID: ${p.id}, Title: ${p.title}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
