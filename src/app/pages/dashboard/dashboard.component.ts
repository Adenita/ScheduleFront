import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../auth/services/permission.service';
import { Role } from '../../shared/models/user';
import { DepartmentService } from '../../core/services/http/department.service';
import { UserService } from '../../core/services/http/user.service';
import { StorageService } from '../../core/services/storage.service';

type DashboardAction = {
  title: string;
  description: string;
  route: string[];
  roles: Role[];
  icon: string;
  tone: 'red' | 'blue' | 'yellow' | 'green';
  label: string;
  group: 'Schedule Management' | 'Data Management';
};

type DashboardStat = {
  label: string;
  value: number | string;
  icon: string;
  tone: 'red' | 'blue' | 'yellow' | 'green';
};

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  protected readonly Role = Role;
  username: string = '';
  stats: DashboardStat[] = [
    { label: 'Departments', value: 0, icon: 'bi-building', tone: 'blue' },
    { label: 'Users', value: 0, icon: 'bi-people', tone: 'green' },
    { label: 'Schedule tools', value: 2, icon: 'bi-calendar-check', tone: 'yellow' },
    { label: 'Data areas', value: 6, icon: 'bi-diagram-3', tone: 'red' },
  ];

  actions: DashboardAction[] = [
    {
      title: 'Review Schedules',
      description: 'Open department schedules and inspect program, professor, or classroom views.',
      route: ['schedule-center'],
      roles: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT],
      icon: 'bi-calendar3',
      tone: 'blue',
      label: 'View',
      group: 'Schedule Management',
    },
    {
      title: 'Generate Schedule',
      description: 'Create new schedule layouts for departments and prepare them for review.',
      route: ['schedule-center'],
      roles: [Role.ADMIN],
      icon: 'bi-magic',
      tone: 'yellow',
      label: 'Generate',
      group: 'Schedule Management',
    },
    {
      title: 'Manage Departments',
      description: 'Maintain departments, programs, professors, subjects, classrooms, and groups.',
      route: ['manage-data'],
      roles: [Role.ADMIN],
      icon: 'bi-folder2-open',
      tone: 'red',
      label: 'Academic Data',
      group: 'Data Management',
    },
    {
      title: 'Manage Users',
      description: 'Manage user accounts, roles, and department links from one place.',
      route: ['manage-data'],
      roles: [Role.ADMIN],
      icon: 'bi-person-gear',
      tone: 'green',
      label: 'Users',
      group: 'Data Management',
    },
    {
      title: 'My Teaching Timeslots',
      description: 'Jump into professor-focused schedule views for classes assigned to you.',
      route: ['me'],
      roles: [Role.PROFESSOR],
      icon: 'bi-clock-history',
      tone: 'blue',
      label: 'Professor',
      group: 'Schedule Management',
    },
    {
      title: 'My Class Schedule',
      description: 'Student schedule shortcuts will appear here when student accounts are enabled.',
      route: ['schedule-center'],
      roles: [Role.STUDENT],
      icon: 'bi-mortarboard',
      tone: 'green',
      label: 'Student',
      group: 'Schedule Management',
    },
  ];

  constructor(
    protected router: Router,
    private permissionService: PermissionService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.username = this.storageService.getUser()?.username || '';

    if (this.isAdmin) {
      this.loadAdminStats();
    }
  }

  get visibleActions(): DashboardAction[] {
    return this.actions.filter((action) => this.permissionService.hasAnyRole(action.roles));
  }

  get scheduleActions(): DashboardAction[] {
    return this.visibleActions.filter((action) => action.group === 'Schedule Management');
  }

  get dataActions(): DashboardAction[] {
    return this.visibleActions.filter((action) => action.group === 'Data Management');
  }

  get isAdmin(): boolean {
    return this.permissionService.hasRole(Role.ADMIN);
  }

  get isProfessor(): boolean {
    return this.permissionService.hasRole(Role.PROFESSOR);
  }

  get isStudent(): boolean {
    return this.permissionService.hasRole(Role.STUDENT);
  }

  navigate(action: DashboardAction) {
    this.router.navigate(action.route);
  }

  private loadAdminStats() {
    this.departmentService.getAll().subscribe({
      next: (departments) => {
        this.updateStat('Departments', departments.departmentTransportList.length);
      },
      error: () => this.updateStat('Departments', 0),
    });

    this.userService.getAll().subscribe({
      next: (users) => {
        this.updateStat('Users', users.userTransports.length);
      },
      error: () => this.updateStat('Users', 0),
    });
  }

  private updateStat(label: string, value: number | string) {
    this.stats = this.stats.map((stat) => (stat.label === label ? { ...stat, value } : stat));
  }
}
