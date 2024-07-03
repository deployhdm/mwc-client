import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterLinksByGroup'
})
export class FilterLinksByGroupPipe implements PipeTransform {

  transform(value: any[] | null | undefined, ...args: unknown[]): any[] | null | undefined {
    if (value) {
      return value.filter(v => v.linksGroupId == args[0]);
    }

    return value;
  }

}
