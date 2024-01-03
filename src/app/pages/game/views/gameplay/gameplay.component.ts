import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

enum Player {
  X = 'X',
  O = 'O',
}

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.scss'
})
export class GameplayComponent {
  currentPlayer: Player = Player.X;
  board: Player[][] = Array(3).fill(null).map(() => Array(3).fill(null));
  winner: Player | null = null;
  isGameOver = false;

  makeMove(row: number, col: number): void {
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
    this.currentPlayer = Player.X;
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.winner = null;
    this.isGameOver = false;
  }
}
