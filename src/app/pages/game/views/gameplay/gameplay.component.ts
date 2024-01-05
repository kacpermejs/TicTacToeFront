import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';

enum Player {
  X = 'X',
  O = 'O',
}

interface Move {
  row: number;
  column: number;
}

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.scss'
})
export class GameplayComponent {
  currentPlayer: Player = Player.O;
  board: Player[][] = Array(3).fill(null).map(() => Array(3).fill(null));
  winner: Player | null = null;
  isGameOver = false;
  lastMove?: Move;

  constructor(private gameService: GameService) {
    this.gameService.gameStateMessage$.subscribe(m => {
      console.log("trying to update game state")

      if(m) {
        console.log("gameStateMessage");
        console.log(m);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.board[i][j] = m.board[i][j];
          }
        }
        this.currentPlayer = m.currentPlayer;
        this.isGameOver = m.gameWon;
        switch (m.winner) {
          case ' ':
            this.winner = null;
            break;
          case 'O':
            this.winner = Player.O;
            break;
          case 'X':
            this.winner = Player.X;
            break;
          
          default:
            break;
        }
      }

      
    });

  }

  makeMove(row: number, col: number): void {
    this.gameService.makeMove(row, col);
    this.lastMove = {
      row: row,
      column: col
    };
  }

  showMoveOffline(row: number, col: number): void {
    if (!this.board[row][col] && !this.isGameOver) {
      this.board[row][col] = this.currentPlayer;
      if (this.checkForWinner(row, col)) {
        this.winner = this.currentPlayer;
        this.isGameOver = true;
      } else if (this.isBoardFull()) {
        this.isGameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
      }
    }
  }

  checkForWinner(row: number, col: number): boolean {
    // Check row
    if (
      this.board[row][0] === this.currentPlayer &&
      this.board[row][1] === this.currentPlayer &&
      this.board[row][2] === this.currentPlayer
    ) {
      return true;
    }

    // Check column
    if (
      this.board[0][col] === this.currentPlayer &&
      this.board[1][col] === this.currentPlayer &&
      this.board[2][col] === this.currentPlayer
    ) {
      return true;
    }

    // Check diagonals
    if (
      (row === col &&
        this.board[0][0] === this.currentPlayer &&
        this.board[1][1] === this.currentPlayer &&
        this.board[2][2] === this.currentPlayer) ||
      (row + col === 2 &&
        this.board[0][2] === this.currentPlayer &&
        this.board[1][1] === this.currentPlayer &&
        this.board[2][0] === this.currentPlayer)
    ) {
      return true;
    }

    return false;
  }

  isBoardFull(): boolean {
    return this.board.every(row => row.every(cell => cell !== null));
  }

  resetGame(): void {
    this.currentPlayer = Player.O;
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.winner = null;
    this.isGameOver = false;
  }
}
