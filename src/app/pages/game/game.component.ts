import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketTestService } from '../../services/websocket-test.service';
import { FormsModule } from '@angular/forms';
import { RepeatResponse, SaveToRepeatRequest, SocketClientService, SocketClientState } from '../../services/socket-client.service';
import { SocketTestComponent } from './socket-test/socket-test.component';

export interface Message {
  content: string;
  randomNumber: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, SocketTestComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  webSocketConnected: boolean = false;
  repeatResponses: RepeatResponse[] = [];

  constructor(private service: WebsocketTestService) {
    SocketClientService.connectionState$.subscribe(state => {
      this.webSocketConnected = state === SocketClientState.CONNECTED;
    })
  }

  connect(): void {
    this.service.connect();
    this.service.getRepeatResponse()
      .subscribe(repeatResponse => this.repeatResponses.push(repeatResponse));
  }

  disconnect(): void {
    this.service.disconnect();
    this.repeatResponses = [];
  }

  createRequest(request: SaveToRepeatRequest): void {
    this.service.save(request);
  }
}
