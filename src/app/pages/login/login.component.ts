import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CognitoService, IUser } from '../../services/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  playerId: string = '';

  user: IUser = {} as IUser;

  constructor(private router: Router, private playerService: PlayerService, private cognitoService: CognitoService) {}

  login(): void {
    this.playerService.setPlayerId(this.playerId);
    console.log("setting playerId to: ");
    console.log(this.playerId);
  }

  signIn(): void {

    this.cognitoService.signIn(this.user).then(() => {
      this.router.navigate(['/edit-account-details']); //TODO: only if user details not provided
    }).catch(() => {
      console.log("Something went wrong with signin!");
    });
  }
}
