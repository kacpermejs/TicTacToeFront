import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  playerId$: Observable<string | null> = this.playerIdSubject.asObservable();

  constructor(private cognitoService: CognitoService) {
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
