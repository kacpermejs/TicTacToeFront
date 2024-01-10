import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CognitoService } from './cognito.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface InternalUser {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  playerId$: Observable<string | null> = this.playerIdSubject.asObservable();

  apiUrl: string = environment.apiUrl;

  constructor(private cognitoService: CognitoService, private http: HttpClient) {
    cognitoService.getCognitoUserId()
      .then((id: string | null) => {
        if(id != null) {
          console.log(`Player service received ${id} as  cognitoPlayerId!`);
          this.setPlayerId(id);
        } else {
          console.log("Player service received null as a cognitoPlayerId!");
        }
      })
      .catch(() => {
        console.log("Player service didn't get the cognitoPlayerId!");
      });
  }

  setPlayerId(playerId: string): void {
    this.playerIdSubject.next(playerId);
  }

  getPlayerId(): string | null {
    return this.playerIdSubject.value;
  }
}
