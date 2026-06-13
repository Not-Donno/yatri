import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';

import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
  ) {}

  // ==========================
  // CUSTOMER
  // ==========================

  @Post()
  @Roles(Role.CUSTOMER)
  create(
    @Request() req: any,
    @Body() dto: CreateRequestDto,
  ) {
    return this.requestsService.create(
      req.user.id,
      dto,
    );
  }

  @Get(':id')
  getRequest(
    @Param('id') id: string,
  ) {
    return this.requestsService.getRequestById(
      id,
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.CUSTOMER)
  cancelRequest(
    @Param('id') id: string,
  ) {
    return this.requestsService.cancelRequest(
      id,
    );
  }

  @Get('history/customer')
  @Roles(Role.CUSTOMER)
  customerHistory(
    @Request() req: any,
  ) {
    return this.requestsService.customerHistory(
      req.user.id,
    );
  }

  // ==========================
  // MECHANIC
  // ==========================

  @Get('mechanic')
  @Roles(Role.MECHANIC)
  getMechanicRequests(
    @Request() req: any,
  ) {
    return this.requestsService.getMechanicRequests(
      req.user.id,
    );
  }

  @Patch(':id/accept')
  @Roles(Role.MECHANIC)
  acceptRequest(
    @Param('id') id: string,
  ) {
    return this.requestsService.acceptRequest(
      id,
    );
  }

  @Patch(':id/on-the-way')
  @Roles(Role.MECHANIC)
  onTheWay(
    @Param('id') id: string,
  ) {
    return this.requestsService.onTheWay(
      id,
    );
  }

  @Patch(':id/arrived')
  @Roles(Role.MECHANIC)
  arrived(
    @Param('id') id: string,
  ) {
    return this.requestsService.arrived(
      id,
    );
  }

  @Patch(':id/complete')
  @Roles(Role.MECHANIC)
  complete(
    @Param('id') id: string,
  ) {
    return this.requestsService.complete(
      id,
    );
  }

  @Get('history/mechanic')
  @Roles(Role.MECHANIC)
  mechanicHistory(
    @Request() req: any,
  ) {
    return this.requestsService.mechanicHistory(
      req.user.id,
    );
  }
}