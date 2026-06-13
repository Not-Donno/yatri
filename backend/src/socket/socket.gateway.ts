import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server!: Server;

  // Request status updates
  sendRequestStatus(
    requestId: string,
    status: string,
  ) {
    this.server.emit(
      `request-${requestId}`,
      {
        requestId,
        status,
      },
    );
  }

  sendMechanicLocation(
    requestId: string,
    latitude: number,
    longitude: number,
  ) {
    this.server.emit(
      `location-${requestId}`,
      {
        requestId,
        latitude,
        longitude,
      },
    );
  }
}