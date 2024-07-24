import { booleanAttribute, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gameOfLife';
  height: string = "";
  width: string = "";
  speed: string = "";
  isGame: boolean = false;
  generationInterval: any = null;
  board: number[][] = new Array(0);
  interestArea: {[num:string]:number} = {};
  nextGenerationBoard: number[][] = new Array(0);


  buildBoard(height: string, width: string, speed:string) {
    this.nextGenerationBoard = new Array(parseInt(height));
    for (let column = 0; column < this.nextGenerationBoard.length; column++) {
      this.nextGenerationBoard[column] = new Array(parseInt(width)).fill(0);
    }
    this.board = new Array(parseInt(width));
    for (let column = 0; column < this.board.length; column++) {
      this.board[column] = new Array(parseInt(width)).fill(0);
    }
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.isGame = true;
    this.puberty()
  }

  puberty() {
    this.board = JSON.parse(JSON.stringify(this.nextGenerationBoard));
  }

  populate() {
    this.buildBoard(this.height,this.width,this.speed)
    this.board.forEach((row,rowidx) => {
      row.forEach((cell,columnidx) => {
        if (Math.round(Math.random()) > 0) {
          this.lives(rowidx,columnidx)
        }
      })
    })
    this.puberty();
  }

  tell_neighbors(row: number, column: number, didNeighborSurvive:number) {
    for (let rowidx = row - 1; rowidx <= row + 1; rowidx++){
      if (rowidx < 0 || rowidx >= parseInt(this.height)) {
        continue;
      }
      for (let columnidx = column - 1; columnidx <= column + 1; columnidx++){
        if (columnidx < 0 || columnidx >= parseInt(this.width)) {
          continue;
        }
        this.interestArea[`${rowidx}-${columnidx}`] = 0

        if ((column == columnidx && row == rowidx)) {
          continue;
        }
        this.nextGenerationBoard[rowidx][columnidx] +=didNeighborSurvive
      }
    }
  }

  start_game() {
    this.generationInterval = setInterval(() => {
      this.survive()
    },parseInt(this.speed))
  }
  stop_game() {
    clearInterval(this.generationInterval)
    this.generationInterval = null;
  }

  survive() {
    this.board.forEach((row, rowidx) => {
      row.forEach((cell,columnidx) => {
        if (cell >= 14 || cell == 11 || cell == 10 || cell == 3) {
          this.lives(rowidx,columnidx)
        }
      })
    })
    this.puberty();
  }
  swap(row: number, column: number) {
    this.lives(row, column)
    this.puberty()
  }

  lives(row: number, column: number) {
    if (this.board[row][column] >= 10) {
      this.nextGenerationBoard[row][column] -= 10;
      this.tell_neighbors(row,column,-1)
    }
    else {
      this.nextGenerationBoard[row][column] += 10;
      this.tell_neighbors(row,column,1)
    }
  }
};
