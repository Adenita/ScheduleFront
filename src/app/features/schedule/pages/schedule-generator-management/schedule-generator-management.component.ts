import { ChangeDetectorRef, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
        private cdr: ChangeDetectorRef,
    ) {
        console.log('constructor departments', this.departments);
    }

    ngOnInit() {
        this.getDepartments();
        console.log('ngOnInit departments', this.departments);
    }

    getDepartments() {
        this.departmentService
            .getAll()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (departmentListTransport: DepartmentListTransport) => {
                    console.log(
                        'Getting departments for the schedule generator!!!: ',
                        departmentListTransport.departmentTransportList,
                    );
                    this.departments = departmentListTransport.departmentTransportList;
                    this.cdr.detectChanges();
                    console.log('Departments is set: ', this.departments);
                },
            });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
