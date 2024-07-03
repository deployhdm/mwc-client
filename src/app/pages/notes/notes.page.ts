import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../services/notes.service";
import {MemberService} from "../../services/member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorService} from "../../services/error.service";
import { AlertService } from 'src/app/services/alert.service';
import { PermissionLevel } from 'src/app/models/collaboratorModel';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  note!:any;
  id!:number;
  permissionLevel!: keyof typeof PermissionLevel;
  permissions = PermissionLevel;
  email: string = '';
  selectedPermission!:PermissionLevel;
  collaborators!: any[];

  constructor(
    private ar : ActivatedRoute,
    private _notesService : NotesService,
    private _router : Router,
    private _errorService : ErrorService,
    private _alerteService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.permissionLevel = this.ar.snapshot.queryParams['permissionLevel'];
    console.log(this.permissionLevel)
    this.isConnectedResolver();
    this.getNote();
    if ((this.permissionLevel === 'WRITE_AND_SHARE') || (this.permissionLevel == undefined)) {
      this.getCollaborators();
      console.log(this.collaborators)
    }
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {});
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

  onCancel() {
    this.email = '';
  }

  sendInvitation() {
    if (this.collaborators.some(collaborator => collaborator.email === this.email)){
      this._alerteService.alerte('Ajout non autorisé', 'La note est déjà partagée avec cet email')
      this.email = ''
      return;
    }
    this._notesService.sendInvitationCollaborator(this.email, this.selectedPermission, this.id).subscribe({
      next: (data) => {
        this.getCollaborators();
        location.reload()
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  cancelInvitation(email: string){
    this._notesService.cancelInvitationCollaborator(email, this.id).subscribe({
      next: (data) => {
        location.reload();
        this.getCollaborators();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getCollaborators(){
    this._notesService.getCollaborators(this.id).subscribe({
      next: (data) => {
        this.collaborators = data.result.collaborators.map(collaborator => ({
          ...collaborator,
          showMenu: false
        }))
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getNote(){
    this._notesService.getOneNote(this.id).subscribe({
      next: (data) => {
        this.note = data.result.notes;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  changeNote() {
    this._notesService.updateNote(this.note.title, this.note.content, this.id).subscribe({});
  }

  deleteNote() {
    this._notesService.deleteNote(this.note.id).subscribe({
      next: () => {
        this._router.navigate(['home']);
      }
    });
  }
}
