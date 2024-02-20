import { Component, OnInit } from '@angular/core';
import { Generate } from '../../core/services/generate';
import { DepartmentService } from '../../core/services/http/department.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DepartmentTransport } from '../../shared/models/department';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  destroyed$: Subject<void> = new Subject<void>();
  departments: BehaviorSubject<DepartmentTransport[]>;

  constructor(
    private generate: Generate,
    private departmentService: DepartmentService,
    private router: Router,
  ) {
    this.departments = new BehaviorSubject<DepartmentTransport[]>([]);
  }

  ngOnInit() {
    this.getDepartments();
  }
  getDepartments() {
    this.departmentService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (departments) => {
          this.departments.next(departments.departmentTransportList);
        },
        error: (err) => console.error('Error fetching departments', err),
      });
  }

  navigateToPage(path: string, id: number) {
    this.router.navigate([path, id, 'schedules']);
  }

  openGenerateModal() {
    this.generate.generate = true;
  }
}
