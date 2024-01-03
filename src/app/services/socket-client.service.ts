import {Injectable, OnDestroy} from '@angular/core';
import {Client, StompSubscription} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {BehaviorSubject, filter, first, Observable, Subject, switchMap} from "rxjs";
import { environment } from '../../environments/environment';

export enum SocketClientState {
  DISCONNECTED, ATTEMPTING, CONNECTED
}

@Injectable({
  providedIn: 'root'
})
export class SocketClientService implements OnDestroy {

  public static connectionState$: Observable<SocketClientState>;
  private connectionState: BehaviorSubject<SocketClientState>;

  private currentSubscription: StompSubscription | undefined = undefined;
  private client: Client | null = null;

  private onConnectSubject: Subject<void> = new Subject<void>();
  public onConnect$: Observable<void> = this.onConnectSubject.asObservable();

  private onDisconnectSubject: Subject<void> = new Subject<void>();
  public onDisconnect$: Observable<void> = this.onConnectSubject.asObservable();

  constructor() {
    this.connectionState = new BehaviorSubject<SocketClientState>(SocketClientState.DISCONNECTED);
    SocketClientService.connectionState$ = this.connectionState.asObservable();
    
  }

  connect(headers: Record<string, string> = {}): void {
    this.disconnect()
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.apiWebsocket),
      connectHeaders: headers
    });
    this.client.onConnect = () => {
      this.connectionState.next(SocketClientState.CONNECTED);
      this.onConnectSubject.next();
    };
    this.client.onDisconnect = () => {
      this.connectionState.next(SocketClientState.ATTEMPTING);
      this.onDisconnectSubject.next();
    }
    this.client?.activate();
  }

  disconnect(): void {
    this.currentSubscription?.unsubscribe();
    this.currentSubscription = undefined;
    this.client?.deactivate();
  }

  send(topic: string, payload: any): void {
    if (!this.currentSubscription) {
      return;
    }
    this.client?.publish({
      destination: topic,
      body: JSON.stringify(payload),
    })
  }

  onMessage(topic: string): Observable<any> {
    if (this.currentSubscription) {
      return new Observable<any>();
    }
    return this.connectionState.pipe(filter(state => state === SocketClientState.CONNECTED))
      .pipe(first(), switchMap(() => {
        return new Observable<any>(observer => {
          this.currentSubscription = this.client?.subscribe(topic, message => {
            observer.next(JSON.parse(message.body));
          });
          return () => this.currentSubscription?.id ? this.client?.unsubscribe(this.currentSubscription?.id) : undefined;
        });
      }))
  }

  onMessageUser(userId: string, topic: string): Observable<any> {
    if (this.currentSubscription) {
      return new Observable<any>();
    }
    const userTopic = `/user/${userId}${topic}`;
    return this.connectionState.pipe(
      filter((state) => state === SocketClientState.CONNECTED),
      first(),
      switchMap(() => {
        return new Observable<any>((observer) => {
          this.currentSubscription = this.client?.subscribe(userTopic, (message) => {
            observer.next(JSON.parse(message.body));
          });
          return () =>
            this.currentSubscription?.id ? this.client?.unsubscribe(this.currentSubscription?.id) : undefined;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
