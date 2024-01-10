import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestService } from '../../services/test.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  responseData: any;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    console.log("Test:");
    this.testService.testEndpoint();
    this.testService.testEndpointPrivate();
  }

}
