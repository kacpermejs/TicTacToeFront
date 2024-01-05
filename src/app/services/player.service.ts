import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  playerId$: Observable<number | null> = this.playerIdSubject.asObservable();

  setPlayerId(playerId: number): void {
    this.playerIdSubject.next(playerId);
  }

  getPlayerId(): number | null {
    return this.playerIdSubject.value;
  }
}
