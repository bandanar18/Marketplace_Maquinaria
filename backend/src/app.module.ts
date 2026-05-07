import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CompaniesModule } from './companies/companies.module';
import { QuotesModule } from './quotes/quotes.module';
import { MessagesModule } from './messages/messages.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { BrandsModule } from './brands/brands.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    ProductsModule, 
    CategoriesModule, 
    CompaniesModule, 
    QuotesModule, 
    MessagesModule, 
    FavoritesModule,
    ReportsModule,
    AdminModule,
    BrandsModule,
    SettingsModule,
    AuditModule,
    SupportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
