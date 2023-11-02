import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramDetailsTransport } from '../../../../../../shared/models/program';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SubjectTransport } from '../../../../../../shared/models/subject';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { StudentGroupTransport } from '../../../../../../shared/models/student-group';
import { ProfessorTransport } from '../../../../../../shared/models/professor';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.css'],
})
export class ProgramDetailsComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  numberToPreview: number = 3;
  program: ProgramDetailsTransport = {} as ProgramDetailsTransport;
  previewSubjects$: BehaviorSubject<SubjectTransport[]>;
  previewStudentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  previewProfessors$: BehaviorSubject<ProfessorTransport[]>;
  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
  ) {
    this.previewSubjects$ = new BehaviorSubject<SubjectTransport[]>([]);
    this.previewStudentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
    this.previewProfessors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getRouteParams(this.route).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.currentRoute = this.routeParametersService.setRoute('');
      this.getProgram(this.programId);
    });
  }

  getProgram(programId: number) {
    this.programService
      .getProgramDetails(programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (programDetails: ProgramDetailsTransport) => {
          this.program = programDetails;
          this.previewSubjects$.next(programDetails.subjectTransports?.slice(0, this.numberToPreview));
          this.previewStudentGroups$.next(programDetails.studentGroupTransports?.slice(0, this.numberToPreview));
          this.previewProfessors$.next(programDetails.professorTransports?.slice(0, this.numberToPreview));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
