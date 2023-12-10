import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  playerId: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.playerId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    
  }
}
