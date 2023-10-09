import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramDetailsTransport } from '../../shared/models/program';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SubjectTransport, SubjectDetailsTransport } from '../../shared/models/subject';
import { ProgramService } from '../../core/http/program.service';
import { RouteParametersService } from '../../core/services/route-parameters.service';
import { StudentGroupTransport } from '../../shared/models/student-group';

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
  previewSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  previewStudentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
  ) {
    this.previewSubjects$ = new BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>([]);
    this.previewStudentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getRouteParams(this.route).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
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
          this.previewSubjects$.next(programDetails.subjectsTransport.slice(0, this.numberToPreview));
          //this does not exist in back add it
          // this.previewStudentGroups$.next(programDetails.studentGroupTransports.slice(0, this.numberToPreview));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
