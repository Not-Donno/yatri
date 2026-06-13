import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';

import { CreateRequestDto } from './dto/create-request.dto';

import {
  RequestStatus,
} from '@prisma/client';

import { calculateDistance } from './utils/haversine';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async create(
    customerId: string,
    dto: CreateRequestDto,
  ) {
    const request =
      await this.prisma.serviceRequest.create({
        data: {
          customerId,
          issue: dto.issue,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      });

    const mechanics =
      await this.prisma.mechanicProfile.findMany({
        where: {
          isAvailable: true,
          latitude: {
            not: null,
          },
          longitude: {
            not: null,
          },
        },
        include: {
          user: true,
        },
      });

    const nearbyMechanics = mechanics
      .map((mechanic) => ({
        ...mechanic,
        distance: calculateDistance(
          dto.latitude,
          dto.longitude,
          mechanic.latitude!,
          mechanic.longitude!,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    const nearestMechanic =
      nearbyMechanics[0];

    if (!nearestMechanic) {
      return {
        request,
        message:
          'No mechanics available nearby',
      };
    }

    await this.prisma.serviceRequest.update({
      where: {
        id: request.id,
      },
      data: {
        mechanicId:
          nearestMechanic.userId,
      },
    });

    return {
      requestId: request.id,
      assignedMechanic: {
        id: nearestMechanic.user.id,
        name: nearestMechanic.user.name,
        distance:
          nearestMechanic.distance,
      },
    };
  }

  async getRequestById(
    requestId: string,
  ) {
    return this.prisma.serviceRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getMechanicRequests(
    mechanicId: string,
  ) {
    return this.prisma.serviceRequest.findMany({
      where: {
        mechanicId,
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async acceptRequest(
    requestId: string,
  ) {
    return this.updateStatus(
      requestId,
      RequestStatus.ACCEPTED,
    );
  }

  async onTheWay(
    requestId: string,
  ) {
    return this.updateStatus(
      requestId,
      RequestStatus.ON_THE_WAY,
    );
  }

  async arrived(
    requestId: string,
  ) {
    return this.updateStatus(
      requestId,
      RequestStatus.ARRIVED,
    );
  }

  async complete(
    requestId: string,
  ) {
    return this.updateStatus(
      requestId,
      RequestStatus.COMPLETED,
    );
  }

  async cancelRequest(
    requestId: string,
  ) {
    const request =
      await this.prisma.serviceRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {
      throw new BadRequestException(
        'Request not found',
      );
    }

    if (
      request.status ===
      RequestStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Request already completed',
      );
    }

    const updated =
      await this.prisma.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status:
            RequestStatus.CANCELLED,
        },
      });

    this.socketGateway.sendRequestStatus(
      requestId,
      'CANCELLED',
    );

    return updated;
  }

  async customerHistory(
    customerId: string,
  ) {
    return this.prisma.serviceRequest.findMany({
      where: {
        customerId,
      },
      include: {
        mechanic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async mechanicHistory(
    mechanicId: string,
  ) {
    return this.prisma.serviceRequest.findMany({
      where: {
        mechanicId,
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async updateStatus(
    requestId: string,
    status: RequestStatus,
  ) {
    const request =
      await this.prisma.serviceRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {
      throw new BadRequestException(
        'Request not found',
      );
    }

    const updatedRequest =
      await this.prisma.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });

    this.socketGateway.sendRequestStatus(
      requestId,
      status,
    );

    return updatedRequest;
  }
}