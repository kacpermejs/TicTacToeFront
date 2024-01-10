import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { StompHeaders } from '@stomp/stompjs';

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

  public async getCognitoUserId(): Promise<string | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const cognitoUserId = user.attributes.sub; // 'sub' is the Cognito User ID
      return cognitoUserId;
    } catch (error) {
      console.error('Error getting Cognito User ID:', error);
      return null;
    }
  }

  public async getToken(): Promise<string> {
    try {
      // Get the current authenticated user
      const user = await Auth.currentAuthenticatedUser();

      // Get the session for the user
      const session = user.signInUserSession;

      // Access token is available in the session
      return session.getAccessToken().getJwtToken();
    } catch (error) {
      console.error('Error getting access token', error);
      throw error;
    }
  }

  public async getHttpHeaders(): Promise<HttpHeaders> {
    try {
      // Get the access token
      const accessToken = await this.getToken();

      // Include the access token in the Authorization header
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
    } catch (error) {
      console.error('Error getting headers', error);
      throw error;
    }
  }

  async getStompHeaders(): Promise<StompHeaders> {
    try {
      // Get the access token
      const accessToken = await this.getToken();
  
      // Create StompHeaders with authentication
      const stompHeaders: StompHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };
  
      return stompHeaders;
    } catch (error) {
      console.error('Error creating StompHeaders', error);
      throw error;
    }
  }
  
  private checkAuthStatus(): void {
    Auth.currentAuthenticatedUser()
      .then(() => this.authSubject.next(true))
      .catch(() => this.authSubject.next(false));
  }

}
