import { Component, OnDestroy, OnInit } from '@angular/core';
import { DepartmentListTransport, DepartmentTransport } from '../../../../shared/models/department';
import { Subject, takeUntil } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../../core/services/http/department.service';

@Component({
  selector: 'app-schedule-generator-management',
  standalone: false,
  templateUrl: './schedule-generator-management.component.html',
  styleUrls: ['./schedule-generator-management.component.scss'],
})
export class ScheduleGeneratorManagementComponent implements OnInit, OnDestroy {
  departments: DepartmentTransport[] = [];

  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
  ) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (departmentListTransport: DepartmentListTransport) => {
          this.departments = departmentListTransport.departmentTransportList;
        },
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
