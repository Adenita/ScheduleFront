import { Injectable } from '@angular/core';
import { Role } from '../../shared/models/user';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    constructor(private storageService: StorageService) {}
    hasRole(role: Role): boolean {
        const user = this.storageService.getUser();
        if (user && user.roles) {
            return !!user.roles.includes(role);
        }
        return false;
    }

    hasAnyRole(roles: Role[]): boolean {
        const user = this.storageService.getUser();
        if (user && user.roles) {
            return !!user.roles.some((role: Role) => roles.includes(role));
        }
        return false;
    }
}
