import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GameService, GameFoundMessage, GameStatus } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { GameplayComponent } from './views/gameplay/gameplay.component';
import { JoiningComponent } from './views/joining/joining.component';
import { EndgameComponent } from './views/endgame/endgame.component';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GameplayComponent, JoiningComponent, EndgameComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  
  gameFoundMessage$: Observable<GameFoundMessage | undefined>
  gameFoundMessage?: GameFoundMessage;
  
  private destroy$: Subject<void> = new Subject<void>();
  
  constructor(private gameService: GameService, private playerService: PlayerService) {
    console.log("game ctor!")
    this.gameFoundMessage$ = gameService.gameFoundMessage$;
    this.gameFoundMessage$
    .pipe(takeUntil(this.destroy$))
    .subscribe(m => {
      this.gameFoundMessage = m;
    });
  }
  
  ngOnInit(): void {}
  
  ngOnDestroy(): void {
    console.log("game destroyed");
    this.destroy$.next();
    this.destroy$.complete();
    this.gameService.quit();
  }

  myShape(): string {
    if (this.gameFoundMessage) {
      const opponentId = this.gameFoundMessage.opponentId;
      if (opponentId == this.gameFoundMessage.gameSession.player1.id) {
        return this.gameFoundMessage.gameSession.playerTwoShape;
      } else {
        return this.gameFoundMessage.gameSession.playerOneShape;
      }
    }

    return '';
  }

}
