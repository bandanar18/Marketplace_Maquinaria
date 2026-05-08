import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerClient(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        googleId: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        country: string;
        city: string;
        companyId: string | null;
        companyRole: import(".prisma/client").$Enums.CompanyRole | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    registerCompany(dto: RegisterCompanyDto): Promise<{
        user: {
            id: string;
            email: string;
            googleId: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            country: string;
            city: string;
            companyId: string | null;
            companyRole: import(".prisma/client").$Enums.CompanyRole | null;
            emailVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        company: {
            id: string;
            email: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            phone: string;
            country: string;
            city: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            taxId: string;
            logoUrl: string | null;
            coverUrl: string | null;
            description: string;
            website: string | null;
            address: string;
            openingHours: import("@prisma/client/runtime/library").JsonValue | null;
            socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            plan: import(".prisma/client").$Enums.PlanType;
            planExpiresAt: Date | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            companyId: string | null;
            companyRole: import(".prisma/client").$Enums.CompanyRole | null;
            company: {
                id: string;
                name: string;
                slug: string;
            } | null;
        };
    }>;
}
