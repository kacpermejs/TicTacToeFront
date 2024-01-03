import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GameService, GameFoundMessage } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { GameplayComponent } from './views/gameplay/gameplay.component';

export interface Message {
  content: string;
  randomNumber: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GameplayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  canJoin$: Observable<boolean>;
  gameFoundMessage$: Observable<GameFoundMessage | undefined>
  playerId: string = '';

  canJoin: boolean = false;
  gameFoundMessage?: GameFoundMessage;

  constructor(private gameService: GameService, private playerService: PlayerService) {
    this.canJoin$ = this.gameService.canJoin$;
    this.gameFoundMessage$ = gameService.gameFoundMessage$;
    this.canJoin$.subscribe(c => this.canJoin = c);
    this.gameFoundMessage$.subscribe(m => this.gameFoundMessage = m);
  }

  ngOnInit(): void {}

  connect(): void {
    this.playerService.setPlayerId(this.playerId);
    console.log("setting playerId to: ");
    console.log(this.playerId);
  }

  joinLobby(): void {
    if (this.canJoin)
      this.gameService.joinLobby(this.playerId);
  }

}
