import { AuthService } from './AuthService';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(protected authService: AuthService) { }

  canActivate() {
    if (this.authService.loggedIn)
      return true;

    this.authService.login();
    return false;
  }
}
