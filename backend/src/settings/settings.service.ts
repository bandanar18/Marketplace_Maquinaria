import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const configs = await this.prisma.globalConfig.findMany();
    return configs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  }

  async update(key: string, value: string) {
    return this.prisma.globalConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  async updateMany(configs: Record<string, string>) {
    const operations = Object.entries(configs).map(([key, value]) => 
      this.prisma.globalConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    );
    return Promise.all(operations);
  }
}
