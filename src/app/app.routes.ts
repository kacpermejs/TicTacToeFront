import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'home', loadComponent: () => import('./pages/home/home.component').then(routes => routes.HomeComponent)},
    {path: 'ranking', loadChildren: () => import('./pages/ranking/ranking.routes').then(routes => routes.RankingRoutes) },

    // Redirection:
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
    { path: '**', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home for any other route
];
