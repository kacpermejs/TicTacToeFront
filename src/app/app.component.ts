import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CognitoService } from './services/cognito.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TicTacToeFront';
  isProductionOn = environment.production

  constructor(private router: Router, private cognitoService: CognitoService) {
  }
  ngOnInit(): void {
    console.log(environment);
  }

  public signOut(): void {
    this.cognitoService.signOut().then(() => {
      console.log("User signed out!");
      this.router.navigate(['/home']);
    });
  }

  public isAuthenticated(): boolean {
    return this.cognitoService.isAuthenticated();
  }
}
