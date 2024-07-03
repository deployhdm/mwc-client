import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePlanning'
})

export class DatePlanningPipe implements PipeTransform {

  transform(value: string, type? : string, event? : any, dateToday? : any): string {
    const dateEvent = new Date(value);

    const date = `${this.zerotage(dateEvent.getDate())}/${this.zerotage(dateEvent.getMonth()+1)}/${this.zerotage(dateEvent.getFullYear())}`;
    const hours = `${this.zerotage(dateEvent.getHours())}H${this.zerotage(dateEvent.getMinutes())}`;

    if (type && type === "hour") {
      if (event && event.dateEnding) {
        const today = new Date(dateToday.year, dateToday.month - 1, dateToday.day);
        const dateEnd = new Date(event.dateEnding);

        if ( ( today.getDate() === dateEvent.getDate() && today.getMonth() === dateEvent.getMonth() &&
          today.getFullYear() === dateEvent.getFullYear() ) && ( today.getDate() === dateEnd.getDate() &&
          today.getMonth() === dateEnd.getMonth() && today.getFullYear() === dateEnd.getFullYear() ) ) {
          return `De ${hours} à ${this.zerotage(dateEnd.getHours())}H${this.zerotage(dateEnd.getMinutes())}`;
        }

        if (today.getDate() === dateEvent.getDate() && today.getMonth() === dateEvent.getMonth() &&
          today.getFullYear() === dateEvent.getFullYear()) {
          return `A partir de ${hours}`;
        }

        if (today.getDate() === dateEnd.getDate() && today.getMonth() === dateEnd.getMonth() &&
          today.getFullYear() === dateEnd.getFullYear()) {
          return `Jusqu'à ${this.zerotage(dateEnd.getHours())}H${this.zerotage(dateEnd.getMinutes())}`;
        }

        return `Toute la journée`;
      }

      return `${hours}`;
    }

    return `${date} ${hours}`;
  }

  zerotage(number: number): string {
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
