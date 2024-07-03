import { Component, OnInit } from '@angular/core';
import {DemineurService} from "../../../services/demineur.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-demineur',
  templateUrl: './demineur.component.html',
  styleUrls: ['./demineur.component.scss', './highscore.component.scss'],
})
export class DemineurComponent implements OnInit {
  board!:any;
  numberBombRemaining!:number;
  timer!:number;
  currentDifficulty!:string;
  modal:string = 'contentModalMiddleScreen easy';
  demineur:string = 'demineur easy';
  gamePad:string = 'gamePad easy';
  filesMenu:boolean = false;
  highScoreMenu:boolean = false;
  optionMenuFiles:string = 'optionMenuFiles';
  optionMenuHighScore:string = 'optionMenuHighScore';
  highscore!:any;
  displayModalHighScore:boolean = false;
  smileys:string = "/assets/image/base.png";

  constructor(
    private _demineurService : DemineurService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.newBoard('easy');
    this.watchBoard();
    this.watchBomb();
    this.watchTimer();
    this.watchCurrentDifficulty();
    this.watchGameOver();
  }

  watchBoard() {
    this._demineurService.boardObservable.subscribe({
      next: (data) => {
        this.board = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchBomb() {
    this._demineurService.numberBombRemaining.subscribe({
      next: (data) => {
        this.numberBombRemaining = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchTimer() {
    this._demineurService.timer.subscribe({
      next: (data) => {
        this.timer = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchGameOver() {
    this._demineurService.gameoverObservable.subscribe({
      next: (data) => {
        if (data) {
          setTimeout(()=> {
            this.smileys = "/assets/image/lose.png";
          }, 300);
        }
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  watchCurrentDifficulty() {
    this._demineurService.currentDifficulty.subscribe({
      next: (data) => {
        this.currentDifficulty = data;
      },
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getHighScoreEasy() {
    this._demineurService.getHighScoreEasy().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getHighScoreMedium() {
    this._demineurService.getHighScoreMedium().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
        console.log(data);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getHighScoreHard() {
    this._demineurService.getHighScoreHard().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getMyHighScoreEasy() {
    this._demineurService.getMyHighScoreEasy().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getMyHighScoreMedium() {
    this._demineurService.getMyHighScoreMedium().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getMyHighScoreHard() {
    this._demineurService.getMyHighScoreHard().subscribe({
      next: (data) => {
        this.highscore = data.results.highscore;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  newBoard(difficulty:string) {
    this._demineurService.newBoard(difficulty);
  }

  newGame() {
    this._demineurService.newBoard(this.currentDifficulty);
    this.watchBoard();
    this.watchBomb();
    this.watchTimer();
    this.watchCurrentDifficulty();
    this.smileys = "/assets/image/newgame.png";
    this.smileysBase();
  }

  chooseGame(difficulty:string) {
    this.currentDifficulty = difficulty;
    this.modal = 'contentModalMiddleScreen ' + difficulty;
    this.demineur = 'demineur ' + difficulty;
    this.gamePad = 'gamePad ' + difficulty;
    this.toogleFilesMenu();
    this.newGame();
  }

  toogleFilesMenu() {
    this.filesMenu = !this.filesMenu;
    this.optionMenuFiles === 'optionMenuFiles' ?
      this.optionMenuFiles = 'optionMenuFiles selected' :
      this.optionMenuFiles = 'optionMenuFiles';
  }

  toogleHighScoreMenu() {
    this.highScoreMenu = !this.highScoreMenu;
    this.optionMenuHighScore === 'optionMenuHighScore' ?
      this.optionMenuHighScore = 'optionMenuHighScore selected' :
      this.optionMenuHighScore = 'optionMenuHighScore';
  }

  displayHighScore(type : string) {
    this.displayModalHighScore = true;

    if (type === "allEasy") {
      this.getHighScoreEasy();
    }

    if (type === "allMedium") {
      this.getHighScoreMedium();
    }

    if (type === "allHard") {
      this.getHighScoreHard();
    }

    if (type === "myEasy") {
      this.getMyHighScoreEasy();
    }

    if (type === "myMedium") {
      this.getMyHighScoreMedium();
    }

    if (type === "myHard") {
      this.getMyHighScoreHard();
    }

    this.toogleHighScoreMenu();
  }

  closeHighScore() {
    this.displayModalHighScore = false;
  }

  close() {
    this._demineurService.toogleIsOpen();
  }

  rightClick(event: MouseEvent, i: number, j: number) {
    event.preventDefault();
    this._demineurService.rightClick(i, j);
    this.smileys = "/assets/image/flagged.png";
    this.smileysBase();
  }

  leftClick(i: number, j: number) {
    this.smileys = "/assets/image/found.png";
    this.smileysBase();
    this._demineurService.leftClick(i, j);
  }

  smileysBase() {
    setTimeout(()=> {
      this.smileys = "/assets/image/base.png";
    }, 300);
  }
}
