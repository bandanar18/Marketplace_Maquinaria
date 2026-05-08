import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    getMyCompany(companyId: string | null): Promise<{
        members: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            firstName: string;
            lastName: string;
            companyRole: import(".prisma/client").$Enums.CompanyRole | null;
        }[];
        images: {
            id: string;
            companyId: string;
            order: number;
            url: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        taxId: string;
        logoUrl: string | null;
        coverUrl: string | null;
        description: string;
        website: string | null;
        phone: string;
        email: string;
        country: string;
        city: string;
        address: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.CompanyStatus;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMyCompany(companyId: string | null, userId: string, dto: UpdateCompanyDto): Promise<{
        id: string;
        slug: string;
        name: string;
        taxId: string;
        logoUrl: string | null;
        coverUrl: string | null;
        description: string;
        website: string | null;
        phone: string;
        email: string;
        country: string;
        city: string;
        address: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.CompanyStatus;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCompanyBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        logoUrl: string | null;
        description: string;
        website: string | null;
        phone: string;
        email: string;
        country: string;
        city: string;
        address: string;
        status: import(".prisma/client").$Enums.CompanyStatus;
        verifiedAt: Date | null;
        plan: import(".prisma/client").$Enums.PlanType;
        createdAt: Date;
        _count: {
            products: number;
            reviews: number;
        };
    }>;
    getCompanyProducts(slug: string, query: {
        categoryId?: string;
        search?: string;
        sort?: string;
        minPrice?: string;
        maxPrice?: string;
        type?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        items: ({
            images: {
                id: string;
                order: number;
                url: string;
                productId: string;
            }[];
            category: {
                id: string;
                slug: string;
                name: string;
            };
        } & {
            id: string;
            slug: string;
            description: string;
            country: string;
            city: string;
            address: string | null;
            status: import(".prisma/client").$Enums.ProductStatus;
            rejectionReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            brand: string;
            title: string;
            categoryId: string;
            model: string;
            year: number;
            condition: import(".prisma/client").$Enums.Condition;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            isNegotiable: boolean;
            availability: import(".prisma/client").$Enums.Availability;
            transactionType: import(".prisma/client").$Enums.TransactionType;
            pricePerDay: import("@prisma/client/runtime/library").Decimal | null;
            pricePerWeek: import("@prisma/client/runtime/library").Decimal | null;
            pricePerMonth: import("@prisma/client/runtime/library").Decimal | null;
            minRentalDays: number | null;
            depositAmount: import("@prisma/client/runtime/library").Decimal | null;
            includesOperator: boolean | null;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
            latitude: number | null;
            longitude: number | null;
            viewsCount: number;
            favoritesCount: number;
            featured: boolean;
            publishedAt: Date | null;
            brandId: string | null;
        })[];
        categories: {
            id: string;
            slug: string;
            name: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCompanyStats(companyId: string | null): Promise<{
        activeProducts: number;
        totalQuotes: number;
        totalViews: number;
        totalMessages: number;
        topProducts: {
            id: string;
            title: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            viewsCount: number;
        }[];
        statusDistribution: any;
    }>;
    getCompanyCustomers(companyId: string): Promise<any[]>;
    getAllCompanies(query: {
        search?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        items: {
            id: string;
            slug: string;
            name: string;
            logoUrl: string | null;
            coverUrl: string | null;
            description: string;
            country: string;
            city: string;
            openingHours: import("@prisma/client/runtime/library").JsonValue;
            verifiedAt: Date | null;
            _count: {
                products: number;
                reviews: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAdminCompanies(query: {
        search?: string;
        status?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        items: {
            id: string;
            slug: string;
            name: string;
            taxId: string;
            logoUrl: string | null;
            coverUrl: string | null;
            description: string;
            website: string | null;
            phone: string;
            email: string;
            country: string;
            city: string;
            address: string;
            openingHours: import("@prisma/client/runtime/library").JsonValue | null;
            socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.CompanyStatus;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            plan: import(".prisma/client").$Enums.PlanType;
            planExpiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateCompanyStatus(companyId: string, status: any, rejectionReason?: string, adminId?: string): Promise<{
        id: string;
        slug: string;
        name: string;
        taxId: string;
        logoUrl: string | null;
        coverUrl: string | null;
        description: string;
        website: string | null;
        phone: string;
        email: string;
        country: string;
        city: string;
        address: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.CompanyStatus;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCompanyPlan(companyId: string, plan: any, expiresAt?: string, adminId?: string): Promise<{
        id: string;
        slug: string;
        name: string;
        taxId: string;
        logoUrl: string | null;
        coverUrl: string | null;
        description: string;
        website: string | null;
        phone: string;
        email: string;
        country: string;
        city: string;
        address: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.CompanyStatus;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCompanyMembers(companyId: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        companyRole: import(".prisma/client").$Enums.CompanyRole | null;
    }[]>;
    getCompanyInvites(companyId: string): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.InviteStatus;
        createdAt: Date;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        expiresAt: Date;
        token: string;
    }[]>;
    inviteMember(companyId: string, email: string, role: any): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.InviteStatus;
        createdAt: Date;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        expiresAt: Date;
        token: string;
    }>;
    cancelInvite(inviteId: string, companyId: string): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.InviteStatus;
        createdAt: Date;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        expiresAt: Date;
        token: string;
    }>;
    removeMember(companyId: string, userId: string, requesterId: string): Promise<{
        id: string;
        phone: string | null;
        email: string;
        country: string;
        city: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string | null;
        googleId: string | null;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        companyId: string | null;
        companyRole: import(".prisma/client").$Enums.CompanyRole | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
    }>;
    importInventory(companyId: string, csvData: string): Promise<{
        success: number;
        errors: string[];
    }>;
}
