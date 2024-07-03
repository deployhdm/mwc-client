import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AlertService} from "./alert.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class DemineurService{
  api:string = environment.api;
  isOpenDemineur : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  board!:Array<Array<string>> | null;
  allreadyCheck!:Array<Array<boolean>> | null;
  boardObservable! : BehaviorSubject<Array<Array<string>>>;
  numberBombRemaining : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberClickRemaining!:number;
  firstClick!:boolean;
  bomb!:Array<Array<boolean>> | null;
  gameover!:boolean;
  gameoverObservable : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  iMax!:number;
  jMax!:number;
  timer: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberBomb!:number;
  currentDifficulty:BehaviorSubject<string> = new BehaviorSubject<string>('easy');
  timerInterval!:any;

  constructor(
    private _alertService : AlertService,
    private _client : HttpClient,
    private _errorService : ErrorService
  ) { }


  getHighScoreEasy() : Observable<any> {
    return this._client.get<any>(this.api + "mine/easy");
  }

  getHighScoreMedium() : Observable<any> {
    return this._client.get<any>(this.api + "mine/medium");
  }

  getHighScoreHard() : Observable<any> {
    return this._client.get<any>(this.api + "mine/hard");
  }

  getMyHighScoreEasy() : Observable<any> {
    return this._client.get<any>(this.api + "mine/easy/user");
  }

  getMyHighScoreMedium() : Observable<any> {
    return this._client.get<any>(this.api + "mine/medium/user");
  }

  getMyHighScoreHard() : Observable<any> {
    return this._client.get<any>(this.api + "mine/hard/user");
  }

  newBoard(difficulty:string) {
    if (difficulty === 'easy') {
      this.currentDifficulty.next('easy');
      this.numberBombRemaining.next(10);
      this.numberBomb = 10;
      this.numberClickRemaining = 71;
      this.iMax = 8;
      this.jMax = 8;
    }

    if (difficulty === 'medium') {
      this.currentDifficulty.next('medium');
      this.numberBombRemaining.next(40);
      this.numberBomb = 40;
      this.numberClickRemaining = 216;
      this.iMax = 15;
      this.jMax = 15;
    }

    if (difficulty === 'hard') {
      this.currentDifficulty.next('hard');
      this.numberBombRemaining.next(99);
      this.numberBomb = 99;
      this.numberClickRemaining = 381;
      this.iMax = 15;
      this.jMax = 29;
    }

    this.firstClick = true;
    this.gameover = false;
    this.gameoverObservable.next(false);
    this.timer.next(0);
    this.stopTimer();
    this.startTimer();

    this.createBoard();
    this.createBomb();
    this.createAllreadyCheck();
  }

  toogleIsOpen() {
    this.isOpenDemineur.next(!this.isOpenDemineur.value);
  }

  rightClick(i:number, j:number) {
    if (!this.gameover && !this.firstClick) {
      if (this.board![i][j] === "unknown") {
        this.board![i][j] = "flag";
        this.boardObservable!.next(this.board!);
        this.numberBombRemaining.next(this.numberBombRemaining.value - 1);

        return;
      }

      if (this.board![i][j] === "flag") {
        this.board![i][j] = "interrogation";
        this.boardObservable!.next(this.board!);
        this.numberBombRemaining.next(this.numberBombRemaining.value + 1);

        return;
      }

      if (this.board![i][j] === "interrogation") {
        this.board![i][j] = "unknown";
        this.boardObservable!.next(this.board!);

        return;
      }
    }
  }

  leftClick(i:number, j:number) {
    if (!this.gameover) {
      if (this.firstClick) {
        this.firstClick = false;
        this.loadBomb(i, j);
      }

      this.checkBomb(i, j, true);
    }
  }

  loadBomb(i:number, j:number) {
      let count = this.numberBombRemaining.value;
      let rand1 = 0;
      let rand2 = 0;

      while (count > 0) {
        rand1 = this.rand(this.iMax + 1, 0);
        rand2 = this.rand(this.jMax + 1, 0);

        if ( (rand1 !== i && rand2 !==j ) && !this.bomb![rand1][rand2] ) {
          this.bomb![rand1][rand2] = true;
          count--;
        }
      }
  }

  checkBomb(i:number, j:number, clickActive: boolean) {
    if (!this.isset(i, j)) {
      return;
    }

    if (this.bomb![i][j] && clickActive) {
      this.gameover = true;
      this.gameoverObservable.next(true);
      this.board![i][j] = "bomb";
      this.boardObservable!.next(this.board!);
      this.stopTimer();

      return;
    }

    if (this.bomb![i][j] && !clickActive) {
      return;
    }

    this.allreadyCheck![i][j] = true;
    this.numberClickRemaining--;
    if(this.numberClickRemaining === 0) {
      this.winGame();
      this.stopTimer();
    }

    let count:number = 0;

    this.checkNeighbor(i-1, j-1) && count++;
    this.checkNeighbor(i-1, j) && count++;
    this.checkNeighbor(i-1, j+1) && count++;
    this.checkNeighbor(i, j-1) && count++;
    this.checkNeighbor(i, j+1) && count++;
    this.checkNeighbor(i+1, j-1) && count++;
    this.checkNeighbor(i+1, j) && count++;
    this.checkNeighbor(i+1, j+1) && count++;

    if (count > 0) {
      this.board![i][j] = "number" + count.toString();

      return;
    }

    if (count === 0) {
      this.board![i][j] = "number" + count.toString();

      this.checkOtherBoxNeighbor(i-1, j-1);
      this.checkOtherBoxNeighbor(i-1, j);
      this.checkOtherBoxNeighbor(i-1, j+1);
      this.checkOtherBoxNeighbor(i, j-1);
      this.checkOtherBoxNeighbor(i, j+1);
      this.checkOtherBoxNeighbor(i+1, j-1);
      this.checkOtherBoxNeighbor(i+1, j);
      this.checkOtherBoxNeighbor(i+1, j+1);
    }
  }

  checkNeighbor(i:number, j:number) {
    if (this.isset(i, j)) {
      if (this.bomb![i][j]) {
        return true;
      }
    }

    return false;
  }

  checkOtherBoxNeighbor(i:number, j:number) {
    if (this.isset(i, j)) {
      if (!this.allreadyCheck![i][j]) {
        this.checkBomb(i, j, false);
      }
    }
  }

  isset(i:number, j:number) {
    return !(i < 0 || j < 0 || i > this.iMax || j > this.jMax);
  }

  createAllreadyCheck() {
    this.allreadyCheck = null;
    this.allreadyCheck = new Array(this.iMax + 1);
    for (let i = 0; i <= this.iMax; i++) {
      this.allreadyCheck[i] = new Array(this.jMax + 1);
      for (let j = 0; j <= this.jMax; j++) {
        this.allreadyCheck[i][j] = false;
      }
    }
  }

  createBomb(){
    this.bomb = null;
    this.bomb = new Array(this.iMax + 1);
    for (let i = 0; i <= this.iMax; i++) {
      this.bomb[i] = new Array(this.jMax + 1);
      for (let j = 0; j <= this.jMax; j++) {
        this.bomb[i][j] = false;
      }
    }
  }

  createBoard() {
    this.board = null;
    this.board = new Array(this.iMax + 1);
    for (let i = 0; i <= this.iMax; i++) {
      this.board[i] = new Array(this.jMax + 1);
      for (let j = 0; j <= this.jMax; j++) {
        this.board[i][j] = "unknown";
      }
    }

    this.boardObservable = new BehaviorSubject<Array<Array<string>>>(this.board);
  }

  winGame() {
    this.gameover = true;
    this._alertService.alerte("Victoire", "Bravo, vous avez trouvé toutes les bombes");

    for (let i = 0; i <= this.iMax; i++) {
      for (let j = 0; j <= this.jMax; j++) {
        if (this.bomb![i][j]) {
          this.board![i][j] = "flag";
        }
      }
    }

    this.addHighScore().subscribe({
      next: (data) => {
        if (data.result.highscore) {
          this._alertService.alerte("Bravo !", "vous venez de réaliser l'un de vos 10 meilleurs temps ! Votre " +
            "score vient d'être ajouté à votre tableau de highscore !!")
        }
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })

    this.boardObservable.next(this.board!);
    this.numberBombRemaining.next(0);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
        this.timer.next(this.timer.value + 1);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  addHighScore() :Observable<any>{
    return this._client.post<any>(this.api + "mine/" + this.currentDifficulty.value + "/user", {
      difficulty : this.currentDifficulty.value,
      score : this.timer.value
    })
  }

  rand(number:number, base?:number) {
    if (base===undefined) base=1;

    return (Math.floor(Math.random()*number))+base;
  }

}
