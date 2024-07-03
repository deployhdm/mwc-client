import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptionPlanningResume'
})
export class DescriptionPlanningResumePipe implements PipeTransform {

  transform(value: string): string {
    if (value.length > 300) {
      return value.substring(0, 300) + "......";
    }

    return value;
  }


}
