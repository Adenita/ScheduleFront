import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../core/services/http/department.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DepartmentTransport } from '../../shared/models/department';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  destroyed$: Subject<void> = new Subject<void>();
  departments: BehaviorSubject<DepartmentTransport[]>;

  constructor(
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

  navigateToPage(id: number, path?: string) {
    if (path) {
      this.router.navigate(['departments', id, path]);
    } else {
      this.router.navigate(['departments', id]);
    }
  }
}
