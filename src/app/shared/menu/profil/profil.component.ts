import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profil-menu',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  homeImg = "/assets/image/home.png";
  informationImg = "/assets/image/information.png";
  relationImg = "/assets/image/relation.png";
  linkInformation = "link";
  linkRelation = "link";
  menuChosen!:string;
  @Output() menuChosenEvent = new EventEmitter<string>();

  constructor(
    private _router : Router
  ) { }

  ngOnInit() {}

  menuChoose(target: string) {
    if (target == "accueil") {
      this._router.navigate(['/home']);
    }

    this.menuChosen = target;

    target == "information" ? this.linkInformation = "link selected" : this.linkInformation = "link";
    target == "relation" ? this.linkRelation = "link selected" : this.linkRelation = "link";

    this.menuChosenEvent.emit(this.menuChosen);
  }

  changeImage (target: string) {
    if (target == "home") {
      this.homeImg == "/assets/image/home.png" ?
        this.homeImg="/assets/image/homeHover.png" :
        this.homeImg="/assets/image/home.png" ;
    }

    if (target == "information") {
      this.informationImg == "/assets/image/information.png" ?
        this.informationImg="/assets/image/informationHover.png" :
        this.informationImg="/assets/image/information.png" ;
    }

    if (target == "relation") {
      this.relationImg == "/assets/image/relation.png" ?
        this.relationImg="/assets/image/relationHover.png" :
        this.relationImg="/assets/image/relation.png" ;
    }
  }

}
