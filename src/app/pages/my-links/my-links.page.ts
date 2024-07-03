import { Component, OnInit } from '@angular/core';
import {LinksService} from "../../services/links.service";
import {MemberService} from "../../services/member.service";
import {LinksGroup} from "../../models/groupLinksModel";
import {Link} from "../../models/linksModel";
import {ActivatedRoute} from "@angular/router";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-my-links',
  templateUrl: './my-links.page.html',
  styleUrls: ['./my-links.page.scss'],
})
export class MyLinksPage implements OnInit {
  groupLinksList!:LinksGroup[];
  linksList!:Link[];

  constructor(
    private _linksService : LinksService,
    private _memberService : MemberService,
    private ar : ActivatedRoute,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.isConnectedResolver();
    this.getGroupListResolver();
    this.getLinksListResolver();
    this.getEmitter();
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {});
  }

  getGroupListResolver() {
    this.ar.data.subscribe(({linksGroupResolver}) => {
      this.groupLinksList = linksGroupResolver.results.linksGroup;
    })
  }

  getLinksListResolver() {
    this.ar.data.subscribe(({linksResolver}) => {
      this.linksList = linksResolver.results.links;
    })
  }

  getEmitter() {
    this._linksService.getLinksUpdateEmitter().subscribe( {
      next: () => {
        this.getGroupList();
        this.getLinksList();
      }
    })
  }

  getGroupList() {
    this._linksService.getGroupLinksList().subscribe({
      next: (data) => {
        this.groupLinksList = data.results.linksGroup;
      }
    })
  }

  getLinksList() {
    this._linksService.getLinksList().subscribe({
      next: (data) => {
        this.linksList = data.results.links;
      }
    })
  }

  clickOnLink(id : number) {
    this._linksService.clickOnLink(id).subscribe({
      error : (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }
}
