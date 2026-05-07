import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerClient(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
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
        status: 'ACTIVE', // Auto-activate: email verification not implemented yet
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async registerCompany(dto: RegisterCompanyDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Convert company name to slug
    const baseSlug = dto.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await this.prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create user and company in a transaction
    const [user, company] = await this.prisma.$transaction(async (prisma) => {
      const newCompany = await prisma.company.create({
        data: {
          slug,
          name: dto.companyName,
          taxId: dto.taxId,
          email: dto.email, // using the same email for company contact
          phone: dto.phone,
          country: dto.country,
          city: dto.city,
          address: dto.address,
          description: dto.description,
          logoUrl: dto.logoUrl,
          status: 'PENDING_REVIEW',
        },
      });

      // Optional: Add documents if URLs are provided
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

      // Split representative name
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
          status: 'ACTIVE', // Auto-activate: email verification not implemented yet
          companyId: newCompany.id,
          companyRole: 'OWNER',
        },
      });

      return [newUser, newCompany];
    });

    const { passwordHash: _, ...result } = user;
    return { user: result, company };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true }
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('User is suspended or banned');
    }

    if (user.status === 'PENDING_VERIFICATION') {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (user.role === 'COMPANY_MEMBER' && user.company?.status === 'REJECTED') {
      throw new UnauthorizedException('Your company application was rejected');
    }

    // Note: companies in PENDING_REVIEW can login but might be restricted on frontend.

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
}
