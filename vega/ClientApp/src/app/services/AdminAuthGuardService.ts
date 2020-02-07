import { AuthService } from './AuthService';
import { AuthGuardService } from './AuthGuardService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService extends AuthGuardService {

  constructor(authService: AuthService) {
    super(authService);
  }

  canActivate() {
    var isAuthenticated = super.canActivate();

    return isAuthenticated ? this.authService.isAdmin() : false;
  }
}
