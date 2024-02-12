import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationManagerService } from '../core/services/authentication-manager.service';
import { Role } from '../shared/models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationManagerService: AuthenticationManagerService,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let user = this.authenticationManagerService.getUser();

    if (user && user.roles) {
      const { roles } = route.data;
      let hasPermission = false;

      if (roles) {
        hasPermission = user.roles.some((role: Role) => roles.includes(role));
      }

      return hasPermission;
    }

    this.router.navigate(['/']);
    return false;
  }
}
