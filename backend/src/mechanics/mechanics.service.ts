import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class MechanicsService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

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
    // Update mechanic location
    const profile = await this.prisma.mechanicProfile.upsert({
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

    // Find active request
    const activeRequest =
      await this.prisma.serviceRequest.findFirst({
        where: {
          mechanicId: userId,
          status: {
            in: ['ACCEPTED', 'ON_THE_WAY'],
          },
        },
      });

    // Send live location to customer
    if (activeRequest) {
      this.socketGateway.sendMechanicLocation(
        activeRequest.id,
        latitude,
        longitude,
      );
    }

    return profile;
  }
}