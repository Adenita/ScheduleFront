import { Component, OnInit } from '@angular/core';
import { AuthenticationManagerService } from './core/services/authentication-manager.service';
import { StorageService } from './core/services/storage.service';
import { PermissionService } from './auth/services/permission.service';
import { Role, UserTransport } from './shared/models/user';
import { UserService } from './core/services/http/user.service';

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    isAdmin: boolean = false;
    isProfessor: boolean = false;
    isStudent: boolean = false;
    isSidebarCollapsed: boolean = false;
    username: string | null = '';
    currentUser?: UserTransport;

    constructor(
        private authenticationManagerService: AuthenticationManagerService,
        private storageService: StorageService,
        private permissionService: PermissionService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.storageService.storedUser$.subscribe({
            next: (storedUser) => {
                if (storedUser) {
                    this.username = storedUser.username;
                    this.loadCurrentUser(storedUser.username);
                } else {
                    this.username = '';
                    this.currentUser = undefined;
                }
                this.isLoggedIn = !!storedUser;
                this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
                this.isProfessor = this.permissionService.hasRole(Role.PROFESSOR);
                this.isStudent = this.permissionService.hasRole(Role.STUDENT);
            },
        });
    }

    get linkedDepartmentId(): number | undefined {
        return this.currentUser?.departmentTransport?.id;
    }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    logout() {
        this.authenticationManagerService.logout();
    }

    private loadCurrentUser(username: string) {
        this.userService.getUserByUsername(username).subscribe({
            next: (user) => {
                this.currentUser = user;
            },
            error: (err) => console.error('Error fetching current user', err),
        });
    }
}
