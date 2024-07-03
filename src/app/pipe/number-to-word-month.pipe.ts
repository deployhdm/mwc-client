import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWordMonth'
})
export class NumberToWordMonthPipe implements PipeTransform {

  transform(month: number): string {
    if (month === 1) return "Janvier";
    if (month === 2) return "Février";
    if (month === 3) return "Mars";
    if (month === 4) return "Avril";
    if (month === 5) return "Mai";
    if (month === 6) return "Juin";
    if (month === 7) return "Juillet";
    if (month === 8) return "Août";
    if (month === 9) return "Septembre";
    if (month === 10) return "Octobre";
    if (month === 11) return "Novembre";
    if (month === 12) return "Décembre";
    return "Not a Month";
  }

}
