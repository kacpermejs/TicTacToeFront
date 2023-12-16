import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  testEndpoint(): void {
    this.http.get<any>(this.apiUrl + "test/").subscribe(
      {
        next: (next) => console.log(next),
        error: (error) => console.error(error)
      }
    );
  }
}
