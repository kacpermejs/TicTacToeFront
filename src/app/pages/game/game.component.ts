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

  gameFoundMessage$: Observable<GameFoundMessage | undefined>
  gameFoundMessage?: GameFoundMessage;

  constructor(private gameService: GameService, private playerService: PlayerService) {
    this.gameFoundMessage$ = gameService.gameFoundMessage$;
    this.gameFoundMessage$.subscribe(m => this.gameFoundMessage = m);
  }

  ngOnInit(): void {}

}
