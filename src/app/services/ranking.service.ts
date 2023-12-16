import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  private apiUrl = environment.apiUrl;

  constructor() { }
}
