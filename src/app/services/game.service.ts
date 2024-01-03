import { Injectable } from '@angular/core';
import { SocketClientService, SocketClientState } from './socket-client.service';
import { BehaviorSubject, Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { PlayerService } from './player.service';

export interface GameFoundMessage {
  opponentId: string;
  gameSessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  private canJoinSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canJoin$: Observable<boolean> = this.canJoinSubject.asObservable();
  
  private joinQueueSubject: BehaviorSubject<any | undefined> = 
    new BehaviorSubject<any | undefined>(undefined);
  joinedQueue$: Observable<any> = this.joinQueueSubject.asObservable();
  
  private gameFoundSubject: BehaviorSubject<GameFoundMessage | undefined> = 
    new BehaviorSubject<GameFoundMessage | undefined>(undefined);
  gameFoundMessage$: Observable<GameFoundMessage | undefined> = this.gameFoundSubject.asObservable();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private socketClientService: SocketClientService,
    private playerService: PlayerService
  ) {
    // Subscribe to playerId changes and establish a connection
    this.playerService.playerId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(playerId => this.connect(playerId))
      )
      .subscribe();
  }

  connect(playerId: string | null): Observable<void> {
    return new Observable<void>((observer) => {
      if(playerId) {
        console.log('connecting');

        this.socketClientService.connect({userId: playerId});

        this.socketClientService.onMessageUser(playerId, '/queue/join-confirmation')
          .pipe(takeUntil(this.destroy$))
          .subscribe(message => this.joinQueueSubject.next(message));

        this.socketClientService.onMessageUser(playerId, '/queue/game-found').pipe(
          map((anyValue: any) => {
            const gameFoundMessage: GameFoundMessage = {
              opponentId: anyValue.opponentId,
              gameSessionId: anyValue.gameSessionId
            };
            return gameFoundMessage;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(message => this.gameFoundSubject.next(message));

        SocketClientService.connectionState$.subscribe((state) => {
          this.canJoinSubject.next(state === SocketClientState.CONNECTED);
        });

      } else {
        console.log('No player id!');
      }
      // Complete the observable when done
      observer.complete();

      // Cleanup logic if needed

      // Return a teardown function for cleanup
      return () => {
        // Unsubscribe logic if needed
      };
    });
  }

  joinLobby(playerId: string): void {
    this.canJoin$
      .pipe(takeUntil(this.destroy$))
      .subscribe(canJoin => {
        if (canJoin) {
          console.log('Trying to join with ' + playerId + ' playerId!');
          this.socketClientService.send('/game/lobby/join', playerId);
        } else {
          console.log('Cannot join at the moment.');
          // Handle logic when the player cannot join
        }
      });
  }

  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
