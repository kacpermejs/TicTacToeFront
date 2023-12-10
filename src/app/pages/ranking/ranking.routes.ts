import { Routes } from '@angular/router';
import { RankingComponent } from './ranking.component';
import { PlayerDetailsComponent } from '../player-details/player-details.component';

//relative to /ranking
export const RankingRoutes: Routes = [
  {
    path: '',
    component: RankingComponent,
  },
  { 
    path: ':id',
    component: PlayerDetailsComponent
  },
];