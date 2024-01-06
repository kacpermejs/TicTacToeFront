import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'home', loadComponent: () => import('./pages/home/home.component').then(routes => routes.HomeComponent)},
    {path: 'game', loadComponent: () => import('./pages/game/game.component').then(routes => routes.GameComponent)},
    {path: 'ranking', loadChildren: () => import('./pages/ranking/ranking.routes').then(routes => routes.RankingRoutes) },
    {path: 'login', loadComponent: () => import('./pages/login/login.component').then(routes => routes.LoginComponent)},
    {path: 'register', loadComponent: () => import('./pages/register/register.component').then(routes => routes.RegisterComponent)},
    
    // Redirection:
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
    { path: '**', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home for any other route
];
