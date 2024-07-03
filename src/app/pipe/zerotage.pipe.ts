import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zerotage'
})
export class ZerotagePipe implements PipeTransform {

  transform(number: number): string {
    if (number === 0) return "00";
    if (number === 1) return "01";
    if (number === 2) return "02";
    if (number === 3) return "03";
    if (number === 4) return "04";
    if (number === 5) return "05";
    if (number === 6) return "06";
    if (number === 7) return "07";
    if (number === 8) return "08";
    if (number === 9) return "09";

    return number.toString();
  }

}
