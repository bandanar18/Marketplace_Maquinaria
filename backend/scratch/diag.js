const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { email: true, role: true, companyId: true }
  });
  console.log('Users:', users);
  
  // Test bcrypt
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('testpassword', salt);
  const isValid = await bcrypt.compare('testpassword', hash);
  console.log('Bcrypt test:', isValid);
}

main().catch(console.error).finally(() => prisma.$disconnect());
