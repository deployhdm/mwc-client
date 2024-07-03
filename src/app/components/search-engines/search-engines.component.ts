import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-engines',
  templateUrl: './search-engines.component.html',
  styleUrls: ['./search-engines.component.scss'],
})
export class SearchEnginesComponent implements OnInit {
  search!:string;

  constructor() { }

  ngOnInit() {}

  loadSearch(){
    window.open("https://www.google.com/search?q=" + this.search, "_blank");
  }

  emptySearch() {
    this.search = "";
  }
}
