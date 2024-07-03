import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordToLetterDayOfWeek'
})
export class WordToLetterDayOfWeekPipe implements PipeTransform {

  transform(theDay: string): string {
    return theDay.substring(1, 0);
  }

}
