import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'demineurNumberToImage'
})
export class DemineurNumberToImage implements PipeTransform {

  transform(value: number, unit: string): string {
    let url = '/assets/image/mine';
    if (value > 999) {
      value = 999;
    }

    let valueString = value.toString();

    if (valueString.length === 1) {
      valueString="0" + valueString;
    }

    if (valueString.length === 2) {
      valueString="0" + valueString;
    }

    if (unit === 'centaine') {
      return url + valueString[0] + '.png';
    }

    if (unit === 'dizaine') {
      return url + valueString[1] + '.png';
    }

    if (unit === 'unite') {
      return url + valueString[2] + '.png';
    }


    return value.toString();
  }

}
