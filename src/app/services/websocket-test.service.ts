import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketClientService } from './socket-client.service';
import { environment } from '../../environments/environment';

export type SaveToRepeatRequest = {
  value: string
}

export type RepeatResponse = {
  content: string,
  numberOfRepetitions: number
}

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
    return this.socketClient.send('/game/save-word', request);
  }

  getRepeatResponse(): Observable<RepeatResponse> {
    return this.socketClient.onMessage('/topic/repeat');
  }
}
