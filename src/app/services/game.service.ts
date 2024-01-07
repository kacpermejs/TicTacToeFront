import { Injectable } from '@angular/core';
import { SocketClientService, SocketClientState } from './socket-client.service';
import { BehaviorSubject, Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { PlayerService } from './player.service';
import { CognitoService } from './cognito.service';

export interface GameFoundMessage {
  opponentId: string;
  gameSession: any;

}

export enum GameStatus {
  Connecting = 'connecting',
  Waiting = 'waiting',
  Playing = 'playing',
  GameOver = 'gameOver'
}

export interface MoveCommand {
  row: number;
  column: number;
  playerId: string;
  sessionId: number;
}

export interface MoveCommandPayload {
  move: MoveCommand;
  userId: string;
  token: string;
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

  private gameStateSubject: BehaviorSubject<any | undefined> = 
    new BehaviorSubject<any | undefined>(undefined);
  gameStateMessage$: Observable<any | undefined> = this.gameStateSubject.asObservable();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private socketClientService: SocketClientService,
    private playerService: PlayerService,
    private cognitoService: CognitoService
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
        this.cognitoService.getToken().then(token => {
          var headers = {
            'Authorization': 'Bearer ' + token,
            'userId': playerId
          };
          console.log(headers);
          this.socketClientService.connect(headers);
        });

        this.socketClientService.onMessageUser(playerId, '/queue/join-confirmation')
          .pipe(takeUntil(this.destroy$))
          .subscribe(message => {
            this.joinQueueSubject.next(message);
            console.log(message);
          });

        this.socketClientService.onMessageUser(playerId, '/queue/game-found').pipe(
          map((anyValue: any) => {
            // const gameFoundMessage: GameFoundMessage = {
            //   opponentId: anyValue.opponentId,
            //   gameSessionId: anyValue.gameSessionId
            // };
            return anyValue;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(message => {
          this.gameFoundSubject.next(message);
          console.log(message);
        });

        //moves
        this.socketClientService.onMessageUser(playerId, '/playing/update').pipe(
          map((anyValue: any) => {
            return anyValue;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(message => {
          this.gameStateSubject.next(message);
          console.log("Game state update");
          console.log(message);
        });

        //health check
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
          this.socketClientService.send('/game/lobby/join', {userId: playerId});
        } else {
          console.log('Cannot join at the moment.');
          // Handle logic when the player cannot join
        }
      });
  }

  makeMove(row: number, column: number) {
    if(this.gameFoundSubject.value) {
      const playerId = this.playerService.getPlayerId();
      const sessionId = this.gameFoundSubject.value.gameSession.id;

      if (playerId != null) {

        const payload: MoveCommand = {
          row: row,
          column: column,
          playerId: playerId,
          sessionId: sessionId
        };

        console.log("move made: ");
        console.log(payload);

        this.socketClientService.send('/game/move', payload);
      }
    }
  }

  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
