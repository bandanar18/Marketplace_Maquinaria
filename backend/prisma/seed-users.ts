import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  // 1. Crear SuperAdmin
  await prisma.user.upsert({
    where: { email: 'superadmin@maquinaria.local' },
    update: {},
    create: {
      email: 'superadmin@maquinaria.local',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'Global',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      country: 'Colombia',
      city: 'Bogotá',
    },
  });

  // 2. Crear Cliente
  await prisma.user.upsert({
    where: { email: 'cliente.demo@maquinaria.local' },
    update: {},
    create: {
      email: 'cliente.demo@maquinaria.local',
      passwordHash: password,
      firstName: 'Juan',
      lastName: 'Cliente',
      role: 'CLIENT',
      status: 'ACTIVE',
      country: 'Colombia',
      city: 'Medellín',
    },
  });

  // 3. Crear Empresa de Prueba
  const company = await prisma.company.upsert({
    where: { slug: 'maquinaria-demo' },
    update: {},
    create: {
      name: 'Maquinaria Demo S.A.',
      slug: 'maquinaria-demo',
      taxId: '900123456-1',
      description: 'Empresa líder en maquinaria pesada para construcción.',
      email: 'contacto@maquinariademo.com',
      phone: '+57 300 123 4567',
      country: 'Colombia',
      city: 'Bogotá',
      address: 'Calle 100 #15-20',
      status: 'ACTIVE',
    },
  });

  // 4. Crear Usuario Empresa vinculado
  await prisma.user.upsert({
    where: { email: 'empresa.demo@maquinaria.local' },
    update: {},
    create: {
      email: 'empresa.demo@maquinaria.local',
      passwordHash: password,
      firstName: 'Carlos',
      lastName: 'Empresa',
      role: 'COMPANY_MEMBER',
      companyRole: 'OWNER',
      status: 'ACTIVE',
      companyId: company.id,
      country: 'Colombia',
      city: 'Bogotá',
    },
  });

  console.log('✅ Usuarios de prueba creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
