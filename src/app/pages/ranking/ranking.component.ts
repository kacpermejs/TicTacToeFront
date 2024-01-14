import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestService } from '../../services/test.service';
import { Observable, catchError, throwError } from 'rxjs';
import { UserRanking } from '../../models/user-ranking';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  rankingEndpoint: string = environment.apiUrl + "/public/ranking";

  ranking$: Observable<UserRanking[]>;

  constructor(private testService: TestService, private http: HttpClient) {
    this.ranking$ = this.getRanking();
  }

  ngOnInit(): void {
    console.log("Test:");
    this.testService.testEndpoint();
    this.testService.testEndpointPrivate();

  }

  getRanking(): Observable<UserRanking[]> {
    return this.http.get<UserRanking[]>(this.rankingEndpoint);
  }

}
