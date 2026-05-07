import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
