import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  playerId$: Observable<string | null> = this.playerIdSubject.asObservable();

  setPlayerId(playerId: string): void {
    this.playerIdSubject.next(playerId);
  }

  getPlayerId(): string | null {
    return this.playerIdSubject.value;
  }
}
