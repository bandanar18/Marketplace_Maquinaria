const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const venezuelaLocations = [
  { city: 'Caracas', address: 'Av. Libertador, Edif. Centro, Chacao', lat: 10.4806, lng: -66.9036 },
  { city: 'Valencia', address: 'Zona Industrial Sur, Calle 2', lat: 10.1620, lng: -68.0077 },
  { city: 'Maracaibo', address: 'Av. El Milagro, Sector La Lago', lat: 10.6427, lng: -71.6125 },
  { city: 'Barquisimeto', address: 'Av. Florencio Jiménez, Zona Industrial II', lat: 10.0678, lng: -69.3474 },
  { city: 'Maracay', address: 'Av. Las Delicias, Centro Comercial Las Américas', lat: 10.2442, lng: -67.5921 },
  { city: 'Puerto Ordaz', address: 'Av. Guayana, Unare I', lat: 8.3077, lng: -62.7108 },
  { city: 'San Cristóbal', address: 'Av. 19 de Abril, Sector Barrio Obrero', lat: 7.7669, lng: -72.2250 },
  { city: 'Lechería', address: 'Av. Principal de Lechería, Plaza Mayor', lat: 10.1861, lng: -66.7847 }
];

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Actualizando ${products.length} productos...`);

  for (const product of products) {
    const randomLoc = venezuelaLocations[Math.floor(Math.random() * venezuelaLocations.length)];
    await prisma.product.update({
      where: { id: product.id },
      data: {
        country: 'Venezuela',
        city: randomLoc.city,
        address: randomLoc.address,
        latitude: randomLoc.lat,
        longitude: randomLoc.lng
      }
    });
    console.log(`Producto [${product.title}] actualizado a ${randomLoc.city}`);
  }

  console.log('Hecho.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
