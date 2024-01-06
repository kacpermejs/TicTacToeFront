import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';

export interface IUser {
  email: string;
  password: string;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private authSubject: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);

  constructor() {
    Amplify.configure({
      Auth: environment.cognito
    });
    this.checkAuthStatus();
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn({
      username: user.email,
      password: user.password
    }).then(() => {
      this.checkAuthStatus();
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authSubject.next(false);
    });
  }
  
  public isAuthenticated(): boolean {
    return this.authSubject.value;
  }

  private checkAuthStatus(): void {
    Auth.currentAuthenticatedUser()
      .then(() => this.authSubject.next(true))
      .catch(() => this.authSubject.next(false));
  }
}
