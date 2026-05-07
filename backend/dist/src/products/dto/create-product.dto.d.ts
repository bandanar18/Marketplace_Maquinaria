import { Condition, Availability, TransactionType } from '@prisma/client';
export declare class CreateProductDto {
    title: string;
    categoryId: string;
    description: string;
    brand: string;
    model: string;
    year: number;
    condition: Condition;
    availability: Availability;
    transactionType?: TransactionType;
    images?: string[];
    price?: number;
    pricePerDay?: number;
    pricePerWeek?: number;
    pricePerMonth?: number;
    minRentalDays?: number;
    depositAmount?: number;
    includesOperator?: boolean;
    currency?: string;
    isNegotiable?: boolean;
    country: string;
    city: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    specs?: any;
}
