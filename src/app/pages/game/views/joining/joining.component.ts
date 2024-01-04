import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, GameStatus } from '../../../../services/game.service';

@Component({
  selector: 'app-joining',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joining.component.html',
  styleUrl: './joining.component.scss'
})
export class JoiningComponent {

  status: GameStatus = GameStatus.Connecting;
  
  constructor(private gameService: GameService) {
    gameService.joinedQueue$.subscribe(m => {
      console.log("Join response: ");
      console.log(m);
      if (m && this.status == GameStatus.Connecting ) {
        this.status = GameStatus.Waiting
      }
    });
    gameService.gameFoundMessage$.subscribe(m => {
      console.log("Game found response: ");
      console.log(m);
      if (m) {
        this.status = GameStatus.Playing;
      }
    });
  }

  getStatusMessage(status: GameStatus): string {
    switch (status) {
      case GameStatus.Connecting:
        return 'Connecting...';
      case GameStatus.Waiting:
        return 'Joined a queue, waiting for other players...';
      case GameStatus.Playing:
        return 'Game found! Starting the game...';
      default:
        return 'Game found! Starting the game...';
    }
  }
}
