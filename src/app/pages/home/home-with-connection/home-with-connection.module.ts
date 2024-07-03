import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomeWithConnectionPageRoutingModule } from './home-with-connection-routing.module';
import { HomeWithConnectionPage } from './home-with-connection.page';
import {NotesMenuComponent} from "../../../components/notes/notes-menu/notes-menu.component";
import {NotepadComponent} from "../../../components/notepad/notepad.component";
import {LinksMenuComponent} from "../../../components/links/links-menu/links-menu.component";
import {NoteResumePipe} from "../../../pipe/note-resume.pipe";
import {FilterLinksByGroupPipe} from "../../../pipe/filter-links-by-group.pipe";
import {SearchEnginesComponent} from "../../../components/search-engines/search-engines.component";
import {CalendarComponent} from "../../../components/calendar/calendar.component";
import {NumberToWordMonthPipe} from "../../../pipe/number-to-word-month.pipe";
import {CalendarByWeekComponent} from "../../../components/calendar/calendar-by-week/calendar-by-week.component";
import {CalendarByDayComponent} from "../../../components/calendar/calendar-by-day/calendar-by-day.component";
import {CalendarByMonthComponent} from "../../../components/calendar/calendar-by-month/calendar-by-month.component";
import {CalendarByYearComponent} from "../../../components/calendar/calendar-by-year/calendar-by-year.component";
import {WordToLetterDayOfWeekPipe} from "../../../pipe/word-to-letter-day-of-week.pipe";
import {ZerotagePipe} from "../../../pipe/zerotage.pipe";
import {CommaSeparatorPipe} from "../../../pipe/comma-separator.pipe";
import {
    CalendarByPlanningComponent
} from "../../../components/calendar/calendar-by-planning/calendar-by-planning.component";
import {DatePlanningPipe} from "../../../pipe/date-planning.pipe";
import {DescriptionPlanningResumePipe} from "../../../pipe/description-planning-resume.pipe";
import {ToolsComponent} from "../../../components/tools/tools.component";
import {CalculatorComponent} from "../../../components/tools/calculator/calculator.component";
import {DemineurComponent} from "../../../components/tools/demineur/demineur.component";
import {DemineurNumberToImage} from "../../../pipe/demineurNumberToImage";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        HomeWithConnectionPageRoutingModule
    ],
  exports: [
    HomeWithConnectionPage,
    NoteResumePipe,
    FilterLinksByGroupPipe
  ],
    declarations: [HomeWithConnectionPage, NotesMenuComponent, NotepadComponent, LinksMenuComponent, NoteResumePipe,
        FilterLinksByGroupPipe, SearchEnginesComponent, CalendarComponent, NumberToWordMonthPipe, CalendarByWeekComponent,
        CalendarByDayComponent, CalendarByMonthComponent, CalendarByYearComponent, WordToLetterDayOfWeekPipe, ZerotagePipe,
        CommaSeparatorPipe, CalendarByPlanningComponent, DatePlanningPipe, DescriptionPlanningResumePipe,
        DescriptionPlanningResumePipe, ToolsComponent, CalculatorComponent, DemineurComponent, DemineurNumberToImage]
})
export class HomeWithConnectionPageModule {}
