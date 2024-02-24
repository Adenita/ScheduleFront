import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramDetailsTransport, ProgramTransport } from '../../../../../../shared/models/program';
import { BehaviorSubject, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SubjectTransport } from '../../../../../../shared/models/subject';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { StudentGroupTransport } from '../../../../../../shared/models/student-group';
import { ProfessorTransport } from '../../../../../../shared/models/professor';
import { Program } from '@angular/compiler-cli';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  program: ProgramDetailsTransport = {} as ProgramDetailsTransport;
  previewSubjects$: BehaviorSubject<SubjectTransport[]>;
  previewStudentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  previewProfessors$: BehaviorSubject<ProfessorTransport[]>;
  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  @Input()
  selectedProgram$!: BehaviorSubject<ProgramTransport>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeParametersService: RouteParametersService,
  ) {
    this.previewSubjects$ = new BehaviorSubject<SubjectTransport[]>([]);
    this.previewStudentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
    this.previewProfessors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getNestedRouteParams(this.router).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.currentRoute = this.routeParametersService.setRoute('');
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
