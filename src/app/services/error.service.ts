import { Injectable } from '@angular/core';
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private _alert : AlertService
  ) { }

  errorHandler(error:any) {
    if (error.error.fieldErrors !== undefined) {
      if (error.error.fieldErrors.email) {
        this._alert.alerte("Erreur d'email", "Votre email doit être un email valide");

        return;
      }

      if (error.error.fieldErrors.firstname || error.error.fieldErrors.lastname) {
        this._alert.alerte("Erreur de nom", "Votre nom et votre prénom doivent être composé de minimum 2 lettres");

        return;
      }

      if (error.error.fieldErrors.password) {
        this._alert.alerte("Erreur de mot de passe", `Votre mot de passe doit contenir au minimum
            8 caractères DONT au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial`);

        return;
      }
    }

    if (error.error.message !== undefined) {
      if (error.error.message == "Bad Credential") {
        this._alert.alerte("Erreur de connexion", "Le duo email/mot de passe ne correspond pas");

        return;
      }
    }

    if (error.error.message !== undefined) {
      if (error.error.message == "Error occurred. Email not found") {
        this._alert.alerte("", "Ce mail n'existe pas");

        return;
      }
    }
    if (error.error.message !== undefined) {
      if (error.error.message == "No valid token found") {
        this._alert.alerte("Lien expiré", "Veuillez faire une autre demande de réinitialisation de mot de passe.");

        return;
      }
    }

    if (error.error.message !== undefined) {
      if (error.error.message == "This link group is already shared with user.") {
        this._alert.alerte("Partage actif", "Ce groupe de liens est déjà partagé avec cet utilisateur.");

        return;
      }
    }
    
    if (error.error.message !== undefined) {
      this._alert.alerte(error.error.statusCode, error.error.message);
      
      return;
    }

    if (error.message !== undefined) {
      if (error.message === "Http failure response for http://localhost:8080/api/auth/login: 0 Unknown Error" ||
        "Http failure response for http://192.168.0.10:8080/api/auth/login: 0 Unknown Error") {
        this._alert.alerte("Erreur de connexion serveur", "Le serveur backend ne repond pas");

        return;
      }
    }

    this._alert.alerte("Erreur inconnue", `Une erreur inconnue vient de se dérouler, merci de prendre
        contact avec un administrateur.`);
  }
}
