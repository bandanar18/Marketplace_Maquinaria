const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'andina-maquinaria';
  const query = {};

  const company = await prisma.company.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });

  if (!company || company.status !== 'ACTIVE') {
    throw new Error('Company not found');
  }

  const page  = query.page  ? parseInt(query.page,  10) : 1;
  const limit = query.limit ? parseInt(query.limit, 10) : 20;
  const skip  = (page - 1) * limit;

  const where = {
    companyId: company.id,
    status: 'ACTIVE',
  };

  if (query.categoryId) where.categoryId = query.categoryId;

  if (query.search) {
    where.OR = [
      { title:       { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { brand:       { contains: query.search, mode: 'insensitive' } },
      { model:       { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.type === 'sale') {
    where.transactionType = { in: ['SALE', 'BOTH'] };
  } else if (query.type === 'rent') {
    where.transactionType = { in: ['RENTAL', 'BOTH'] };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  let orderBy = { createdAt: 'desc' };
  if (query.sort === 'price_asc')  orderBy = { price: 'asc'  };
  if (query.sort === 'price_desc') orderBy = { price: 'desc' };
  if (query.sort === 'oldest')     orderBy = { createdAt: 'asc' };
  if (query.sort === 'views')      orderBy = { viewsCount: 'desc' };

  try {
    const [items, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images:   { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        where: {
          products: {
            some: { companyId: company.id, status: 'ACTIVE' },
          },
        },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
    ]);
    console.log('Success:', { itemsCount: items.length, total, categoriesCount: categories.length });
  } catch (error) {
    console.error('Prisma Error:', error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
