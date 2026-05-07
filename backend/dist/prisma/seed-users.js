"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('Password123!', 10);
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
//# sourceMappingURL=seed-users.js.map