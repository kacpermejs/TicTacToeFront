import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketTestService } from '../../services/websocket-test.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepeatResponse, SaveToRepeatRequest, SocketClientService, SocketClientState } from '../../services/socket-client.service';
import { SocketTestComponent } from './socket-test/socket-test.component';
import { Subscription } from 'rxjs';

export interface Message {
  content: string;
  randomNumber: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SocketTestComponent, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  gameFoundMessage: any;
  playerId: string | undefined;
  private gameFoundSocketSubscription: Subscription | undefined;
  private joinedQueueSocketSubscription: Subscription | undefined;

  constructor(private socketClientService: SocketClientService) {

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.gameFoundSocketSubscription) {
      this.gameFoundSocketSubscription.unsubscribe();
    }
  }

  connect(): void {
    if(this.playerId) {
      console.log('connecting');

      this.socketClientService.connect();
      this.joinedQueueSocketSubscription = this.socketClientService.onMessageUser(this.playerId, '/queue/join-confirmation').subscribe((message) => {
        console.log('response: ', message);
      });
      this.gameFoundSocketSubscription = this.socketClientService.onMessageUser(this.playerId,'/queue/game-found').subscribe((message) => {
        this.gameFoundMessage = message;
        console.log('Game session found:', this.gameFoundMessage);
      });
    } else {
      console.log('No player id!');
    }
  }

  joinLobby(): void {
    if (this.playerId) {
      console.log('trying to join with ' + this.playerId + ' playerId!')
      this.socketClientService.send('/game/lobby/join', this.playerId);
    }
  }

}
// connect(): void {
//   this.service.connect();
//   this.service.getRepeatResponse()
//     .subscribe(repeatResponse => this.repeatResponses.push(repeatResponse));
// }

// disconnect(): void {
//   this.service.disconnect();
//   this.repeatResponses = [];
// }

// createRequest(request: SaveToRepeatRequest): void {
//   this.service.save(request);
// }
