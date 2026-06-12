import {
  Body,
  Controller,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '@prisma/client';

import { MechanicsService } from './mechanics.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('mechanics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MECHANIC)
export class MechanicsController {
  constructor(
    private mechanicsService: MechanicsService,
  ) {}

  @Patch('online')
  goOnline(@Request() req: any) {
    return this.mechanicsService.goOnline(req.user.id);
  }

  @Patch('offline')
  goOffline(@Request() req: any) {
    return this.mechanicsService.goOffline(req.user.id);
  }

  @Patch('location')
  updateLocation(
    @Request() req: any,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.mechanicsService.updateLocation(
      req.user.id,
      dto.latitude,
      dto.longitude,
    );
  }
}