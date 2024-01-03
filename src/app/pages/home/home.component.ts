import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  canJoin$: Observable<boolean> = this.gameService.canJoin$;
  canJoin: boolean = false;
  
  constructor(private gameService: GameService, private playerService: PlayerService) {
    this.canJoin$ = this.gameService.canJoin$;
    this.canJoin$.subscribe(c => this.canJoin = c);
  }

  joinLobby(): void {
    const player = this.playerService.getPlayerId();
    if (this.canJoin && player)
      this.gameService.joinLobby(player);
  }
}
