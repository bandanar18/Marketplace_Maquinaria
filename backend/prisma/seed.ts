import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const TEST_PASSWORD = 'Password123!';

async function main() {
  console.log('Seeding categories...');
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  // Level 1
  const vehiculos = await prisma.category.upsert({
    where: { slug: 'vehiculos-pesados' },
    update: {},
    create: {
      name: 'Vehículos Pesados',
      slug: 'vehiculos-pesados',
      description: 'Camiones, tractomulas y transporte pesado',
      order: 1,
      level: 1,
    },
  });

  const construccion = await prisma.category.upsert({
    where: { slug: 'construccion' },
    update: {},
    create: {
      name: 'Construcción',
      slug: 'construccion',
      description: 'Maquinaria amarilla y equipos de construcción',
      order: 2,
      level: 1,
    },
  });

  // Level 2
  const camiones = await prisma.category.upsert({
    where: { slug: 'camiones' },
    update: {},
    create: {
      name: 'Camiones',
      slug: 'camiones',
      parentId: vehiculos.id,
      order: 1,
      level: 2,
    },
  });

  const excavadoras = await prisma.category.upsert({
    where: { slug: 'excavadoras' },
    update: {},
    create: {
      name: 'Excavadoras',
      slug: 'excavadoras',
      parentId: construccion.id,
      order: 1,
      level: 2,
    },
  });

  const cargadores = await prisma.category.upsert({
    where: { slug: 'cargadores-frontales' },
    update: {},
    create: {
      name: 'Cargadores Frontales',
      slug: 'cargadores-frontales',
      parentId: construccion.id,
      order: 2,
      level: 2,
    },
  });

  const gruas = await prisma.category.upsert({
    where: { slug: 'gruas' },
    update: {},
    create: {
      name: 'Grúas',
      slug: 'gruas',
      parentId: construccion.id,
      order: 3,
      level: 2,
    },
  });

  const compactacion = await prisma.category.upsert({
    where: { slug: 'compactacion' },
    update: {},
    create: {
      name: 'Compactación',
      slug: 'compactacion',
      parentId: construccion.id,
      order: 4,
      level: 2,
    },
  });

  console.log('Categories seeded successfully');

  console.log('Seeding users and company...');

  await prisma.user.upsert({
    where: { email: 'cliente.demo@maquinaria.local' },
    update: {
      passwordHash,
      status: 'ACTIVE',
      role: 'CLIENT',
    },
    create: {
      email: 'cliente.demo@maquinaria.local',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Comprador',
      phone: '+57 300 111 2233',
      country: 'Colombia',
      city: 'Bogotá',
      role: 'CLIENT',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@maquinaria.local' },
    update: {
      passwordHash,
      status: 'ACTIVE',
      role: 'SUPERADMIN',
    },
    create: {
      email: 'superadmin@maquinaria.local',
      passwordHash,
      firstName: 'Sofía',
      lastName: 'Superadmin',
      phone: '+57 300 999 0000',
      country: 'Colombia',
      city: 'Medellín',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  const company = await prisma.company.upsert({
    where: { slug: 'andina-maquinaria' },
    update: {
      status: 'ACTIVE',
      verifiedAt: new Date(),
      plan: 'PROFESSIONAL',
    },
    create: {
      slug: 'andina-maquinaria',
      name: 'Andina Maquinaria S.A.S.',
      taxId: '900123456-7',
      description: 'Empresa proveedora de maquinaria pesada para construcción, minería y logística.',
      website: 'https://andina-maquinaria.example.com',
      phone: '+57 604 555 0101',
      email: 'empresa.demo@maquinaria.local',
      country: 'Colombia',
      city: 'Medellín',
      address: 'Carrera 50 # 12-34, Zona Industrial',
      status: 'ACTIVE',
      verifiedAt: new Date(),
      plan: 'PROFESSIONAL',
    },
  });

  await prisma.user.upsert({
    where: { email: 'empresa.demo@maquinaria.local' },
    update: {
      passwordHash,
      status: 'ACTIVE',
      role: 'COMPANY_MEMBER',
      companyId: company.id,
      companyRole: 'OWNER',
    },
    create: {
      email: 'empresa.demo@maquinaria.local',
      passwordHash,
      firstName: 'Laura',
      lastName: 'Empresaria',
      phone: '+57 301 222 3344',
      country: 'Colombia',
      city: 'Medellín',
      role: 'COMPANY_MEMBER',
      status: 'ACTIVE',
      companyId: company.id,
      companyRole: 'OWNER',
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Users and company seeded successfully');

  console.log('Seeding machinery products...');

  const machinery = [
    {
      title: 'Excavadora Caterpillar 320 GC',
      slug: 'excavadora-caterpillar-320-gc',
      categoryId: excavadoras.id,
      brand: 'Caterpillar',
      model: '320 GC',
      year: 2021,
      condition: 'USED' as const,
      price: 142000,
      availability: 'IN_STOCK' as const,
      city: 'Medellín',
      specs: { horas: 3200, pesoOperativoTon: 22, potenciaHp: 146 },
    },
    {
      title: 'Retroexcavadora JCB 3CX',
      slug: 'retroexcavadora-jcb-3cx',
      categoryId: excavadoras.id,
      brand: 'JCB',
      model: '3CX',
      year: 2020,
      condition: 'USED' as const,
      price: 78000,
      availability: 'IN_STOCK' as const,
      city: 'Bogotá',
      specs: { horas: 2800, traccion: '4x4', potenciaHp: 92 },
    },
    {
      title: 'Cargador Frontal Volvo L90H',
      slug: 'cargador-frontal-volvo-l90h',
      categoryId: cargadores.id,
      brand: 'Volvo',
      model: 'L90H',
      year: 2022,
      condition: 'USED' as const,
      price: 168000,
      availability: 'IN_STOCK' as const,
      city: 'Cali',
      specs: { capacidadCucharonM3: 2.7, horas: 1600, potenciaHp: 186 },
    },
    {
      title: 'Bulldozer Komatsu D65EX',
      slug: 'bulldozer-komatsu-d65ex',
      categoryId: construccion.id,
      brand: 'Komatsu',
      model: 'D65EX',
      year: 2019,
      condition: 'USED' as const,
      price: 155000,
      availability: 'QUOTE_ONLY' as const,
      city: 'Barranquilla',
      specs: { horas: 4100, hoja: 'PAT', potenciaHp: 217 },
    },
    {
      title: 'Motoniveladora John Deere 670G',
      slug: 'motoniveladora-john-deere-670g',
      categoryId: construccion.id,
      brand: 'John Deere',
      model: '670G',
      year: 2021,
      condition: 'USED' as const,
      price: 188000,
      availability: 'IN_STOCK' as const,
      city: 'Bucaramanga',
      specs: { horas: 2400, anchoHojaFt: 12, potenciaHp: 185 },
    },
    {
      title: 'Grúa Móvil Liebherr LTM 1030',
      slug: 'grua-movil-liebherr-ltm-1030',
      categoryId: gruas.id,
      brand: 'Liebherr',
      model: 'LTM 1030',
      year: 2018,
      condition: 'USED' as const,
      price: 245000,
      availability: 'ON_ORDER' as const,
      city: 'Cartagena',
      specs: { capacidadTon: 35, plumaM: 30, kilometraje: 54000 },
    },
    {
      title: 'Minicargador Bobcat S650',
      slug: 'minicargador-bobcat-s650',
      categoryId: cargadores.id,
      brand: 'Bobcat',
      model: 'S650',
      year: 2023,
      condition: 'NEW' as const,
      price: 62000,
      availability: 'IN_STOCK' as const,
      city: 'Medellín',
      specs: { capacidadKg: 1220, potenciaHp: 74, cabina: 'Cerrada con A/C' },
    },
    {
      title: 'Compactador Dynapac CA2500D',
      slug: 'compactador-dynapac-ca2500d',
      categoryId: compactacion.id,
      brand: 'Dynapac',
      model: 'CA2500D',
      year: 2020,
      condition: 'USED' as const,
      price: 71000,
      availability: 'IN_STOCK' as const,
      city: 'Pereira',
      specs: { pesoTon: 11, anchoTamborMm: 2130, horas: 1900 },
    },
    {
      title: 'Camión Volqueta International HV',
      slug: 'camion-volqueta-international-hv',
      categoryId: camiones.id,
      brand: 'International',
      model: 'HV',
      year: 2022,
      condition: 'USED' as const,
      price: 132000,
      availability: 'IN_STOCK' as const,
      city: 'Bogotá',
      specs: { capacidadM3: 14, kilometraje: 38000, motor: 'Cummins L9' },
    },
    {
      title: 'Plataforma Elevadora Genie S-65',
      slug: 'plataforma-elevadora-genie-s-65',
      categoryId: gruas.id,
      brand: 'Genie',
      model: 'S-65',
      year: 2021,
      condition: 'REFURBISHED' as const,
      price: 84000,
      availability: 'IN_STOCK' as const,
      city: 'Medellín',
      specs: { alturaTrabajoM: 21.8, alcanceHorizontalM: 17.1, horas: 1300 },
    },
  ];

  for (const item of machinery) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: `${item.title} disponible para venta. Equipo revisado, con documentación al día y soporte comercial de Andina Maquinaria.`,
        categoryId: item.categoryId,
        brand: item.brand,
        model: item.model,
        year: item.year,
        condition: item.condition,
        price: item.price,
        currency: 'USD',
        isNegotiable: true,
        availability: item.availability,
        specs: item.specs,
        country: 'Colombia',
        city: item.city,
        companyId: company.id,
        status: 'ACTIVE',
        publishedAt: new Date(),
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: `${item.title} disponible para venta. Equipo revisado, con documentación al día y soporte comercial de Andina Maquinaria.`,
        categoryId: item.categoryId,
        brand: item.brand,
        model: item.model,
        year: item.year,
        condition: item.condition,
        price: item.price,
        currency: 'USD',
        isNegotiable: true,
        availability: item.availability,
        specs: item.specs,
        country: 'Colombia',
        city: item.city,
        companyId: company.id,
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            {
              url: `https://placehold.co/900x600?text=${encodeURIComponent(item.title)}`,
              order: 0,
            },
          ],
        },
        tags: {
          create: [{ name: item.brand }, { name: 'maquinaria' }, { name: item.condition.toLowerCase() }],
        },
      },
    });
  }

  console.log('Machinery products seeded successfully');
  console.log(`Test password for seeded users: ${TEST_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
