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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerClient(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                country: dto.country,
                city: dto.city,
                role: 'CLIENT',
                status: 'ACTIVE',
            },
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async registerCompany(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const baseSlug = dto.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let count = 1;
        while (await this.prisma.company.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const [user, company] = await this.prisma.$transaction(async (prisma) => {
            const newCompany = await prisma.company.create({
                data: {
                    slug,
                    name: dto.companyName,
                    taxId: dto.taxId,
                    email: dto.email,
                    phone: dto.phone,
                    country: dto.country,
                    city: dto.city,
                    address: dto.address,
                    description: dto.description,
                    logoUrl: dto.logoUrl,
                    status: 'PENDING_REVIEW',
                },
            });
            if (dto.registrationDocumentUrl) {
                await prisma.companyDocument.create({
                    data: {
                        companyId: newCompany.id,
                        name: 'Registration Document',
                        url: dto.registrationDocumentUrl,
                    }
                });
            }
            if (dto.representativeDocumentUrl) {
                await prisma.companyDocument.create({
                    data: {
                        companyId: newCompany.id,
                        name: 'Representative Document',
                        url: dto.representativeDocumentUrl,
                    }
                });
            }
            const nameParts = dto.representativeName.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            const newUser = await prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    firstName,
                    lastName,
                    phone: dto.phone,
                    country: dto.country,
                    city: dto.city,
                    role: 'COMPANY_MEMBER',
                    status: 'ACTIVE',
                    companyId: newCompany.id,
                    companyRole: 'OWNER',
                },
            });
            return [newUser, newCompany];
        });
        const { passwordHash: _, ...result } = user;
        return { user: result, company };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { company: true }
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('User is suspended or banned');
        }
        if (user.status === 'PENDING_VERIFICATION') {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        if (user.role === 'COMPANY_MEMBER' && user.company?.status === 'REJECTED') {
            throw new common_1.UnauthorizedException('Your company application was rejected');
        }
        const payload = { sub: user.id, email: user.email, role: user.role, companyId: user.companyId };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                companyId: user.companyId,
                companyRole: user.companyRole,
                company: user.company ? { id: user.company.id, name: user.company.name, slug: user.company.slug } : null,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map