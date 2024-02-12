import { Injectable } from '@angular/core';
import { Role } from '../../shared/models/user';
import { AuthenticationManagerService } from '../../core/services/authentication-manager.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authenticationManagerService: AuthenticationManagerService) {}
  hasRole(role: Role): boolean {
    const user = this.authenticationManagerService.getUser();
    if (user.roles) {
      return !!user.roles.includes(role);
    }
    return false;
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.authenticationManagerService.getUser();
    if (user.roles) {
      return !!user.roles.some((role: Role) => roles.includes(role));
    }
    return false;
  }
}
