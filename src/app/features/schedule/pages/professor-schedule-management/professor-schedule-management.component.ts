import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { ProfessorTransport } from '../../../../shared/models/professor';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ProfessorService } from '../../../../core/services/http/professor.service';
import { ScheduleRouteService } from '../../services/schedule-route.service';

@Component({
  selector: 'app-professor-schedule-management',
  standalone: false,
  templateUrl: './professor-schedule-management.component.html',
  styleUrls: ['./professor-schedule-management.component.scss'],
})
export class ProfessorScheduleManagementComponent implements OnInit, OnDestroy {
  scheduleId: number = -1;
  professorId: number = -1;
  departmentId: number = -1;
  loadedProfessorsDepartmentId: number = -1;

  professorSchedule$!: BehaviorSubject<ScheduleTransport>;
  professors!: ProfessorTransport[];
  selectedProfessor$: BehaviorSubject<ProfessorTransport> = new BehaviorSubject({} as ProfessorTransport);
  professorName: string = '';

  searchValue: string = '';
  filteredProfessors$: BehaviorSubject<ProfessorTransport[]>;

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scheduleDataService: ScheduleDataService,
    private departmentService: DepartmentService,
    private professorService: ProfessorService,
    private scheduleRouteService: ScheduleRouteService,
  ) {
    this.professorSchedule$ = new BehaviorSubject({} as ScheduleTransport);
    this.filteredProfessors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      this.scheduleId = Number(params.get('scid')) || -1;
      this.professorId = Number(params.get('ppid')) || -1;
      this.departmentId = this.scheduleRouteService.getDepartmentId(this.activatedRoute);

      this.getInitialProfessor(this.professorId);
      this.getScheduleForProfessor(this.scheduleId, this.professorId);

      if (this.departmentId !== -1 && this.departmentId !== this.loadedProfessorsDepartmentId) {
        this.loadedProfessorsDepartmentId = this.departmentId;
        this.getDepartmentProfessors(this.departmentId);
      }
    });
  }

  getDepartmentProfessors(departmentId: number) {
    this.departmentService
      .getProfessorsPerDepartment(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorListTransport) => {
          this.professors = professorListTransport.professorTransports;
          // this.selectedProfessor$.next(this.professors[0]);
          this.filteredProfessors$.next(this.professors);
        },
      });
  }

  getScheduleForProfessor(scheduleId: number, professorId: number) {
    if (scheduleId === -1 || professorId === -1) {
      console.warn('Cannot load professor schedule because route ids are invalid', {
        scheduleId,
        professorId,
        departmentId: this.departmentId,
      });
      return;
    }

    this.scheduleDataService
      .getScheduleForProfessor(scheduleId, professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (schedule) => {
          this.professorSchedule$.next(schedule);
        },
      });
  }

  loadProfessorSchedule(professor: ProfessorTransport) {
    this.selectedProfessor$.next(professor);
    this.professorName = professor.name;
    this.router.navigate(this.scheduleRouteService.getScheduleEntityRoute(this.departmentId, this.scheduleId, 'professors', professor.id));
  }

  getInitialProfessor(professorId: number) {
    if (professorId === -1) {
      console.warn('Cannot load initial professor because professorId is invalid', {
        professorId,
      });
      return;
    }

    this.professorService
      .get(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorTransport) => {
          this.professorName = professorTransport.name;
          this.selectedProfessor$.next(professorTransport);
        },
      });
  }

  goBack() {
    if (this.departmentId !== -1) {
      this.router.navigate(['departments', this.departmentId, 'schedules']);
    } else {
      this.router.navigate(['schedules']);
    }
  }

  onSearch(event: any) {
    this.searchValue = event.target.value;
    this.filteredProfessors$.next(
      this.professors.filter((professor) => professor.name.toLowerCase().includes(this.searchValue.toLowerCase())),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
