import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cognitoService: CognitoService) { }

  

  testEndpoint(): void {
    this.http.get<any>(this.apiUrl + "/public/hello").subscribe(
      {
        next: (next) => console.log(next),
        error: (error) => console.error(error)
      }
    );
  }

  async testEndpointPrivate(): Promise<void> {

    const auth = await this.cognitoService.getHttpHeaders();

    console.log(auth);

    this.http.get<any>(this.apiUrl + "/private/hello", { headers: auth }).subscribe(
      {
        next: (next) => console.log(next),
        error: (error) => console.error(error)
      }
    );
  }
}
