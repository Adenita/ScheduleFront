import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Role } from '../shared/models/user';
import { StorageService } from '../core/services/storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let user = this.storageService.getUser();

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
