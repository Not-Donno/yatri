import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MechanicsService {
  constructor(private prisma: PrismaService) {}

  async goOnline(userId: string) {
    return this.prisma.mechanicProfile.upsert({
      where: {
        userId,
      },
      update: {
        isAvailable: true,
      },
      create: {
        userId,
        isAvailable: true,
      },
    });
  }

  async goOffline(userId: string) {
    return this.prisma.mechanicProfile.upsert({
      where: {
        userId,
      },
      update: {
        isAvailable: false,
      },
      create: {
        userId,
        isAvailable: false,
      },
    });
  }

  async updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
  ) {
    return this.prisma.mechanicProfile.upsert({
      where: {
        userId,
      },
      update: {
        latitude,
        longitude,
      },
      create: {
        userId,
        latitude,
        longitude,
        isAvailable: false,
      },
    });
  }
}