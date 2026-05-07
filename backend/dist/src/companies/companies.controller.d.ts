import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getAllCompanies(query: any): Promise<{
        items: {
            id: string;
            country: string;
            city: string;
            name: string;
            slug: string;
            logoUrl: string | null;
            description: string;
            verifiedAt: Date | null;
            _count: {
                reviews: number;
                products: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyCompany(req: any): Promise<{
        members: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            firstName: string;
            lastName: string;
            companyRole: import(".prisma/client").$Enums.CompanyRole | null;
        }[];
    } & {
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
        description: string;
        website: string | null;
        address: string;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
    }>;
    updateMyCompany(req: any, updateCompanyDto: UpdateCompanyDto): Promise<{
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
        description: string;
        website: string | null;
        address: string;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
    }>;
    getCompanyStats(req: any): Promise<{
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
    getMyCompanyCustomers(req: any): Promise<any[]>;
    getMembers(req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        companyRole: import(".prisma/client").$Enums.CompanyRole | null;
        createdAt: Date;
    }[]>;
    getInvites(req: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        status: import(".prisma/client").$Enums.InviteStatus;
        companyId: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
    }[]>;
    invite(req: any, body: {
        email: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        status: import(".prisma/client").$Enums.InviteStatus;
        companyId: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
    }>;
    cancelInvite(req: any, id: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        status: import(".prisma/client").$Enums.InviteStatus;
        companyId: string;
        createdAt: Date;
        expiresAt: Date;
        token: string;
    }>;
    removeMember(req: any, id: string): Promise<{
        id: string;
        email: string;
        googleId: string | null;
        passwordHash: string | null;
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
    importInventory(req: any, body: {
        csvData: string;
    }): Promise<{
        success: number;
        errors: string[];
    }>;
    getCompanyBySlug(slug: string): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.CompanyStatus;
        phone: string;
        country: string;
        city: string;
        createdAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        description: string;
        website: string | null;
        address: string;
        verifiedAt: Date | null;
        plan: import(".prisma/client").$Enums.PlanType;
        _count: {
            reviews: number;
            products: number;
        };
    }>;
    getCompanyProducts(slug: string, query: any): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            images: {
                id: string;
                order: number;
                url: string;
                productId: string;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            country: string;
            city: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            address: string | null;
            rejectionReason: string | null;
            title: string;
            categoryId: string;
            brand: string;
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
            name: string;
            slug: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAdminCompanies(req: any, query: any): Promise<{
        items: {
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
            description: string;
            website: string | null;
            address: string;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            plan: import(".prisma/client").$Enums.PlanType;
            planExpiresAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateCompanyStatus(req: any, id: string, body: {
        status: string;
        rejectionReason?: string;
    }): Promise<{
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
        description: string;
        website: string | null;
        address: string;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
    }>;
    updateCompanyPlan(req: any, id: string, body: {
        plan: string;
        expiresAt?: string;
    }): Promise<{
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
        description: string;
        website: string | null;
        address: string;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        plan: import(".prisma/client").$Enums.PlanType;
        planExpiresAt: Date | null;
    }>;
}
