import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private _alertController : AlertController
  ) { }

  async alerte(title:string, message: string) {
    const alert = await this._alertController.create({
      header: title,
      message: message,
      cssClass: 'alerte',
      buttons: ['OK'],
    });

    await alert.present();
  }

}
