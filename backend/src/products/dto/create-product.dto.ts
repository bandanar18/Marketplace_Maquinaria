import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Condition, Availability, TransactionType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1900)
  @IsNotEmpty()
  year: number;

  @IsEnum(Condition)
  @IsNotEmpty()
  condition: Condition;

  @IsEnum(Availability)
  @IsNotEmpty()
  availability: Availability;

  @IsEnum(TransactionType)
  @IsOptional()
  transactionType?: TransactionType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  pricePerDay?: number;

  @IsNumber()
  @IsOptional()
  pricePerWeek?: number;

  @IsNumber()
  @IsOptional()
  pricePerMonth?: number;

  @IsInt()
  @IsOptional()
  minRentalDays?: number;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsBoolean()
  @IsOptional()
  includesOperator?: boolean;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isNegotiable?: boolean;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsOptional()
  specs?: any;
}
