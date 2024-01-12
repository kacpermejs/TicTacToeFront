import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CognitoService, IUser } from '../../services/cognito.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isConfirmed: boolean = false;
  user: IUser;
  constructor(private router: Router, private cognitoService: CognitoService, private http: HttpClient) {
    this.user = {} as IUser
  }

  public signUp(): void {
    this.cognitoService.signUp(this.user).then(() => {
      this.isConfirmed = true;
    }).catch(() => {
      console.log("Something went wrong with signup!");
    });
  }

  public confirmSignUp(): void {
    console.log(this.user);
    this.cognitoService.confirmSignUp(this.user).then(() => {
      this.router.navigate(['/login']);
    }).catch(() => {
      console.log("Something went wrong with signup confirmation!");
    });
  }
}
