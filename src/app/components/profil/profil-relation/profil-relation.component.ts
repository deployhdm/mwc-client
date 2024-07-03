import { Component, OnInit } from '@angular/core';
import {RelationService} from "../../../services/relation.service";
import {ErrorService} from "../../../services/error.service";
import {Relation} from 'src/app/models/relationModel';
import {MenuDisplay} from "../../../models/linksUtilsModel";
import {Receive, Send} from "../../../models/invitationModel";

@Component({
  selector: 'app-profil-relation',
  templateUrl: './profil-relation.component.html',
  styleUrls: ['./profil-relation.component.scss'],
})
export class ProfilRelationComponent implements OnInit {
  relation:Relation[]=[];
  isMenuDisplay:MenuDisplay[] = [];
  isMenuInvitationReceiveDisplay:MenuDisplay[] = [];
  isMenuInvitationSendDisplay:MenuDisplay[] = [];
  invitationSend:Send[]=[];
  invitationReceive:Receive[]=[];
  relationLoaded!:boolean;
  emailGuest!:string;

  constructor(
    private _relationService : RelationService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getAllRelation();
    this.getAllInvitation();
  }

  getAllRelation() {
    this.relationLoaded = false;
    this._relationService.getAllRelation().subscribe({
      next: (data) => {
        this.relation = data.result.friends;

        for (let element of this.relation) {
          this.isMenuDisplay.push({id:element.id, display:false});
        }
        this.relationLoaded = true;
      },
      error: (error) =>{
        this._errorService.errorHandler(error);
      }
    })
  }

  getAllInvitation() {
    this._relationService.getAllInvitation().subscribe({
      next: (data) => {
        this.invitationReceive = data.result.receive;
        this.invitationSend = data.result.send;

        for (let element of this.invitationReceive) {
          this.isMenuInvitationReceiveDisplay.push({id:element.id, display:false});
        }

        for (let element of this.invitationSend) {
          this.isMenuInvitationSendDisplay.push({id:element.id, display:false});
        }
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  deleteRelation(id: number) {
    this._relationService.deleteRelation(id).subscribe({
      next: () => {
        this.isMenuDisplay=[];
        this.getAllRelation();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

  acceptInvitation(id:number) {
    this._relationService.acceptInvitation(id).subscribe({
      next: ()=> {
        this.isMenuInvitationReceiveDisplay=[];
        this.getAllRelation();
        this.getAllInvitation();
      },
      error: (error) => {
        console.log(error);
        this._errorService.errorHandler(error);
      }
    })
  }

  refuseInvitation(id:number) {
    this._relationService.refuseInvitation(id).subscribe({
      next: () => {
        this.isMenuInvitationReceiveDisplay=[];
        this.getAllRelation();
        this.getAllInvitation();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  sendInvitation() {
    this._relationService.sendInvitation(this.emailGuest).subscribe({
      next: () => {
        this.emailGuest = "";
        this.getAllInvitation();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  deleteInvitation(id:number) {
    this._relationService.deleteInvitation(id).subscribe({
      next: (data) => {
        this.getAllInvitation();
        console.log(data);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  isMenuMyRelationsDisplay(id:number) {
    const menu = this.isMenuDisplay.find(menu => menu.id === id);
    if (menu) {
      return menu.display;
    }

    return false;
  }

  menuDisplay(id:number) {
    this.isMenuInvitationReceiveDisplay.map((a) => a.display = false);
    this.isMenuInvitationSendDisplay.map((a) => a.display = false);
    const menu = this.isMenuDisplay.find(menu => menu.id === id);
    this.isMenuDisplay.map((a) => {
      if (a.id !== id) {
        a.display = false
      }
    });

    if(menu) {
      menu.display = !menu.display;
    }
  }

  isMenuInvitationsReceiveDisplay(id:number) {
    const menu = this.isMenuInvitationReceiveDisplay.find(menu => menu.id === id);
    if (menu) {
      return menu.display;
    }

    return false;
  }

  menuInvitationReceiveDisplay(id:number) {
    this.isMenuInvitationSendDisplay.map((a) => a.display = false);
    this.isMenuDisplay.map((a) => a.display = false);
    const menu = this.isMenuInvitationReceiveDisplay.find(menu => menu.id === id);
    this.isMenuInvitationReceiveDisplay.map((a) => {
      if (a.id !== id) {
        a.display = false
      }
    });

    if(menu) {
      menu.display = !menu.display;
    }
  }

  isMenuInvitationsSendDisplay(id:number) {
    const menu = this.isMenuInvitationSendDisplay.find(menu => menu.id === id);
    if (menu) {
      return menu.display;
    }

    return false;
  }

  menuInvitationSendDisplay(id:number) {
    this.isMenuInvitationReceiveDisplay.map((a) => a.display = false);
    this.isMenuDisplay.map((a) => a.display = false);
    const menu = this.isMenuInvitationSendDisplay.find(menu => menu.id === id);
    this.isMenuInvitationSendDisplay.map((a) => {
      if (a.id !== id) {
        a.display = false
      }
    });

    if(menu) {
      menu.display = !menu.display;
    }
  }
}
