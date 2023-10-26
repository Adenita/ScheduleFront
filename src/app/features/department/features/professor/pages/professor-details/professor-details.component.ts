import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SubjectDetailsTransport, SubjectTransport } from '../../../../../../shared/models/subject';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorDetailsTransport } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';

@Component({
  selector: 'app-professor-details',
  templateUrl: './professor-details.component.html',
  styleUrls: ['./professor-details.component.css'],
})
export class ProfessorDetailsComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  professorId: number = -1;
  numberToPreview: number = 3;
  professor: ProfessorDetailsTransport = {} as ProfessorDetailsTransport;
  previewSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private professorService: ProfessorService,
  ) {
    this.previewSubjects$ = new BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getRouteParams(this.route).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.professorId = this.routeParametersService.professorId;
      this.currentRoute = this.routeParametersService.setRoute('');
      this.getProfessor(this.professorId);
    });
  }

  getProfessor(professorId: number) {
    this.professorService
      .getProfessorDetails(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorDetails: ProfessorDetailsTransport) => {
          this.professor = professorDetails;
          this.previewSubjects$.next(professorDetails.subjectTransportList.slice(0, this.numberToPreview));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
