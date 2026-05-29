import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../auth/services/permission.service';
import { Role, UserTransport } from '../../shared/models/user';
import { StorageService } from '../../core/services/storage.service';
import { UserService } from '../../core/services/http/user.service';

type ManageDataOption = {
  title: string;
  description: string;
  icon: string;
  route: unknown[];
  adminOnly: boolean;
  tone: 'red' | 'blue' | 'yellow' | 'green';
};

@Component({
  selector: 'app-manage-data',
  standalone: false,
  templateUrl: './manage-data.component.html',
  styleUrls: ['./manage-data.component.scss'],
})
export class ManageDataComponent implements OnInit {
  isAdmin: boolean = false;
  currentUser?: UserTransport;

  constructor(
    private permissionService: PermissionService,
    private storageService: StorageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
    const storedUser = this.storageService.getUser();
    if (storedUser?.username) {
      this.userService.getUserByUsername(storedUser.username).subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (err) => console.error('Error fetching current user', err),
      });
    }
  }

  get options(): ManageDataOption[] {
    const departmentId = this.currentUser?.departmentTransport?.id;
    const departmentRoute = this.isAdmin || !departmentId ? ['/departments'] : ['/departments', departmentId];

    const options: ManageDataOption[] = [
      {
        title: 'Departments',
        description: 'Open department records and drill into department-specific data.',
        icon: 'bi-building',
        route: departmentRoute,
        adminOnly: false,
        tone: 'blue',
      },
      {
        title: 'Programs',
        description: 'Manage study programs across departments.',
        icon: 'bi-diagram-3',
        route: ['/programs'],
        adminOnly: true,
        tone: 'yellow',
      },
      {
        title: 'Professors',
        description: 'Manage professor records, ranks, subjects, and availability.',
        icon: 'bi-person-badge',
        route: ['/professors'],
        adminOnly: true,
        tone: 'green',
      },
      {
        title: 'Subjects',
        description: 'Review and maintain course definitions and requirements.',
        icon: 'bi-journal-text',
        route: ['/subjects'],
        adminOnly: true,
        tone: 'red',
      },
      {
        title: 'Classrooms',
        description: 'Manage rooms, capacity, and computer availability.',
        icon: 'bi-door-open',
        route: ['/classrooms'],
        adminOnly: true,
        tone: 'blue',
      },
      {
        title: 'Student Groups',
        description: 'Maintain groups used for schedule generation.',
        icon: 'bi-people',
        route: ['/student-groups'],
        adminOnly: true,
        tone: 'yellow',
      },
      {
        title: 'Users',
        description: 'Manage accounts, roles, and department links.',
        icon: 'bi-person-gear',
        route: ['/users'],
        adminOnly: true,
        tone: 'green',
      },
    ];

    return options.filter((option) => this.isAdmin || !option.adminOnly);
  }
}
