import { Module } from '@nestjs/common';

import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}