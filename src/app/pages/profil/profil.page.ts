import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  menuChosen!:string;

  constructor() { }

  ngOnInit() {
  }

  onMenuChosen(target:string) {
    this.menuChosen = target;
  }
}
