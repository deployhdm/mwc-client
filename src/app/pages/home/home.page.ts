import { Component } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isConnected!: boolean;

  constructor(
    private ar : ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isConnectedResolver();
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {
      this.isConnected = isConnectedResolver;
    })
  }
}
