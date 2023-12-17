import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RepeatResponse, SaveToRepeatRequest, SocketClientService } from './socket-client.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketTestService {
  constructor(private socketClient: SocketClientService) {
  }

  connect(): void {
    this.socketClient.connect();
  }

  disconnect(): void {
    this.socketClient.disconnect();
  }

  save(request: SaveToRepeatRequest) {
    return this.socketClient.send(environment.requestEndpoint, request);
  }

  getRepeatResponse(): Observable<RepeatResponse> {
    return this.socketClient.onMessage(environment.topicEndpoint);
  }
}
