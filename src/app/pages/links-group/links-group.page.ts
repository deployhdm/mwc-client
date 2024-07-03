import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {LinksService} from "../../services/links.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LinksGroup} from "../../models/groupLinksModel";
import {Link} from "../../models/linksModel";
import { Collaborator, PermissionLevel } from 'src/app/models/collaboratorModel';
import { ErrorService } from 'src/app/services/error.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-links-group',
  templateUrl: './links-group.page.html',
  styleUrls: ['./links-group.page.scss'],
})
export class LinksGroupPage implements OnInit {
  groupLinksList!:LinksGroup[];
  linksList!:Link[];
  groupLinksName!:string;
  groupLinksMember!:string;
  id!:number;
  linksListNgModel!:Link[];
  errorDelete: boolean = false;
  permissionLevel!: keyof typeof PermissionLevel;
  permissions = PermissionLevel;
  email: string = '';
  selectedPermission!:PermissionLevel;
  collaborators!: any[];


  constructor(
    private ar : ActivatedRoute,
    private _memberService : MemberService,
    private _linksService : LinksService,
    private _router : Router,
    private _errorService: ErrorService,
    private _alerteService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.permissionLevel = this.ar.snapshot.queryParams['permissionLevel'];
    this.isConnectedResolver();
    this.getGroupListResolver();
    this.getLinksListResolver();
    this.getEmitter();
    if ((this.permissionLevel === 'WRITE_AND_SHARE') || (this.permissionLevel == undefined)) {
      this.getCollaborators();
    }
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {});
  }

  getGroupListResolver() {
    this.ar.data.subscribe(({linksGroupResolver}) => {
      this.groupLinksList = linksGroupResolver.results.linksGroup.filter((v: { id: number; }) => v.id == this.id);
      this.groupLinksName = this.groupLinksList[0].name;
      this.groupLinksMember = this.groupLinksList[0].member;
    })
  }

  getLinksListResolver() {
    this.ar.data.subscribe(({linksResolver}) => {
      this.linksList = linksResolver.results.links.filter((v: { linksGroupId: number; }) => v.linksGroupId == this.id);
      this.linksListNgModel = JSON.parse(JSON.stringify(this.linksList));
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
        this.groupLinksList = data.results.linksGroup.filter(v => v.id == this.id);
        this.groupLinksName = this.groupLinksList[0].name;
      }
    })
  }

  getLinksList() {
    this._linksService.getLinksList().subscribe({
      next: (data) => {
        this.linksList = data.results.links.filter(v => v.linksGroupId == this.id);
        this.linksListNgModel = JSON.parse(JSON.stringify(this.linksList));
      }
    })
  }

  updateLink(id:number) {
    const link = this.linksListNgModel.find(link => link.id === id);
    if (link) {
      this._linksService.updateLink(link.id, link.name, link.link).subscribe({})
    }
  }

  deleteLink(id:number) {
    this._linksService.deleteLink(id).subscribe({})
  }

  updateGroupLinksName() {
    this._linksService.updateGroupLinksName(this.id, this.groupLinksName).subscribe({})
  }

  deleteGroupLinks() {
    if (this.linksList.length === 0) {
      this._linksService.deleteGroupLinks(this.id).subscribe({});
      this.errorDelete = false;
      this._router.navigate(['home/']);

      return;
    }

    this.errorDelete = true;
  }

  getPermissionLevelKeys() {
    return Object.keys(this.permissions) as (keyof typeof PermissionLevel)[];
  }

  getPermissionLevelValue(permissionLevel: keyof typeof PermissionLevel): string {
    return this.permissions[permissionLevel]
  }

  toggleCollaboratorPermissionMenu(collaborator: any): void {
    collaborator.showMenu = !collaborator.showMenu
  }

  shareGroupLinks() {
    if (this.collaborators.some(collaborator => collaborator.email === this.email)){
      this._alerteService.alerte('Partage actif', 'Le groupe de liens est déjà partagé avec cet utilisateur.')
      this.email = ''
      return;
    }
    if (this.groupLinksMember === this.email) {
      this._alerteService.alerte('', 'Le mail que vous essayez de rajouter est déjà le propriétaire du groups de liens')
      this.email = ''
      return;
    }
    this._linksService.shareGroupLinks(this.email, this.selectedPermission, this.id).subscribe({
      next: (data) => {
        this.getCollaborators();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getCollaborators() {
    this._linksService.getCollaborators(this.id).subscribe({
      next: (data) => {
        this.collaborators = data.collaborators.map((collaborator: Collaborator) => ({
          ...collaborator,
          showMenu: false
        }))
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  cancelInvitation(email: string){
    this._linksService.cancelInvitation(email, this.id).subscribe({
      next: (data) => {
        this.getCollaborators();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
