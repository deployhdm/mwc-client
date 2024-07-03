import { Component, OnInit } from '@angular/core';
import {NotepadService} from "../../services/notepad.service";
import {MemberService} from "../../services/member.service";
import {NotesService} from "../../services/notes.service";
import {Router} from "@angular/router";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss'],
})
export class NotepadComponent implements OnInit {
  notepadText!:string;
  scrollingMenu!:boolean;

  constructor(
    private _notepadService : NotepadService,
    private _memberService : MemberService,
    private _notesService : NotesService,
    private _router : Router,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getNotepad();
  }

  getNotepad() {
    this._notepadService.getNotepad().subscribe({
      next: (data: any) => {
        this.notepadText = data.result.notepad.content;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  changeNotepadText() {
    this._notepadService.updateText(this.notepadText).subscribe({});
  }

  displayScrollingMenu() {
    this.scrollingMenu = !this.scrollingMenu;
  }

  makeEmpty() {
    this.notepadText="";
    this.changeNotepadText();
  }

  makeItANote() {
    this._notesService.createNoteFull("Bloc-Notes", this.notepadText).subscribe({
      next: (data:any) => {
        const id = data.result.id;
        this.displayScrollingMenu();
        this.makeEmpty();
        this._router.navigate(['notes/' + id]);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }
}
