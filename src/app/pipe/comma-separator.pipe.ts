import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparator'
})
export class CommaSeparatorPipe implements PipeTransform {

  transform(value: string, array: any, index: number, specifique?: string): string {
    if (specifique === "participant") {
      array = array.filter((a: { isChecked: boolean; }) => a.isChecked);
    }

    console.log("array", array);
    console.log("index", index);
    console.log("arr", array[array.length-1].id);

    if (array[array.length-1].id !== index) {
      return value + ", "
    }

    return value;
  }

}
