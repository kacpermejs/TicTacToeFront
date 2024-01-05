import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  playerId: string = '';

  constructor(private playerService: PlayerService) {}

  login(): void {
    this.playerService.setPlayerId(parseInt(this.playerId));
    console.log("setting playerId to: ");
    console.log(this.playerId);
  }
}
