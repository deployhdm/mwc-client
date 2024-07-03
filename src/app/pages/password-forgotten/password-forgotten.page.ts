import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ErrorService } from 'src/app/services/error.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.page.html',
  styleUrls: ['./password-forgotten.page.scss'],
})
export class PasswordForgottenPage implements OnInit {
  email!:string;
  token!:string | null;
  newPassword!:string;
  newPasswordConfirmation!:string;
  resetSuccess!:boolean;
  resetError!:string;
  memberId!: number;

  constructor(
    private route: ActivatedRoute,
    private _memberService: MemberService,
    private _router: Router,
    private _alertService : AlertService,
    private _errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['token']) {
        console.log('Raw token:', params['token'])
        let token = params['token'];
        // token = token.replace(/%2F/g, '/') // manually decode
        this.token = encodeURIComponent(token);
        console.log(this.token)
        this.getMemberId();
      }
    });
  }

  getMemberId(): void {
    if (this.token){
      this._memberService.getMemberId(this.token).subscribe({
        next: (data) => {
          this.memberId = data.memberId
          if (!this.memberId){
            this.token = null;
          }
        },
        error: (error) => {
          this.token = null;
          this._errorService.errorHandler(error);
        }
      })
    }
  }

  sendPasswordResetEmail(): void {        
    this._memberService.sendResetPasswordEmail(this.email).subscribe({
      next: (data:any) => {
        console.log(data)
        this.resetSuccess = true
        this._alertService.alerte("Réinitialisation du mot de passe", "Un email a été envoyé pour réinitialiser votre mot de passe.")
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  resetPassword(): void {
    if (this.token) {
      this._memberService.resetPassword(this.token, this.newPassword, this.memberId).subscribe({
        next: (data) => {
          this.token = null;
          this._alertService.alerte('Mot de passe réinitialisé', 'Vous pouvez vous connecter avec votre nouveau mot de passe')
          this._router.navigate(['connexion'])
        },
        error: (error) => {
          this.token = null;
          this._errorService.errorHandler(error);
        }
      })
    }
  }

  checkIfEmpty() {
    return !this.email;
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.newPasswordConfirmation;
  }

}
